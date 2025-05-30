import { db } from '@lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export const processPendingEmergencies = async () => {
  if (typeof window === 'undefined') return;
  
  const pending = JSON.parse(localStorage.getItem('pendingEmergencies') || '[]');
  if (pending.length === 0) return;

  console.log('Processing', pending.length, 'pending emergencies');
  
  const successes = [];
  const failures = [];
  
  for (const emergency of pending) {
    try {
      await addDoc(collection(db, 'emergencies'), {
        ...emergency,
        isPending: false,
        retriedAt: new Date()
      });
      successes.push(emergency.childId);
    } catch (error) {
      console.error('Failed to retry emergency:', error);
      failures.push(emergency);
    }
  }
  
  // Update localStorage with only the failed ones
  localStorage.setItem('pendingEmergencies', JSON.stringify(failures));
  
  return {
    successCount: successes.length,
    failureCount: failures.length
  };
};

// Process on app load
if (typeof window !== 'undefined' && navigator.onLine) {
  setTimeout(() => {
    processPendingEmergencies().then(result => {
      if (result && result.successCount > 0) {
        console.log(`Successfully synced ${result.successCount} emergencies`);
      }
    });
  }, 3000);
}
