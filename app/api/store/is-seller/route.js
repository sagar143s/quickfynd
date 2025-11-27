import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebase-admin";

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('[is-seller API] Missing or invalid authorization header:', authHeader);
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }
        const idToken = authHeader.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = await getAuth().verifyIdToken(idToken);
        } catch (err) {
            console.log('[is-seller API] Invalid or expired token:', err);
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }
        const userId = decodedToken.uid;
        console.log('[is-seller API] userId:', userId);
        const isSeller = await authSeller(userId);
        console.log('[is-seller API] isSeller:', isSeller);
        if(!isSeller){
            return NextResponse.json({ error: 'not authorized', userId }, { status: 401 });
        }
        const storeInfo = await prisma.store.findUnique({where: {userId}});
        return NextResponse.json({isSeller, storeInfo, userId});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}