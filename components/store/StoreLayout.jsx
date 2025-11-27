'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"


import axios from "axios"
import { useAuth } from "@/lib/useAuth";

const StoreLayout = ({ children }) => {

    const { user, loading, getToken } = useAuth();

    const [isSeller, setIsSeller] = useState(false);
    const [sellerLoading, setSellerLoading] = useState(true);
    const [storeInfo, setStoreInfo] = useState(null);

    const fetchIsSeller = async () => {
        if (!user) return;
        const token = await getToken();
        if (!token) return;
        try {
            console.log('[StoreLayout] token:', token);
            const { data } = await axios.get('/api/store/is-seller', { headers: { Authorization: `Bearer ${token}` }});
            console.log('[StoreLayout] /api/store/is-seller response:', data);
            setIsSeller(data.isSeller);
            setStoreInfo(data.storeInfo);
        } catch (error) {
            console.log('[StoreLayout] is-seller error:', error?.response?.data || error.message);
        } finally {
            setSellerLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && user) {
            fetchIsSeller();
        }
    }, [loading, user]);

    return sellerLoading ? (
        <Loading />
    ) : isSeller ? (
        <div className="flex flex-col h-screen">
            <SellerNavbar storeInfo={storeInfo} />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <SellerSidebar storeInfo={storeInfo} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/create-store" className="bg-blue-600 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full hover:bg-blue-700 transition">
                Request Store
            </Link>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-4 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default StoreLayout