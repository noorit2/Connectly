import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import multer from "multer";
// Load the service account key JSON file
const serviceAccount = JSON.parse(
  await readFile(new URL('../config/serviceAccountKey.json', import.meta.url))
);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://chat-13615.appspot.com'
});

export const bucket = admin.storage().bucket();
export const upload = multer({ storage: multer.memoryStorage() });

