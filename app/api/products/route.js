export async function POST(request) {
    try {
        const body = await request.json();
        const { name, description, shortDescription, mrp, price, images, category, sku, inStock, hasVariants, variants, attributes, hasBulkPricing, bulkPricing, fastDelivery, allowReturn, allowReplacement, storeId, slug } = body;

        // Generate slug from name if not provided
        const productSlug = slug || name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Check if slug is unique
        const existing = await prisma.product.findUnique({ where: { slug: productSlug } });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists. Please use a different product name." }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug: productSlug,
                description,
                shortDescription,
                mrp,
                price,
                images,
                category,
                sku,
                inStock,
                hasVariants,
                variants,
                attributes,
                hasBulkPricing,
                bulkPricing,
                fastDelivery,
                allowReturn,
                allowReplacement,
                storeId,
            }
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: "Failed to create product", details: error.message }, { status: 500 });
    }
}
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        const { searchParams } = new URL(request.url);
        const sortBy = searchParams.get('sortBy');
        // Fetch products with only essential data and active stores, but filter out any with missing/invalid store relation in JS
        let products = await prisma.product.findMany({
            where: { inStock: true },
            select: {
                id: true,
                slug: true,
                name: true,
                description: true,
                shortDescription: true,
                mrp: true,
                price: true,
                images: true,
                category: true,
                sku: true,
                inStock: true,
                hasVariants: true,
                variants: true,
                attributes: true,
                hasBulkPricing: true,
                bulkPricing: true,
                fastDelivery: true,
                allowReturn: true,
                allowReplacement: true,
                storeId: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        rating: true,
                        orderItems: true
                    }
                },
                rating: {
                    select: {
                        rating: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        logo: true,
                        isActive: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        // Defensive: filter and log products with missing/invalid store
        const validProducts = [];
        for (const p of products) {
            if (!p.store || !p.store.isActive) {
                console.warn('[products API] Skipping product with invalid or inactive store:', p.id, p.storeId);
                continue;
            }
            validProducts.push(p);
        }
        products = validProducts;
        // Calculate metrics and add label/labelType for each product
        products = products.map(product => {
            const avgRating = product.rating?.length > 0
                ? product.rating.reduce((sum, r) => sum + r.rating, 0) / product.rating.length
                : 0;
            const { rating, _count, ...productData } = product;
            // Calculate discount percent
            let label = null;
            let labelType = null;
            if (typeof product.mrp === 'number' && typeof product.price === 'number' && product.mrp > product.price) {
                const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
                if (discount >= 50) {
                    label = `Min. ${discount}% Off`;
                    labelType = 'offer';
                } else if (discount > 0) {
                    label = `${discount}% Off`;
                    labelType = 'offer';
                }
            }
            // You can add more label logic here if needed
            return {
                ...productData,
                totalOrders: _count.orderItems,
                averageRating: avgRating,
                ratingCount: _count.rating,
                label,
                labelType
            };
        });
        // Sort based on the sortBy parameter
        if (sortBy === 'orders') {
            products = products.sort((a, b) => b.totalOrders - a.totalOrders);
        } else if (sortBy === 'rating') {
            products = products.sort((a, b) => b.averageRating - a.averageRating);
        }
        // Already sorted by createdAt desc for 'newest'
        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error in products API:', error);
        if (error instanceof Error && error.stack) {
            console.error('Stack trace:', error.stack);
        }
        return NextResponse.json({ error: "An internal server error occurred.", details: error.message, stack: error.stack }, { status: 500 });
    }
}