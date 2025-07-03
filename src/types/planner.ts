export interface PlannerData {
  location: {
    latitude: number;
    longitude: number;
    climateZone: string;
    address: string;
    zipCode?: string;
  };
  space: 'garden' | 'indoor' | 'balcony';
  spaceSize: string;
  sunlight: 'full' | 'partial' | 'shade';
  experience: 'beginner' | 'intermediate' | 'expert';
  timeCommitment: 'low' | 'moderate' | 'high';
  purpose: 'food' | 'ornamental' | 'medicinal' | 'mixed';
  plantTypes: string[];
  automation: string;
  userId: string;
  createdAt: string;
} 