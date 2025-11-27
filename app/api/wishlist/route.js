import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// GET - Fetch user's wishlist
export async function GET(request) {
    try {
        // Firebase Auth: Extract token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        // Import admin SDK dynamically to avoid SSR issues
        const { getAuth } = await import('firebase-admin/auth');
        const { initializeApp, applicationDefault, getApps } = await import('firebase-admin/app');
        if (getApps().length === 0) {
            initializeApp({ credential: applicationDefault() });
        }
        let decodedToken;
        try {
            decodedToken = await getAuth().verifyIdToken(idToken);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const userId = decodedToken.uid;
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        store: true,
                        rating: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ wishlist: wishlistItems });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

// POST - Add/Remove product from wishlist
export async function POST(request) {
    try {
        // Firebase Auth: Extract token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const { getAuth } = await import('firebase-admin/auth');
        const { initializeApp, applicationDefault, getApps } = await import('firebase-admin/app');
        if (getApps().length === 0) {
            initializeApp({ credential: applicationDefault() });
        }
        let decodedToken;
        try {
            decodedToken = await getAuth().verifyIdToken(idToken);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const userId = decodedToken.uid;
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, action } = await request.json();

        if (!productId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (action === 'add') {
            // Check if already in wishlist
            const existing = await prisma.wishlistItem.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            });

            if (existing) {
                return NextResponse.json({ message: 'Already in wishlist', inWishlist: true });
            }

            // Add to wishlist
            await prisma.wishlistItem.create({
                data: {
                    userId,
                    productId
                }
            });

            return NextResponse.json({ message: 'Added to wishlist', inWishlist: true });
        } else if (action === 'remove') {
            // Remove from wishlist
            await prisma.wishlistItem.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            });

            return NextResponse.json({ message: 'Removed from wishlist', inWishlist: false });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error updating wishlist:', error);
        return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }
}
