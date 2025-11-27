
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/firebase-admin";
import { randomBytes } from "crypto";
import { Resend } from 'resend';

// Use Resend for transactional email
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    // Find the store owned/admin by this user
    const store = await prisma.store.findFirst({ where: { userId } });
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    // Check if already invited or member
    const existing = await prisma.storeUser.findFirst({ where: { storeId: store.id, email } });
    if (existing && ["invited", "pending", "approved"].includes(existing.status)) {
      return NextResponse.json({ error: 'User already invited or member' }, { status: 400 });
    }

    // Generate invite token
    const inviteToken = randomBytes(32).toString('hex');
    const inviteExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    // Create invite in DB
    await prisma.storeUser.create({
      data: {
        storeId: store.id,
        email,
        role: 'member',
        status: 'invited',
        invitedById: userId,
        inviteToken,
        inviteExpiry,
      },
    });


    // Custom email subject and body
    const inviteUrl = `${APP_URL}/store/invite/accept?token=${inviteToken}`;
    const emailSubject = `🚀 You're invited to join ${store.name} on Quickfynd!`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #ff6600;">Quickfynd Store Invitation</h2>
        <p>Hello,</p>
        <p><b>${store.name}</b> has invited you to join their store team on <a href="https://quickfynd.com" style="color: #ff6600;">Quickfynd</a>.</p>
        <p style="margin: 24px 0;">
          <a href="${inviteUrl}" style="background: #ff6600; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Accept Invitation</a>
        </p>
        <p>This link will expire in <b>7 days</b>. If you did not expect this invitation, you can ignore this email.</p>
        <hr style="margin: 32px 0;" />
        <p style="font-size: 13px; color: #888;">Sent by Quickfynd Store Platform</p>
      </div>
    `;

    console.log('[INVITE] Sending invite email via Resend SDK:', {
      from: EMAIL_FROM,
      to: email,
      subject: emailSubject,
      inviteUrl,
      RESEND_API_KEY_PRESENT: !!RESEND_API_KEY
    });

    const resend = new Resend(RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: emailSubject,
      html: emailBody,
    });
    if (error) {
      console.error('[RESEND ERROR]', error);
      return NextResponse.json({ error: 'Failed to send invite email', details: error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invitation sent successfully', debug: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
