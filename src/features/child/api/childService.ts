import { db } from '@lib/firebase/config';
import { Child } from '@models/Child';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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
  const snapshot = await getDocs(childrenRef);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Child))
    .filter(child => child.guardianId === guardianId);
};
