import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";

import { NextResponse } from "next/server";

// Get Dashboard Data for Admin ( total orders, total stores, total products, total revenue )

export async function GET(request){

    try {
        // TODO: Use Firebase Auth for authentication and admin check
        // Example: const userId = ...;
        // const isAdmin = await authAdmin(userId)
        // if (!isAdmin) {
        //     return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        // }

    // Get total orders
    const orders = await prisma.order.count()
    // Get total stores on app
    const stores = await prisma.store.count()
    // get all orders include only createdAt and total & calculate total revenue
    const allOrders = await prisma.order.findMany({
        select: {
            createdAt: true,
            total: true,
        }
    })

    let totalRevenue = 0
    allOrders.forEach(order => {
        totalRevenue += order.total
    })

    const revenue = totalRevenue.toFixed(2)
    // total products on app
     const products = await prisma.product.count()
    
    // Get total unique customers (users who have placed orders)
    const customersData = await prisma.order.findMany({
        select: {
            userId: true
        },
        distinct: ['userId']
    })
    const customers = customersData.length

    const dashboardData = {
        orders,
        stores,
        products,
        revenue,
        customers,
        allOrders
    }

    return NextResponse.json({dashboardData})

    } catch (error) {
         console.error(error);
         return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
    

}