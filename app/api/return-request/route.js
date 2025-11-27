import prisma from "@/lib/prisma";
import imagekit from "@/configs/imageKit";

import { NextResponse } from "next/server";

// Get user's return requests
export async function GET(request) {
    try {

        if (!userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        const requests = await prisma.returnRequest.findMany({
            where: { userId },
            include: {
                store: {
                    select: {
                        name: true,
                        username: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('Error fetching return requests:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Create return/replacement request
export async function POST(request) {
    try {

        if (!userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        const contentType = request.headers.get('content-type') || '';

        let orderId, type, reason, description, fastProcess;
        let images = [];
        let videos = [];
        let productRating = null;
        let deliveryRating = null;
        let reviewText = null;

        if (contentType.includes('multipart/form-data')) {
            // Handle form-data submission with file uploads
            const form = await request.formData();
            orderId = form.get('orderId');
            type = form.get('type');
            reason = form.get('reason');
            description = form.get('description') || '';
            fastProcess = (form.get('fastProcess') === 'true');
            productRating = form.get('productRating') ? Number(form.get('productRating')) : null;
            deliveryRating = form.get('deliveryRating') ? Number(form.get('deliveryRating')) : null;
            reviewText = form.get('reviewText') || null;

            // Upload images
            const imageFiles = form.getAll('images');
            if (imageFiles && imageFiles.length > 0) {
                const uploaded = await Promise.all(
                    imageFiles.map(async (file) => {
                        if (typeof file === 'string') return file; // in case URL passed
                        const buffer = Buffer.from(await file.arrayBuffer());
                        const resp = await imagekit.upload({
                            file: buffer,
                            fileName: `return_${Date.now()}_${file.name}`,
                            folder: "returns/images",
                        });
                        return imagekit.url({
                            path: resp.filePath,
                            transformation: [
                                { quality: "auto" },
                                { format: "webp" },
                                { width: "800" }
                            ]
                        });
                    })
                );
                images = uploaded;
            }

            // Upload videos (optional, single or multiple)
            const videoFiles = form.getAll('videos');
            if (videoFiles && videoFiles.length > 0) {
                const uploadedVids = await Promise.all(
                    videoFiles.map(async (file) => {
                        if (typeof file === 'string') return file;
                        const buffer = Buffer.from(await file.arrayBuffer());
                        const resp = await imagekit.upload({
                            file: buffer,
                            fileName: `return_${Date.now()}_${file.name}`,
                            folder: "returns/videos",
                        });
                        return imagekit.url({
                            path: resp.filePath,
                            transformation: [
                                { quality: "auto" },
                                { format: "mp4" },
                                { width: "1280" }
                            ]
                        });
                    })
                );
                videos = uploadedVids;
            }
        } else {
            // Handle JSON body (backward compatible)
            const body = await request.json();
            orderId = body.orderId;
            type = body.type;
            reason = body.reason;
            description = body.description || '';
            images = body.images || [];
            videos = body.videos || [];
            fastProcess = body.fastProcess || false;
            productRating = body.productRating ?? null;
            deliveryRating = body.deliveryRating ?? null;
            reviewText = body.reviewText ?? null;
        }

        if (!orderId || !type || !reason) {
            return NextResponse.json({ error: "missing required fields" }, { status: 400 });
        }

        // Verify order exists and belongs to user
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Check if order was delivered and within allowed window per type (Return: 7 days, Replacement: 15 days)
        if (order.status !== 'DELIVERED') {
            return NextResponse.json({ error: "Order must be delivered to request return/replacement" }, { status: 400 });
        }

        const deliveredDate = order.updatedAt; // Assuming updatedAt is when status changed to DELIVERED
        const daysSinceDelivery = Math.floor((new Date() - deliveredDate) / (1000 * 60 * 60 * 24));
        const maxDays = (type === 'REPLACEMENT') ? 15 : 7;

        if (daysSinceDelivery > maxDays) {
            const msg = type === 'REPLACEMENT'
                ? "Replacement window has expired (15 days from delivery)"
                : "Return window has expired (7 days from delivery)";
            return NextResponse.json({ error: msg }, { status: 400 });
        }

        // Check if all products in the order allow returns/replacements
        const orderWithItems = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const invalidProducts = orderWithItems.orderItems.filter(item => {
            if (type === 'RETURN' && !item.product.allowReturn) {
                return true;
            }
            if (type === 'REPLACEMENT' && !item.product.allowReplacement) {
                return true;
            }
            return false;
        });

        if (invalidProducts.length > 0) {
            const productNames = invalidProducts.map(item => item.product.name).join(', ');
            return NextResponse.json({ 
                error: `The following products do not allow ${type.toLowerCase()}: ${productNames}` 
            }, { status: 400 });
        }

        // Check if request already exists for this order
        const existingRequest = await prisma.returnRequest.findFirst({
            where: {
                orderId,
                userId
            }
        });

        if (existingRequest) {
            return NextResponse.json({ error: "Return/replacement request already exists for this order" }, { status: 400 });
        }

        // Create return request
        const returnRequest = await prisma.returnRequest.create({
            data: {
                orderId,
                userId,
                storeId: order.storeId,
                type,
                reason,
                description: description || '',
                images: images || [],
                videos: videos || [],
                fastProcess: fastProcess || false,
                productRating: productRating ?? null,
                deliveryRating: deliveryRating ?? null,
                reviewText: reviewText ?? null
            }
        });

        return NextResponse.json({ 
            message: "Return/replacement request submitted successfully",
            request: returnRequest 
        });
    } catch (error) {
        console.error('Error creating return request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
