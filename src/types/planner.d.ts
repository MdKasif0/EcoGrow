export interface PlannerData {
  userId: string;
  location: {
    lat?: number;
    lng?: number;
    address?: string;
    zipCode: string;
    climateZone: string;
  };
  space: string; // e.g., "indoor", "balcony", "small_yard", "large_garden", "greenhouse"
  spaceSize: string; // e.g., "100"
  sunlight: string; // e.g., "full", "partial", "shade"
  purpose: string; // e.g., "food", "ornamental", "medicinal", "mixed"
  experience: string; // e.g., "beginner", "intermediate", "advanced"
  timeCommitment: string; // e.g., "Minimal", "Low", "Moderate", "High", "Very High"
  automation: string; // e.g., "manual", "some_automation", "full_automation"
  plantTypes: string[]; // e.g., ["vegetables", "herbs"]
  createdAt: string; // ISO date string
}
