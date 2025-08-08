'use client'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaReJqQVbx3ycUx17CjFhCOqMttWQ4EKk",
  authDomain: "dozoom.firebaseapp.com",
  projectId: "dozoom",
  storageBucket: "dozoom.firebasestorage.app",
  messagingSenderId: "704557519507",
  appId: "1:704557519507:web:e07e13a0770b9c20e6b366",
  measurementId: "G-HQHD5HT3L5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics and get a reference to the service
const analytics = getAnalytics(app);

// Export app and analytics if needed elsewhere, though analytics is often used directly
export { app, analytics };
