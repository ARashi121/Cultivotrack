import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "cultivotrack",
  "appId": "1:599825458097:web:98c98c93180d14abe19390",
  "storageBucket": "cultivotrack.firebasestorage.app",
  "apiKey": "AIzaSyDzZOMc0EcF9z9dSXF9m2ccLZ2k1lKik8U",
  "authDomain": "cultivotrack.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "599825458097"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
