'use client'

import { useAuth } from '@features/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { FaChild, FaBell, FaMapMarkerAlt, FaShieldAlt, FaPlus, FaUser, FaExclamationTriangle, FaSpinner, FaTimes, FaSignInAlt } from 'react-icons/fa';
import { getChildrenByGuardian, addChild, deleteChild } from '@features/child/api/childService';
import { Child } from '@models/Child';
import { triggerEmergency, testEmergencySystem } from '@features/emergency/api/emergencyService';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, role, loading, signIn } = useAuth();
  const router = useRouter();
  const [childId, setChildId] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [safeZones, setSafeZones] = useState<string[]>([]);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showSafeZonesModal, setShowSafeZonesModal] = useState(false);
  const [newSafeZone, setNewSafeZone] = useState('');
  const alertsSectionRef = useRef<HTMLDivElement>(null);

  const fetchChildren = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setIsFetching(true);
      setFetchError('');
      console.log('Fetching children for user:', user.uid);
      const childrenData = await getChildrenByGuardian(user.uid);
      
      // Map children to ensure they have required properties
      const mappedChildren = childrenData.map(child => ({
        id: child.id,
        name: child.name || 'Unnamed Child',
        age: child.age || 0,
        guardianId: child.guardianId || user.uid,
        schoolId: child.schoolId || 'default',
        lastSeen: child.lastSeen || { location: 'Unknown', timestamp: new Date() }
      }));
      
      setChildren(mappedChildren);
      localStorage.setItem('cachedChildren', JSON.stringify(mappedChildren));
      console.log('Children fetched successfully:', mappedChildren.length);
    } catch (error) {
      console.error('Failed to fetch children:', error);
      setFetchError('Failed to load child data. Working in offline mode.');
      const cachedChildren = localStorage.getItem('cachedChildren');
      if (cachedChildren) {
        console.log('Loading cached children data');
        setChildren(JSON.parse(cachedChildren));
      }
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  // Main auth state handler
  useEffect(() => {
    console.log('Dashboard auth state:', {
      user: user ? user.email : 'No user',
      role,
      loading
    });
    
    // Only fetch children if user is authenticated
    if (!loading && user) {
      console.log('User authenticated, fetching children');
      fetchChildren();
    }
  }, [user, loading, role, fetchChildren]);

  // Network status handler
  useEffect(() => {
    const checkNetworkStatus = () => {
      const online = navigator.onLine;
      console.log('Network status changed:', online ? 'Online' : 'Offline');
      setIsOnline(online);
    };

    console.log('Setting up network listeners');
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    
    // Set initial network status
    setIsOnline(navigator.onLine);
    
    return () => {
      console.log('Cleaning up network listeners');
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, []);

  const handleAddChild = async (name: string, age: number) => {
    if (!user?.uid) return;
    
    try {
      setIsFetching(true);
      const newChild = {
        name,
        age,
        guardianId: user.uid,
        createdAt: new Date(),
        schoolId: 'default', // You might want to make this configurable
        lastSeen: {
          location: 'Home',
          timestamp: new Date()
        }
      };
      
      console.log('Adding new child:', newChild);
      await addChild(newChild);
      setTestStatus('Child added successfully!');
      setAlerts([...alerts, `Added child: ${name} (Age: ${age})`]);
      fetchChildren();
      setShowAddChildModal(false);
    } catch (error) {
      console.error("Error adding child:", error);
      setTestStatus('Failed to add child');
      setAlerts([...alerts, `Failed to add child: ${name}`]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeleteChild = async (id: string) => {
    try {
      setIsFetching(true);
      console.log('Deleting child:', id);
      await deleteChild(id);
      setChildren(children.filter(child => child.id !== id));
      setAlerts([...alerts, `Deleted child successfully`]);
      if (childId === id) setChildId('');
    } catch (error) {
      console.error("Error deleting child:", error);
      setAlerts([...alerts, `Failed to delete child`]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleEmergencyTest = async () => {
    if (!childId) {
      setTestStatus('Please select a child first');
      setAlerts([...alerts, 'Emergency test failed: No child selected']);
      return;
    }
    
    try {
      setTestStatus('Triggering test emergency...');
      console.log('Testing emergency system for child:', childId);
      await testEmergencySystem(childId);
      setTestStatus('Test alert sent successfully!');
      setAlerts([...alerts, `Test emergency alert sent for ${children.find(c => c.id === childId)?.name}`]);
      setTimeout(() => setTestStatus(''), 3000);
    } catch (error: any) {
      setTestStatus(`Test failed: ${error.message}`);
      setAlerts([...alerts, `Emergency test failed: ${error.message}`]);
      console.error(error);
    }
  };

  const handleRealEmergency = async () => {
    if (!childId) {
      setTestStatus('Please select a child first');
      setAlerts([...alerts, 'Real emergency failed: No child selected']);
      return;
    }
    
    try {
      setTestStatus('Activating real emergency...');
      console.log('Activating real emergency for child:', childId);
      await triggerEmergency(childId);
      setTestStatus('Real emergency activated! Help is on the way!');
      setAlerts([...alerts, `REAL EMERGENCY ACTIVATED for ${children.find(c => c.id === childId)?.name}`]);
      setTimeout(() => setTestStatus(''), 5000);
    } catch (error: any) {
      setTestStatus(`Emergency failed: ${error.message}`);
      setAlerts([...alerts, `Emergency activation failed: ${error.message}`]);
      console.error(error);
    }
  };

  const handleAddSafeZone = () => {
    if (newSafeZone.trim()) {
      setSafeZones([...safeZones, newSafeZone]);
      setNewSafeZone('');
      setAlerts([...alerts, `Added safe zone: ${newSafeZone}`]);
      console.log('Added safe zone:', newSafeZone);
    }
  };

  const handleRemoveSafeZone = (index: number) => {
    const zone = safeZones[index];
    const newZones = safeZones.filter((_, i) => i !== index);
    setSafeZones(newZones);
    setAlerts([...alerts, `Removed safe zone: ${zone}`]);
    console.log('Removed safe zone:', zone);
  };

  const scrollToAlerts = () => {
    alertsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <FaExclamationTriangle className="text-4xl text-yellow-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600">
              You need to sign in to access the dashboard
            </p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={signIn}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <FaSignInAlt className="mr-2" />
              Sign In Anonymously
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Debugging header */}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Children</h2>
            <button 
              onClick={() => setShowAddChildModal(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Add Child
            </button>
          </div>
          
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
                  className={`p-4 border rounded-lg flex justify-between items-center ${
                    childId === child.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div 
                    className="flex items-center flex-grow cursor-pointer"
                    onClick={() => setChildId(child.id)}
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h3 className="font-bold">{child.name}</h3>
                      <p className="text-gray-600">Age: {child.age}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteChild(child.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No children added yet</p>
              <button 
                onClick={() => setShowAddChildModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Your First Child
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Emergency Actions</h2>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selected child:</h3>
            {childId ? (
              <div className="font-bold">
                {children.find(c => c.id === childId)?.name || 'Unknown child'}
              </div>
            ) : (
              <p className="text-red-500">No child selected</p>
            )}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleEmergencyTest}
              disabled={!childId}
              className={`w-full px-4 py-3 rounded-lg flex items-center justify-center ${
                childId 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaExclamationTriangle className="mr-2" />
              Test Emergency Alert
            </button>
            
            <button
              onClick={handleRealEmergency}
              disabled={!childId}
              className={`w-full px-4 py-3 rounded-lg flex items-center justify-center ${
                childId 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaExclamationTriangle className="mr-2 animate-pulse" />
              Activate Real Emergency Alert
            </button>
          </div>
          
          {testStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              testStatus.includes('success') || testStatus.includes('activated')
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {testStatus}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAddChildModal(true)}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <FaChild className="text-2xl text-blue-600 mb-2" />
            <span>Add Child</span>
          </button>
          
          <button
            onClick={() => setShowSafeZonesModal(true)}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <FaMapMarkerAlt className="text-2xl text-blue-600 mb-2" />
            <span>Safe Zones</span>
          </button>
          
          <button
            onClick={scrollToAlerts}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <FaBell className="text-2xl text-blue-600 mb-2" />
            <span>Alerts</span>
          </button>
          
          <button
            onClick={() => toast.success('Security settings coming soon!')}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <FaShieldAlt className="text-2xl text-blue-600 mb-2" />
            <span>Security</span>
          </button>
        </div>
      </div>

      {/* Safe Zones Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Safe Zones</h2>
          <button 
            onClick={() => setShowSafeZonesModal(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Manage Zones
          </button>
        </div>
        
        {safeZones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {safeZones.map((zone, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  <span>{zone}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No safe zones defined</p>
            <button 
              onClick={() => setShowSafeZonesModal(true)}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Add your first safe zone
            </button>
          </div>
        )}
      </div>

      {/* Alerts Section */}
      <div ref={alertsSectionRef} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Alerts</h2>
        
        {alerts.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  alert.includes('REAL EMERGENCY') 
                    ? 'bg-red-100 border-l-4 border-red-500' 
                    : alert.includes('Failed') || alert.includes('failed')
                      ? 'bg-yellow-100 border-l-4 border-yellow-500'
                      : 'bg-green-100 border-l-4 border-green-500'
                }`}
              >
                <div className="flex items-start">
                  <FaBell className="mt-1 mr-2 flex-shrink-0" />
                  <span>{alert}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No alerts</p>
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Child</h2>
                <button 
                  onClick={() => setShowAddChildModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const age = parseInt((form.elements.namedItem('age') as HTMLInputElement).value);
                if (name && age) handleAddChild(name, age);
              }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Child's Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="18"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isFetching}
                    className={`px-4 py-2 rounded text-white ${
                      isFetching ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isFetching ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Adding...
                      </span>
                    ) : 'Add Child'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddChildModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Safe Zones Modal */}
      {showSafeZonesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Safe Zones</h2>
                <button 
                  onClick={() => setShowSafeZonesModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="safeZone">
                  Add New Safe Zone
                </label>
                <div className="flex">
                  <input
                    id="safeZone"
                    type="text"
                    value={newSafeZone}
                    onChange={(e) => setNewSafeZone(e.target.value)}
                    placeholder="Home, School, Park..."
                    className="flex-1 shadow appearance-none border rounded-l py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button
                    type="button"
                    onClick={handleAddSafeZone}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Your Safe Zones</h3>
                {safeZones.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {safeZones.map((zone, index) => (
                      <li key={index} className="py-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-blue-500 mr-2" />
                          <span>{zone}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSafeZone(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 py-2">No safe zones added yet</p>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowSafeZonesModal(false)}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}