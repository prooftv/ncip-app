import { auth, db } from '@lib/firebase/config';
import { 
  collection, query, where, getDocs, 
  addDoc, doc, deleteDoc, getDoc, updateDoc 
} from 'firebase/firestore';
import { Child, validateChildData } from '@models/Child';

export async function getChildrenByGuardian(guardianId: string): Promise<Child[]> {
  if (!guardianId) throw new Error('Guardian ID is required');

  try {
    const q = query(collection(db, 'children'), where('guardianId', '==', guardianId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      age: doc.data().age,
      guardianId: doc.data().guardianId,
      schoolId: doc.data().schoolId,
      lastSeen: doc.data().lastSeen,
      photoURL: doc.data().photoURL,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching children:', error);
    throw new Error(`Failed to fetch children: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function addChild(childData: Omit<Child, 'id'>): Promise<Child> {
  validateChildData(childData);

  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }

  if (childData.guardianId !== auth.currentUser.uid) {
    throw new Error('You can only add children to your own account');
  }

  try {
    const docRef = await addDoc(collection(db, 'children'), {
      ...childData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newDoc = await getDoc(docRef);
    if (!newDoc.exists()) throw new Error('Document not created');

    return {
      id: docRef.id,
      ...childData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error adding child:', error);
    throw new Error(`Failed to add child: ${error instanceof Error ? error.message : 'Check your permissions'}`);
  }
}

export async function updateChild(childId: string, updates: Partial<Child>): Promise<void> {
  if (!childId) throw new Error('Child ID is required');
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const childRef = doc(db, 'children', childId);
    await updateDoc(childRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating child:', error);
    throw new Error(`Failed to update child: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteChild(childId: string): Promise<void> {
  if (!childId) throw new Error('Child ID is required');
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    await deleteDoc(doc(db, 'children', childId));
  } catch (error) {
    console.error('Error deleting child:', error);
    throw new Error(`Failed to delete child: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const childService = {
  getChildrenByGuardian,
  addChild,
  updateChild,
  deleteChild
};