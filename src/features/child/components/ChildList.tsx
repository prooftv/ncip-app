'use client'
import { useEffect, useState, useCallback } from 'react';
import { getChildrenByGuardian } from '@features/child/api/childService';
import { useAuth } from '@features/auth/AuthProvider';
import { Child } from '@models/Child';

export default function ChildList() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);

  const loadChildren = useCallback(async () => {
    if (!user?.uid) return;
    const data = await getChildrenByGuardian(user.uid);
    setChildren(data);
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      loadChildren();
    }
  }, [user?.uid, loadChildren]);

  return (
    <div>
      {children.map(child => (
        <div key={child.id}>
          <h3>{child.name}</h3>
          <p>Age: {child.age}</p>
          {/* Edit/Delete buttons */}
        </div>
      ))}
    </div>
  );
}
