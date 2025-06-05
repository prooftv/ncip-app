'use client'
import { useState } from 'react';
import { addChild } from '@features/child/api/childService';
import { useAuth } from '@features/auth/AuthProvider';
import { validateChildData } from '@models/Child';

export default function AddChildForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    schoolId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user?.uid) {
      setError('You must be logged in');
      return;
    }

    try {
      setIsSubmitting(true);
      const childData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        guardianId: user.uid,
        schoolId: formData.schoolId.trim() || undefined
      };

      validateChildData(childData);
      await addChild(childData);
      
      setFormData({ name: '', age: '', schoolId: '' });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add child');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block font-medium">
          Child's Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          minLength={2}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="age" className="block font-medium">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min="1"
          max="18"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="schoolId" className="block font-medium">
          School ID (optional)
        </label>
        <input
          type="text"
          id="schoolId"
          name="schoolId"
          value={formData.schoolId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Adding Child...' : 'Add Child'}
      </button>
    </form>
  );
}