export interface PlannerData {
  location: {
    lat: number;
    lng: number;
    climateZone: string;
    address: string;
  };
  space: 'indoor' | 'balcony' | 'garden';
  sunlight: 'full' | 'partial' | 'shade';
  experience: 'beginner' | 'intermediate' | 'expert';
  timeCommitment: 'low' | 'moderate' | 'high';
  purpose: 'food' | 'ornamental' | 'medicinal' | 'mixed';
  userId: string;
  createdAt: string;
} 