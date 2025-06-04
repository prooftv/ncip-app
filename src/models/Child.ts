export interface Child {
  id: string;
  name: string;
  age: number;
  guardianId: string;
  schoolId?: string; // Make optional
  lastSeen?: { // Make optional
    location: string;
    timestamp?: Date; // Make optional
  };
  photoURL?: string;
}