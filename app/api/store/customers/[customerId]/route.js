import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

// Get individual customer details with full order history
export async function GET(request, { params }) {
    try {
        // Firebase Auth: get Bearer token from header
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const idToken = authHeader.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = await getAuth().verifyIdToken(idToken);
        } catch (e) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = decodedToken.uid;
        const storeId = await authSeller(userId);
        const customerId = params.customerId;

        // Get customer information
        const customer = await prisma.user.findUnique({
            where: { id: customerId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            }
        });

        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Get all orders from this customer for this store
        const orders = await prisma.order.findMany({
            where: {
                userId: customerId,
                storeId: storeId
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Convert orderItems to items format
        const ordersWithItems = orders.map(order => ({
            ...order,
            items: JSON.stringify(order.orderItems.map(item => ({
                name: item.product?.name || 'Product',
                price: item.price,
                quantity: item.quantity
            })))
        }));

        // Get abandoned cart for this customer (if exists)
        const abandonedCart = await prisma.abandonedCart.findUnique({
            where: {
                userId_storeId: {
                    userId: customerId,
                    storeId: storeId
                }
            }
        });

        // Calculate statistics
        const totalSpent = ordersWithItems.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = ordersWithItems.length;
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        const customerDetails = {
            ...customer,
            totalOrders,
            totalSpent,
            averageOrderValue: Math.round(averageOrderValue),
            firstOrderDate: ordersWithItems.length > 0 ? ordersWithItems[ordersWithItems.length - 1].createdAt : null,
            lastOrderDate: ordersWithItems.length > 0 ? ordersWithItems[0].createdAt : null,
            orders: ordersWithItems,
            abandonedCart
        };

        return NextResponse.json({ customer: customerDetails });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
