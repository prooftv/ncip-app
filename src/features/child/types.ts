export interface Child {
  id: string;
  name: string;
  age: number;
  parentId?: string; // Add parentId for compatibility
  guardianId?: string; // Alternative field name
  lastSeen?: {
    location: string;
    timestamp?: Date;
  };
  guardians?: Array<{
    id: string;
    status: 'pending' | 'approved';
    email: string;
  }>;
  // Add additional fields that might exist in Firestore
  createdAt?: Date;
  updatedAt?: Date;
  emergencyContacts?: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
}