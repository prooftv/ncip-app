export interface School {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  safeZones: Array<{
    lat: number;
    lng: number;
    radius: number;
  }>;
}
