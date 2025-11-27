import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/home/sections
// Returns active homepage selections with product details and optional slides
export async function GET() {
  try {
    // If database env is missing (build/preview), return empty payload gracefully
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ sections: [] });
    }
    const selections = await prisma.homeSelection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    // Map each selection to include product data in the provided order
    const payload = await Promise.all(
      selections.map(async (sel) => {
        let products = [];
        if (sel.productIds?.length) {
          const found = await prisma.product.findMany({
            where: { id: { in: sel.productIds } },
            select: {
              id: true,
              name: true,
              price: true,
              mrp: true,
              images: true,
              inStock: true,
            },
          });
          // Preserve order based on productIds
          const byId = new Map(found.map((p) => [p.id, p]));
          products = sel.productIds
            .map((id) => byId.get(id))
            .filter(Boolean)
            .map((p) => ({
              ...p,
              image: p.images?.[0] || null,
              offLabel:
                p.mrp && p.mrp > p.price
                  ? `Min. ${Math.max(0, Math.round(((p.mrp - p.price) / p.mrp) * 100))}% Off`
                  : null,
            }));
        }

        return {
          id: sel.id,
          key: sel.section,
          title: sel.title,
          subtitle: sel.subtitle,
          slides: sel.slides || [],
          layout: sel.layout,
          bannerCtaText: sel.bannerCtaText,
          bannerCtaLink: sel.bannerCtaLink,
          products,
        };
      })
    );

    return NextResponse.json({ sections: payload });
  } catch (error) {
    console.error("/api/home/sections error", error);
    // Degrade gracefully for homepage; avoid noisy 500 in client console
    return NextResponse.json({ sections: [] });
  }
}
