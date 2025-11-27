import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/firebase-admin";

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    // Fetch users and pending invites for the store owned by userId
    // TODO: Replace with real DB logic
    return NextResponse.json({
      users: [
        { id: 1, email: "admin@example.com", role: "admin" },
        { id: 2, email: "user@example.com", role: "user" }
      ],
      pending: [
        { id: 101, email: "pending@example.com" }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
