import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    const where = {
      ...(section ? { section } : {}),
      ...(category ? { category } : {}),
      ...(tag ? { tag } : {}),
    };

    const selections = await prisma.homeSelection.findMany({ where, orderBy: { updatedAt: "desc" } });

    // If a section is specified, return products resolved for the first matching selection
    if (section && selections[0]) {
      const ids = selections[0].productIds || [];
      if (ids.length === 0) return NextResponse.json({ products: [], selection: selections[0] });

      const products = await prisma.product.findMany({
        where: { id: { in: ids }, inStock: true },
        include: { store: true, rating: true },
      });

      // keep order as in ids
      const orderMap = new Map(ids.map((id, i) => [id, i]));
      products.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));

      // filter out inactive stores
      const activeProducts = products.filter((p) => p.store?.isActive);
      return NextResponse.json({ products: activeProducts, selection: selections[0] });
    }

    return NextResponse.json({ selections });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.code || error.message }, { status: 400 });
  }
}
