import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Customer order placement (guest or logged-in)
export async function POST(request) {
  try {
    const data = await request.json();
    // Required fields for India
    const { name, email, phone, address, state, pincode, cartItems, userId } = data;
    if (!name || !phone || !address || !state || !pincode || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optionally associate with user if logged in
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user ? user.id : null,
        name,
        email,
        phone,
        address,
        state,
        pincode,
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }))
        },
        status: "pending",
      },
      include: { orderItems: true }
    });

    return NextResponse.json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.code || error.message }, { status: 400 });
  }
}
