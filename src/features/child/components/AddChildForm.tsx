'use client'
import { useState } from 'react';
import { addChild } from '@features/child/api/childService';
import { useAuth } from '@features/auth/context';

export default function AddChildForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    school: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    await addChild({
      name: formData.name,
      age: parseInt(formData.age),
      guardianId: user.uid,
      schoolId: formData.school,
      lastSeen: {
        location: 'Home',
        timestamp: new Date(),
      }
    });
    // Refresh child list
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
