'use client'

import { useAuth } from '@features/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaChild, FaBell, FaMapMarkerAlt, FaShieldAlt, FaPlus } from 'react-icons/fa'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3">
              <FaChild className="text-primary text-2xl" />
            </div>
            <h1 className="text-xl font-bold">NCIP Dashboard</h1>
          </div>
          <button className="bg-white bg-opacity-20 p-2 rounded-full">
            <FaBell className="text-xl" />
          </button>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-white py-6 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.email?.split('@')[0]}</h2>
          <p className="text-gray-600 mt-1">Protecting children, empowering communities</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="section-title">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="quick-action">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <FaChild className="text-blue-600 text-2xl" />
              </div>
              <h4 className="font-medium text-gray-800">Add Child</h4>
              <p className="text-sm text-gray-600 mt-1">Register a new child profile</p>
            </div>
            <div className="quick-action">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <FaMapMarkerAlt className="text-green-600 text-2xl" />
              </div>
              <h4 className="font-medium text-gray-800">Safe Zones</h4>
              <p className="text-sm text-gray-600 mt-1">Set up geofenced areas</p>
            </div>
            <div className="quick-action">
              <div className="bg-yellow-100 p-3 rounded-full mb-3">
                <FaBell className="text-yellow-600 text-2xl" />
              </div>
              <h4 className="font-medium text-gray-800">Alerts</h4>
              <p className="text-sm text-gray-600 mt-1">View recent notifications</p>
            </div>
            <div className="quick-action">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <FaShieldAlt className="text-purple-600 text-2xl" />
              </div>
              <h4 className="font-medium text-gray-800">Security</h4>
              <p className="text-sm text-gray-600 mt-1">Manage account settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Children Section */}
      <div className="py-6 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="section-title">Your Children</h3>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 flex items-center border-b border-gray-100">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-4">
                <h4 className="font-medium text-gray-800">Sarah Johnson</h4>
                <p className="text-sm text-gray-600">Age 8 • Last seen: School</p>
              </div>
            </div>
            <div className="p-5 flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-4">
                <h4 className="font-medium text-gray-800">Michael Johnson</h4>
                <p className="text-sm text-gray-600">Age 5 • Last seen: Home</p>
              </div>
            </div>
            <div className="p-5 bg-gray-50 text-center">
              <button className="text-accent font-medium flex items-center justify-center">
                <FaPlus className="mr-1" /> Add another child
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="section-title">Emergency Actions</h3>
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-5 text-white">
            <h4 className="font-bold text-lg mb-2">Report Missing Child</h4>
            <p className="mb-4">Immediately alert authorities and community members</p>
            <button className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg">
              Activate Emergency Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
