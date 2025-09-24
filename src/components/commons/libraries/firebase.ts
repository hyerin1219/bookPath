// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(firebaseApp);

// Firebase 인증 인스턴스 가져오기
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider };
