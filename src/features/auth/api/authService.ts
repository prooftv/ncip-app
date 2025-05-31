import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { auth } from '@lib/firebase/config';

export const login = async (email: string, password: string) => {
  try {
    // Set session persistence
    await setPersistence(auth, browserSessionPersistence);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    
    // More specific error messages
    let message = 'Invalid email or password. Please try again.';
    if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address format.';
    } else if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Incorrect password. Please try again.';
    }
    
    throw new Error(message);
  }
};

export const register = async (email: string, password: string, role: 'parent' | 'admin' | 'school') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Registration error:', error);
    
    let message = 'Registration failed. Please try again.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email already in use. Please use a different email.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password should be at least 6 characters.';
    }
    
    throw new Error(message);
  }
};
