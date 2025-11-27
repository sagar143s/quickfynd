import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/configs/imageKit";

// Ensure Node.js runtime so Buffer and ImageKit work (avoids Edge runtime errors)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


const json = (body, status = 200) => NextResponse.json(body, { status });


export async function POST(request) {
  try {
    // Firebase Auth: Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }
    const idToken = authHeader.split('Bearer ')[1];
    console.log('[DEBUG] Received Firebase ID token:', idToken);
    const { getAuth } = await import('@/lib/firebase-admin');
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
      console.log('[DEBUG] Decoded Firebase token:', decodedToken);
      // Print service account project_id for comparison
      const serviceAccountProjectId = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY).project_id : null;
      console.log('[DEBUG] Service account project_id:', serviceAccountProjectId);
      if (decodedToken.aud) {
        console.log('[DEBUG] Token audience (aud):', decodedToken.aud);
      }
      if (decodedToken.iss) {
        console.log('[DEBUG] Token issuer (iss):', decodedToken.iss);
      }
    } catch (e) {
      console.error('[DEBUG] Token verification error:', e);
      return json({ error: 'Invalid token' }, 401);
    }
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email || '';
    const userName = decodedToken.name || 'Unknown';
    const userImage = decodedToken.picture || '';

    // Ensure user exists in database
    const upsertData = {
      id: userId,
      name: userName,
      email: userEmail,
      image: userImage,
    };
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: upsertData,
    });

    const formData = await request.formData();

    const getField = (key) => {
      const value = formData.get(key);
      return value ? String(value).trim() : "";
    };

    const name = getField("name");
    const username = getField("username").toLowerCase();
    const description = getField("description");
    const email = getField("email");
    const contact = getField("contact");
    const address = getField("address");
    const image = formData.get("image");

    // Check for missing fields
    const missing = [];
    if (!name) missing.push("name");
    if (!username) missing.push("username");
    if (!description) missing.push("description");
    if (!email) missing.push("email");
    if (!contact) missing.push("contact");
    if (!address) missing.push("address");
    if (!image) missing.push("image");

    if (missing.length) return json({ error: "Missing fields", missing }, 400);

    // Check if user already has a store
    const existingStore = await prisma.store.findFirst({ where: { userId } });
    if (existingStore) return json({ status: existingStore.status }, 200);

    // Check if username is already taken
    const usernameTaken = await prisma.store.findFirst({ where: { username } });
    if (usernameTaken) return json({ error: "Username already taken" }, 400);

    // Upload image to ImageKit
    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name || `${username}-logo`,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    // Create the store
    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        username,
        description,
        email,
        contact,
        address,
        logo: optimizedImage,
        // Explicitly set status and isActive for debug
        status: 'pending',
        isActive: false,
      },
    });
    console.log('Store created:', {
      id: newStore.id,
      status: newStore.status,
      isActive: newStore.isActive,
      createdAt: newStore.createdAt,
    });

    // Send emails (auto-reply and welcome)
    try {
      const { sendAutoReplyEmail, sendWelcomeEmail } = await import('@/lib/emailjs');
      await sendAutoReplyEmail({ to: email, name });
      await sendWelcomeEmail({ to: email, name });
      console.log('Auto-reply and welcome emails sent to', email);
    } catch (err) {
      console.error('Failed to send emails:', err.message);
    }

    // Link store to user (handle missing user gracefully)
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { store: { connect: { id: newStore.id } } },
      });
    } catch (err) {
      console.warn("User link failed:", err.message);
    }

    return json({ message: "Store created, waiting for approval", storeId: newStore.id }, 201);
  } catch (error) {
    console.error(error);
    return json({ error: error?.code || error?.message || "Unknown error" }, 500);
  }
}


// GET: Check if the user has already registered a store
export async function GET(request) {
  try {
    // Firebase Auth: Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }
    const idToken = authHeader.split('Bearer ')[1];
    const { getAuth } = await import('@/lib/firebase-admin');
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch (e) {
      return json({ error: 'Invalid token' }, 401);
    }
    const userId = decodedToken.uid;
    if (!userId) return json({ error: "Unauthorized" }, 401);

    const store = await prisma.store.findFirst({ where: { userId } });
    if (store) return json({ status: store.status }, 200);

    return json({ status: "not registered" }, 200);
  } catch (error) {
    console.error(error);
    return json({ error: error?.code || error?.message || "Unknown error" }, 500);
  }
}
