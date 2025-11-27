import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebase-admin";
import authAdmin from "@/middlewares/authAdmin";

// GET - Fetch all categories with their children
export async function GET(req) {
    try {
        // Firebase Auth: get Bearer token from header
        const authHeader = req.headers.get("authorization");
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

        // Get all categories with their children
        const categories = await prisma.category.findMany({
            include: {
                children: {
                    orderBy: { name: 'asc' }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

// POST - Create a new category
export async function POST(req) {

    try {
        // Firebase Auth: get Bearer token from header
        const authHeader = req.headers.get("authorization");
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
        const email = decodedToken.email;
        // Allow if admin, else fallback to store owner check
        let isAuthorized = false;
        if (userId && email && await authAdmin(userId, email)) {
            isAuthorized = true;
        } else if (userId) {
            // Check if user has a store (original logic)
            const store = await prisma.store.findUnique({
                where: { userId }
            });
            if (store) {
                isAuthorized = true;
            }
        }
        if (!isAuthorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description, image, parentId } = await req.json();
        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Check if slug already exists
        const existingCategory = await prisma.category.findUnique({
            where: { slug }
        });

        if (existingCategory) {
            return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 });
        }

        // Create category
        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description: description || null,
                image: image || null,
                parentId: parentId || null
            },
            include: {
                parent: true,
                children: true
            }
        });

        return NextResponse.json({ category }, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
