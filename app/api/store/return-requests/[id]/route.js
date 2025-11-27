import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

// Update return/replacement request status
export async function PUT(request, { params }) {
    try {

        if (!userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        const { id } = params;
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        // Verify user owns the store for this request
        const returnRequest = await prisma.returnRequest.findUnique({
            where: { id },
            include: {
                store: true
            }
        });

        if (!returnRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (returnRequest.store.userId !== userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        // Update request status
        const updatedRequest = await prisma.returnRequest.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ 
            message: "Request status updated successfully",
            request: updatedRequest 
        });
    } catch (error) {
        console.error('Error updating return request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
