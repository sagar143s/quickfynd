import prisma from "@/lib/prisma";
import imagekit from "@/configs/imageKit";


// POST: Customer adds a review with images
export async function POST(request) {
    try {

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const productId = formData.get('productId');
        const rating = Number(formData.get('rating'));
        const review = formData.get('review');
        const images = formData.getAll('images');

        if (!productId || !rating || !review) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if customer has purchased this product
        const purchasedOrder = await prisma.order.findFirst({
            where: {
                userId,
                orderItems: {
                    some: {
                        productId
                    }
                },
                status: {
                    in: ['DELIVERED', 'SHIPPED', 'ORDER_PLACED'] // Allow reviews after order is placed
                }
            },
            select: {
                id: true
            }
        });

        if (!purchasedOrder) {
            return Response.json({ 
                error: "You can only review products you have purchased" 
            }, { status: 403 });
        }

        // Upload images to ImageKit
        let imageUrls = [];
        if (images.length > 0) {
            imageUrls = await Promise.all(
                images.map(async (image) => {
                    const buffer = Buffer.from(await image.arrayBuffer());
                    const response = await imagekit.upload({
                        file: buffer,
                        fileName: `review_${Date.now()}_${image.name}`,
                        folder: "reviews"
                    });
                    return imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: "auto" },
                            { format: "webp" },
                            { width: "600" }
                        ]
                    });
                })
            );
        }

        // Create or update review (requires approval)
        const newReview = await prisma.rating.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            update: {
                rating,
                review,
                images: imageUrls,
                orderId: purchasedOrder.id,
                approved: false // Reset approval on update
            },
            create: {
                userId,
                productId,
                rating,
                review,
                images: imageUrls,
                orderId: purchasedOrder.id,
                approved: false // Requires approval
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        return Response.json({
            success: true,
            message: "Review submitted successfully and pending approval",
            review: newReview
        });

    } catch (error) {
        console.error('Review submission error:', error);
        return Response.json({
            error: error.message || "Failed to submit review"
        }, { status: 500 });
    }
}

// GET: Fetch reviews for a product
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return Response.json({ error: "Product ID required" }, { status: 400 });
        }

        // Only show approved reviews to customers
        const reviews = await prisma.rating.findMany({
            where: { 
                productId,
                approved: true 
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return Response.json({ reviews });

    } catch (error) {
        console.error('Fetch reviews error:', error);
        return Response.json({
            error: error.message || "Failed to fetch reviews"
        }, { status: 500 });
    }
}
