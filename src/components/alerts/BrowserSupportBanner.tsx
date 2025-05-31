'use client'

import { isBrowserSupported, getUnsupportedMessage } from '@lib/browserSupport';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function BrowserSupportBanner() {
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isBrowserSupported());
  }, []);

  if (!visible || supported) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-gray-900 p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaExclamationTriangle className="text-xl" />
          <span>{getUnsupportedMessage()}</span>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="p-1 hover:bg-yellow-400 rounded-full"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}
