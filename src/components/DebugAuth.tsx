'use client'
import { useAuth } from '@features/auth/AuthProvider';
import { auth } from '@lib/firebase/config';
import { signInAnonymously, signOut } from 'firebase/auth';

export default function DebugAuth() {
  const { user, role, loading, messagingSupported } = useAuth();

  const handleSignInAnonymously = async () => {
    try {
      console.log('Signing in anonymously...');
      await signInAnonymously(auth);
      console.log('Anonymous sign in successful');
    } catch (error) {
      console.error('Anonymous sign in failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut(auth);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="text-sm space-y-1">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.email || 'Anonymous' : 'None'}</p>
        <p><strong>Role:</strong> {role || 'None'}</p>
        <p><strong>Messaging:</strong> {messagingSupported ? 'Yes' : 'No'}</p>
        <p><strong>Auth Instance:</strong> {auth ? 'Initialized' : 'Not initialized'}</p>
      </div>
      <div className="mt-4 space-y-2">
        <button 
          onClick={handleSignInAnonymously}
          className="w-full px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Sign In Anonymously
        </button>
        <button 
          onClick={handleSignOut}
          className="w-full px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}