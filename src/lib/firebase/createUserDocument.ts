// src/lib/firebase/createUserDocument.ts
import { auth, db } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const createUserDocument = async (user: any) => {
  if (!user?.email) return;
  
  // Add all admin emails here (case insensitive)
  const adminEmails = [
    'admin@unamifoundation.org',
    'info@unamifoundation.org'
  ].map(email => email.toLowerCase());

  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const isAdmin = adminEmails.includes(user.email.toLowerCase());
    
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      role: isAdmin ? 'admin' : 'parent',
      createdAt: new Date(),
      lastLogin: new Date(),
    }, { merge: true });
    
    console.log(`User document created for ${user.email} as ${isAdmin ? 'admin' : 'parent'}`);
  } else {
    console.log(`User ${user.email} already exists with role: ${userDoc.data().role}`);
  }
};