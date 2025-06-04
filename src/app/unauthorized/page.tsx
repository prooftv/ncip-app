'use client'

import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is an error.
        </p>
        <Link 
          href="/dashboard" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
