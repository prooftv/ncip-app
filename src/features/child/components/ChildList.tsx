'use client'
import { useEffect, useState } from 'react';
import { getChildrenByGuardian } from '@features/child/api/childService';
import { useAuth } from '@features/auth/context';
import { Child } from '@models/Child';

export default function ChildList() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    if (user?.uid) {
      loadChildren();
    }
  }, [user]);

  const loadChildren = async () => {
    const data = await getChildrenByGuardian(user!.uid);
    setChildren(data);
  };

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
