export interface Child {
  id: string;
  name: string;
  age: number;
  guardianId: string;
  schoolId: string;
  lastSeen: {
    location: string;
    timestamp: Date;
  };
  photoURL?: string;
}
