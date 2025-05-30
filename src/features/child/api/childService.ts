import { db } from '@lib/firebase/config';
import { Child } from '@models/Child';
import { 
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  getDocFromCache, getDocFromServer 
} from 'firebase/firestore';

const childrenRef = collection(db, 'children');

export const addChild = async (child: Omit<Child, 'id'>) => {
  return await addDoc(childrenRef, child);
};

export const updateChild = async (id: string, updates: Partial<Child>) => {
  await updateDoc(doc(childrenRef, id), updates);
};

export const deleteChild = async (id: string) => {
  await deleteDoc(doc(childrenRef, id));
};

export const getChildrenByGuardian = async (guardianId: string) => {
  try {
    const snapshot = await getDocs(childrenRef);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Child))
      .filter(child => child.guardianId === guardianId);
  } catch (error) {
    console.error('Failed to fetch children:', error);
    return [];
  }
};

// Add offline data fetching with cache fallback
export const getChildWithOfflineSupport = async (childId: string) => {
  const docRef = doc(childrenRef, childId);
  
  try {
    // First try to get from server
    return await getDocFromServer(docRef);
  } catch (serverError) {
    console.warn('Server fetch failed, trying cache:', serverError);
    try {
      // Fallback to cache if server fails
      return await getDocFromCache(docRef);
    } catch (cacheError) {
      console.error('Cache fetch failed:', cacheError);
      throw new Error('Unable to fetch child data');
    }
  }
};
