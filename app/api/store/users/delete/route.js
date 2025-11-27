import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Implement DB logic to delete a user from the store
  return NextResponse.json({ message: 'User deleted (demo only)' });
}
