import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebase-admin";

// PUT - Update a category
export async function PUT(req, { params }) {
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

        const { id } = await params;
        const { name, description, image, parentId } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Check if slug already exists (excluding current category)
        const existingCategory = await prisma.category.findFirst({
            where: {
                slug,
                NOT: { id }
            }
        });

        if (existingCategory) {
            return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 });
        }

        // Update category
        const category = await prisma.category.update({
            where: { id },
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

        return NextResponse.json({ category }, { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

// DELETE - Delete a category
export async function DELETE(req, { params }) {
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

        const { id } = await params;

        // Check if category has children
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                children: true
            }
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        if (category.children.length > 0) {
            return NextResponse.json({ 
                error: "Cannot delete category with subcategories. Please delete subcategories first." 
            }, { status: 400 });
        }

        // Delete category
        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
