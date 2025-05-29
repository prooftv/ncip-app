'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-primary to-secondary">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg"
          >
            Try again
          </button>
          <Link
            href="/"
            className="py-3 px-6 bg-gray-100 text-gray-800 font-medium rounded-lg"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  )
}
