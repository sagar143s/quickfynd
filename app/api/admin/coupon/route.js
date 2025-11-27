import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";

import { NextResponse } from "next/server";


// Add new coupon
export async function POST(request){
    try {
        // TODO: Use Firebase Auth for authentication and admin check
        // Example: const userId = ...;
        // const isAdmin = await authAdmin(userId)
        // if (!isAdmin) {
        //     return NextResponse.json({ error: "not authorized" }, { status: 401 })
        // }

        const { coupon } = await request.json()
        coupon.code = coupon.code.toUpperCase()

        await prisma.coupon.create({data: coupon}).then(async (coupon) => {
            // Run Inngest Sheduler Function to delete coupon on expire
            await inngest.send({
                name: "app/coupon.expired",
                data: {
                    code: coupon.code,
                    expires_at: coupon.expiresAt,
                }
            })
        })

        return NextResponse.json({message: "Coupon added successfully"})

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Delete coupon  /api/coupon?id=couponId
export async function DELETE(request){
    try {
        // TODO: Replace with your Firebase Auth server-side authentication logic
        // Example: const userId = await getFirebaseUserId(request);
        // Example: const isAdmin = await authAdmin(userId);
        // if (!isAdmin) {
        //     return NextResponse.json({ error: "not authorized" }, { status: 401 })
        // }

        const { searchParams } = request.nextUrl;
        const code = searchParams.get('code')

        await prisma.coupon.delete({where: { code }})
        return NextResponse.json({ message: 'Coupon deleted successfully' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Get all coupons
export async function GET(request){
    try {
        // TODO: Replace with your Firebase Auth server-side authentication logic
        // Example: const userId = await getFirebaseUserId(request);
        // Example: const isAdmin = await authAdmin(userId);
        // if (!isAdmin) {
        //     return NextResponse.json({ error: "not authorized" }, { status: 401 })
        // }
        const coupons = await prisma.coupon.findMany({})
        return NextResponse.json({ coupons })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}