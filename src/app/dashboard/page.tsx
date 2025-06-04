'use client'

import { useAuth } from '@features/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { FaChild, FaBell, FaMapMarkerAlt, FaShieldAlt, FaPlus, FaUser, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

export default function DashboardPage() {
  const { user, role, loading } = useAuth(); // Removed roleLoading
  const router = useRouter();
  const [childId, setChildId] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [children, setChildren] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  
  // Debugging: Log auth state
  useEffect(() => {
    console.log('Dashboard auth state:', {
      user: user ? user.email : 'No user',
      role,
      loading
    });
  }, [user, role, loading]);

  useEffect(() => {
    const checkNetworkStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, []);

  const fetchChildren = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsFetching(true);
      setFetchError('');
      // Simulated fetch - replace with your actual fetch function
      console.log('Fetching children for user:', user.uid);
      
      // Mock data for debugging
      const mockChildren = [
        { id: 'child1', name: 'Child One', age: 8 },
        { id: 'child2', name: 'Child Two', age: 10 }
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChildren(mockChildren);
      localStorage.setItem('cachedChildren', JSON.stringify(mockChildren));
    } catch (error) {
      console.error('Failed to fetch children:', error);
      setFetchError('Failed to load child data. Working in offline mode.');
      const cachedChildren = localStorage.getItem('cachedChildren');
      if (cachedChildren) {
        setChildren(JSON.parse(cachedChildren));
      }
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    if (user) {
      fetchChildren();
    }
  }, [user, loading, router, fetchChildren]);

  const handleAddChild = async () => {
    if (!childId.trim()) {
      setTestStatus('Please enter a valid Child ID');
      return;
    }
    
    try {
      setTestStatus(`Adding child ${childId}...`);
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add mock child
      const newChild = {
        id: childId,
        name: `Child ${childId}`,
        age: Math.floor(Math.random() * 10) + 3
      };
      
      setChildren(prev => [...prev, newChild]);
      setTestStatus('Child added successfully!');
      setChildId('');
    } catch (error) {
      console.error("Error adding child:", error);
      setTestStatus('Failed to add child');
    }
  };

  const handleEmergencyTest = async () => {
    if (!childId) {
      setTestStatus('Please select a child first');
      return;
    }
    
    try {
      setTestStatus('Triggering test emergency...');
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestStatus('Test alert sent successfully!');
      setTimeout(() => setTestStatus(''), 3000);
    } catch (error: any) {
      setTestStatus(`Test failed: ${error.message}`);
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-3xl text-blue-500 mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaExclamationTriangle className="text-3xl text-yellow-500 mb-4" />
        <p className="text-gray-600">No user information available</p>
        <button 
          onClick={() => router.push('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Debugging header - fixed role reference */}
      <div className="bg-blue-100 p-3 rounded-lg mb-4">
        <div className="flex items-center">
          <FaUser className="text-blue-600 mr-2" />
          <div>
            <h2 className="font-bold">Debug Info</h2>
            <p>User: {user?.email || 'No email'}</p>
            <p>Role: {role || 'No role assigned'}</p>
            <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </div>
      
      {!isOnline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            <span>You are offline. Some features may be limited.</span>
          </div>
        </div>
      )}
      
      {fetchError && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <span>{fetchError}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <FaUser className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.email?.split('@')[0]}</h1>
            <p className="text-gray-600">Protecting children, empowering communities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Children</h2>
          
          {isFetching ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-blue-500 mr-2" />
              <span>Loading children...</span>
            </div>
          ) : children.length > 0 ? (
            <div className="space-y-3">
              {children.map(child => (
                <div 
                  key={child.id} 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    childId === child.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setChildId(child.id)}
                >
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h3 className="font-bold">{child.name}</h3>
                      <p className="text-gray-600">Age: {child.age}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No children added yet</p>
            </div>
          )}
          
          <div className="mt-6">
            <div className="flex">
              <input
                type="text"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                placeholder="Enter Child ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddChild}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
              >
                <FaPlus />
              </button>
            </div>
            <button
              onClick={() => {
                const newId = `child${children.length + 1}`;
                setChildId(newId);
                handleAddChild();
              }}
              className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Add Demo Child
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Emergency Actions</h2>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selected child:</h3>
            {childId ? (
              <div className="font-bold">
                {children.find(c => c.id === childId)?.name || childId}
              </div>
            ) : (
              <p className="text-red-500">No child selected</p>
            )}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleEmergencyTest}
              disabled={!childId}
              className={`w-full px-4 py-3 rounded-lg ${
                childId 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Test Emergency Alert
            </button>
            
            <button
              onClick={handleEmergencyTest}
              disabled={!childId}
              className={`w-full px-4 py-3 rounded-lg ${
                childId 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Activate Real Emergency Alert
            </button>
          </div>
          
          {testStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              testStatus.includes('success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {testStatus}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FaChild, label: 'Add Child' },
            { icon: FaMapMarkerAlt, label: 'Safe Zones' },
            { icon: FaBell, label: 'Alerts' },
            { icon: FaShieldAlt, label: 'Security' }
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <action.icon className="text-2xl text-blue-600 mb-2" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}