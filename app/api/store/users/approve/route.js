import { NextResponse } from "next/server";

export async function POST(request) {
  // TODO: Implement DB logic to approve a pending invite
  return NextResponse.json({ message: 'User approved (demo only)' });
}
