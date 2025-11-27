import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { NextResponse } from "next/server";

// Next.js API route handler for GET
export async function GET(request) {
   try {
      // Firebase Auth: Extract token from Authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const idToken = authHeader.split('Bearer ')[1];
      const { getAuth } = await import('firebase-admin/auth');
      const { initializeApp, applicationDefault, getApps } = await import('firebase-admin/app');
      if (getApps().length === 0) {
         initializeApp({ credential: applicationDefault() });
      }
      let decodedToken;
      try {
         decodedToken = await getAuth().verifyIdToken(idToken);
      } catch (e) {
         return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      const userId = decodedToken.uid;
      const storeId = await authSeller(userId);
      if (!storeId) {
         return NextResponse.json({ error: 'Forbidden: Seller not approved or no store found.' }, { status: 403 });
      }

      // Get all orders for seller
      const orders = await prisma.order.findMany({ where: { storeId } });

      // Get all products with ratings for seller
      const products = await prisma.product.findMany({ where: { storeId } });

      const ratings = await prisma.rating.findMany({
         where: { productId: { in: products.map(product => product.id) } },
         include: { user: true, product: true }
      });

      // Get unique customers who have ordered from this store
      const uniqueCustomerIds = [...new Set(orders.map(order => order.userId))];
      const totalCustomers = uniqueCustomerIds.length;

      // Get abandoned carts for this store
      const abandonedCarts = await prisma.abandonedCart.count({
         where: { storeId }
      });

      const dashboardData = {
         ratings,
         totalOrders: orders.length,
         totalEarnings: Math.round(orders.reduce((acc, order) => acc + order.total, 0)),
         totalProducts: products.length,
         totalCustomers,
         abandonedCarts
      };

      return NextResponse.json({ dashboardData });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ error: error.code || error.message }, { status: 400 });
   }
}