import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";


// POST: Approve or reject a review
export async function POST(request) {
    try {

        const store = await authSeller(userId);
        if (!store) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { reviewId, approved } = await request.json();

        if (!reviewId || typeof approved !== 'boolean') {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const review = await prisma.rating.findUnique({
            where: { id: reviewId },
            include: {
                product: {
                    select: {
                        storeId: true
                    }
                }
            }
        });

        if (!review) {
            return Response.json({ error: "Review not found" }, { status: 404 });
        }

        if (review.product.storeId !== store.id) {
            return Response.json({ error: "Unauthorized to modify this review" }, { status: 403 });
        }

        const updatedReview = await prisma.rating.update({
            where: { id: reviewId },
            data: { approved }
        });

        return Response.json({
            success: true,
            message: approved ? "Review approved successfully" : "Review rejected successfully",
            review: updatedReview
        });

    } catch (error) {
        console.error('Review approval error:', error);
        return Response.json({
            error: error.message || "Failed to update review"
        }, { status: 500 });
    }
}
