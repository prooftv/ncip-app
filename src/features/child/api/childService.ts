import { db } from '@lib/firebase/config';
import { Child } from '@models/Child';
import { 
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc
} from 'firebase/firestore';

const childrenRef = collection(db, 'children');

export const addChild = async (child: Omit<Child, 'id'>) => {
  return await addDoc(childrenRef, child);
};

export const deleteChild = async (id: string) => {
  await deleteDoc(doc(childrenRef, id));
};

export const getChildrenByGuardian = async (guardianId: string) => {
  try {
    const snapshot = await getDocs(childrenRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Child',
        age: data.age || 0,
        guardianId: data.guardianId || guardianId,
        schoolId: data.schoolId || 'default',
        lastSeen: data.lastSeen || { location: 'Unknown', timestamp: new Date() },
        ...data
      } as Child;
    }).filter(child => child.guardianId === guardianId);
  } catch (error) {
    console.error('Failed to fetch children:', error);
    return [];
  }
};