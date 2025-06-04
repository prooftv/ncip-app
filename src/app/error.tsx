'use client'

import { useEffect } from 'react';

type ErrorComponentProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorComponent({ error, reset }: ErrorComponentProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-700 mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
