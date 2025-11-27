import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
// TODO: Import your Firebase Auth server-side utilities here
import authAdmin from "@/middlewares/authAdmin";

// GET - Fetch all home sections
export async function GET(request) {
    try {
        const sections = await prisma.homeSelection.findMany({
            orderBy: { sortOrder: 'asc' }
        });

        return NextResponse.json({ sections });
    } catch (error) {
        console.error('Error fetching home sections:', error);
        return NextResponse.json(
            { error: "Failed to fetch home sections" },
            { status: 500 }
        );
    }
}

// POST - Create new home section
export async function POST(request) {
    try {
        // TODO: Replace with your Firebase Auth server-side authentication logic
        // Example: const userId = await getFirebaseUserId(request);
        // Example: const isAdmin = await authAdmin(userId);
        // if (!isAdmin) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

    const body = await request.json();
    const { section, category, tag, productIds, title, subtitle, slides, /* slidesData */ bannerCtaText, bannerCtaLink, layout, isActive, sortOrder } = body;

        // 'section' is a required key per schema (HomeSelection.section)
        if (!section) {
            return NextResponse.json(
                { error: "Section key is required" },
                { status: 400 }
            );
        }

        const newSection = await prisma.homeSelection.create({
            data: {
                section,
                category: category || null,
                tag: tag || null,
                productIds: productIds || [],
                title: title || section,
                subtitle: subtitle || null,
                slides: slides || [],
                bannerCtaText: bannerCtaText || null,
                bannerCtaLink: bannerCtaLink || null,
                layout: layout || 'deals_with_banner',
                isActive: typeof isActive === 'boolean' ? isActive : true,
                sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
            }
        });

        return NextResponse.json({ section: newSection }, { status: 201 });
    } catch (error) {
        console.error('Error creating home section:', error);
        return NextResponse.json(
            { error: "Failed to create home section" },
            { status: 500 }
        );
    }
}
