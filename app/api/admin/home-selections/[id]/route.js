import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebase-admin";
import authAdmin from "@/middlewares/authAdmin";

export async function GET(_req, { params }) {
  // Firebase Auth: get Bearer token from header
  const authHeader = _req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const idToken = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = await getAuth().verifyIdToken(idToken);
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = decodedToken.uid;
  const email = decodedToken.email;
  const isAdmin = await authAdmin(userId, email);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const selection = await prisma.homeSelection.findUnique({ where: { id: params.id } });
  if (!selection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ selection });
}

export async function PUT(req, { params }) {
  // Firebase Auth: get Bearer token from header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const idToken = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = await getAuth().verifyIdToken(idToken);
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = decodedToken.uid;
  const email = decodedToken.email;
  const isAdmin = await authAdmin(userId, email);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const updated = await prisma.homeSelection.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ selection: updated });
  } catch (error) {
    console.error("Update selection error", error);
    return NextResponse.json({ error: "Failed to update selection" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  // Firebase Auth: get Bearer token from header
  const authHeader = _req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const idToken = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = await getAuth().verifyIdToken(idToken);
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = decodedToken.uid;
  const email = decodedToken.email;
  const isAdmin = await authAdmin(userId, email);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.homeSelection.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete selection error", error);
    return NextResponse.json({ error: "Failed to delete selection" }, { status: 500 });
  }
}
