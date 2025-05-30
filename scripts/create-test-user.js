const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = 'test@example.com';
const password = 'TestPassword123';

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log('Test user created successfully:');
    console.log('Email:', userCredential.user.email);
    console.log('UID:', userCredential.user.uid);
  })
  .catch((error) => {
    console.error('Error creating test user:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
  });
