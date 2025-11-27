
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import imagekit from "@/configs/imageKit";
import { getAuth } from "@/lib/firebase-admin";


// GET: Fetch all reviews for store's products
export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await getAuth().verifyIdToken(idToken);
        } catch (err) {
            return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
        }
        const userId = decodedToken.uid;

        const storeId = await authSeller(userId);
        if (!storeId) {
            return Response.json({ error: "Not authorized" }, { status: 401 });
        }

        // Get all products for this store
        const products = await prisma.product.findMany({
            where: { storeId },
            include: {
                rating: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        return Response.json({ products });

    } catch (error) {
        console.error('Fetch store reviews error:', error);
        return Response.json({
            error: error.message || "Failed to fetch reviews"
        }, { status: 500 });
    }
}

// POST: Store manually adds a review for a product
export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await getAuth().verifyIdToken(idToken);
        } catch (err) {
            return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
        }
        const userId = decodedToken.uid;

        const storeId = await authSeller(userId);
        if (!storeId) {
            return Response.json({ error: "Not authorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const productId = formData.get('productId');
        const rating = Number(formData.get('rating'));
        const review = formData.get('review');
        const customerName = formData.get('customerName');
        const customerEmail = formData.get('customerEmail');
        const images = formData.getAll('images');

        if (!productId || !rating || !review || !customerName || !customerEmail) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify product belongs to this store
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                storeId
            }
        });

        if (!product) {
            return Response.json({ error: "Product not found or not authorized" }, { status: 403 });
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

        // Find or create user for this email
        let user = await prisma.user.findFirst({
            where: { email: customerEmail }
        });

        if (!user) {
            // Create a placeholder user
            user = await prisma.user.create({
                data: {
                    id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    email: customerEmail,
                    name: customerName,
                    image: '/placeholder-avatar.png'
                }
            });
        }

        // Create review (manually added reviews are auto-approved)
        const newReview = await prisma.rating.create({
            data: {
                userId: user.id,
                productId,
                rating,
                review,
                images: imageUrls,
                approved: true // Store-added reviews are auto-approved
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
            message: "Review added successfully",
            review: newReview
        });

    } catch (error) {
        console.error('Manual review submission error:', error);
        return Response.json({
            error: error.message || "Failed to submit review"
        }, { status: 500 });
    }
}
