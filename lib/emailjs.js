// lib/emailjs.js
import emailjs from '@emailjs/nodejs';

const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const EMAILJS_TEMPLATE_AUTO_REPLY = process.env.EMAILJS_TEMPLATE_AUTO_REPLY;
const EMAILJS_TEMPLATE_WELCOME = process.env.EMAILJS_TEMPLATE_WELCOME;

export async function sendAutoReplyEmail({ to, name }) {
  return emailjs.send(
    EMAILJS_PUBLIC_KEY,
    EMAILJS_TEMPLATE_AUTO_REPLY,
    { to_email: to, to_name: name },
    EMAILJS_PRIVATE_KEY
  );
}

export async function sendWelcomeEmail({ to, name }) {
  return emailjs.send(
    EMAILJS_PUBLIC_KEY,
    EMAILJS_TEMPLATE_WELCOME,
    { to_email: to, to_name: name },
    EMAILJS_PRIVATE_KEY
  );
}
