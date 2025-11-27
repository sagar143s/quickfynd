// lib/firebase-admin.js
import { initializeApp, applicationDefault, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Use service account if available, else fallback to applicationDefault
const keyEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!keyEnv) {
  console.warn('FIREBASE_SERVICE_ACCOUNT_KEY env variable is missing!');
} else {
  try {
    JSON.parse(keyEnv);
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON:', e);
  }
}
const firebaseConfig = keyEnv
  ? { credential: cert(JSON.parse(keyEnv)) }
  : { credential: applicationDefault() };

if (!getApps().length) {
  console.log('Initializing Firebase Admin SDK with config:', !!keyEnv ? 'service account' : 'applicationDefault');
  initializeApp(firebaseConfig);
}

export { getAuth };