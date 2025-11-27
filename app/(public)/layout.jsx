'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import GuestOrderLinker from "@/components/GuestOrderLinker";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";

import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";



function PublicLayoutAuthed({ children }) {
    const dispatch = useDispatch();
    // TODO: Integrate Firebase Auth for user and token if needed
    // const user = ...;
    // const getToken = async () => null;
    const { cartItems } = useSelector((state) => state.cart);

    useEffect(() => { dispatch(fetchProducts({})); }, []);
    // Add Firebase Auth logic here if needed

    return (
        <div className="flex flex-col min-h-screen">
            <GuestOrderLinker />
            {/* <Banner /> */}
            <Navbar />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <MobileBottomNav />
            <Footer />
        </div>
    );
}

function PublicLayoutGuest({ children }) {
    const dispatch = useDispatch();
    useEffect(() => { dispatch(fetchProducts({})); }, []);
    return (
        <div className="flex flex-col min-h-screen">
            {/* <Banner /> */}
            <Navbar />
         
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <MobileBottomNav />
            <Footer />
        </div>
    );
}

export default function PublicLayout(props) {
    return (
        <PublicLayoutAuthed {...props} />
    );
}
