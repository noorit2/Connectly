import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import path from 'path';
import multer from 'multer';

// Define the type for service account key JSON
interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Load the service account key JSON file
const loadServiceAccount = async (): Promise<ServiceAccount> => {
  const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
  const serviceAccountData = await readFile(serviceAccountPath, 'utf-8');
  return JSON.parse(serviceAccountData) as ServiceAccount;
};

// Initialize the Firebase Admin SDK
const initializeFirebase = async (): Promise<void> => {
  const serviceAccount = await loadServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.STORAGE_BUCKET || ''
  });
};

// Ensure Firebase is initialized
let firebaseInitialized = false;

export const initFirebase = async (): Promise<void> => {
  if (!firebaseInitialized) {
    await initializeFirebase();
    firebaseInitialized = true;
  }
};

// Multer setup
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// Export bucket and upload handler
export const getBucket = async () => {
  await initFirebase();
  return admin.storage().bucket();
};

export { upload };
