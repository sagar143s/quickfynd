'use client'
import { useMemo } from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/components/ProductCard";
import PageTitle from "@/components/PageTitle";

export default function NewProductsPage() {
    const products = useSelector(state => state.product.list);

    // Sort products by creation date (newest first)
    const newProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // newest first
        });
    }, [products]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">New Arrivals</h1>
                <p className="text-gray-600">Check out our latest products just added to the store</p>
            </div>

            {newProducts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No products available yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {newProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
