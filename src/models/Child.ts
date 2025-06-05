export interface Child {
  id: string;
  name: string;
  age: number;
  guardianId: string;
  schoolId?: string;
  lastSeen?: {
    location: string;
    timestamp?: Date;
  };
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function validateChildData(data: Partial<Child>): data is Omit<Child, 'id'> {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }

  if (!data.age || typeof data.age !== 'number' || data.age <= 0 || data.age > 18) {
    throw new Error('Age must be a positive number between 1 and 18');
  }

  if (!data.guardianId || typeof data.guardianId !== 'string') {
    throw new Error('Guardian ID is required');
  }

  return true;
}