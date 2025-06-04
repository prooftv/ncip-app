import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@lib/firebase/config';

export const login = async (email: string, password: string) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);
    
    let message = 'Invalid email or password. Please try again.';
    if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address format.';
    } else if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many failed attempts. Please try again later.';
    } else if (error.code === 'auth/user-disabled') {
      message = 'This account has been disabled.';
    } else if (error.code === 'auth/network-request-failed') {
      message = 'Network error. Please check your connection.';
    }
    
    throw new Error(message);
  }
};

export const register = async (
  email: string, 
  password: string, 
  role: 'parent' | 'admin' | 'school',
  displayName?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role,
      displayName: displayName || '',
      createdAt: new Date(),
      active: true
    });
    
    return user;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    let message = 'Registration failed. Please try again.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email already in use. Please use a different email.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address format.';
    }
    
    throw new Error(message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    let message = 'Failed to send password reset email.';
    if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email address.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address format.';
    }
    
    throw new Error(message);
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};
