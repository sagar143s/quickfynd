import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

// Auth Admin 
export async function GET(request){
    try {
        // Firebase Auth: Extract token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await getAuth().verifyIdToken(idToken);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const userId = decodedToken.uid;
        const email = decodedToken.email;
        const isAdmin = await authAdmin(userId, email);

        if(!isAdmin){
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        return NextResponse.json({isAdmin});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}