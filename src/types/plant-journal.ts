export type Mood = 'excited' | 'happy' | 'hopeful' | 'neutral' | 'concerned' | 'frustrated' | 'sad';

export type HealthStatus = 'healthy' | 'thriving' | 'stressed' | 'wilting' | 'diseased' | 'pest_issue';

export interface WeatherInfo {
  temperature?: string;
  humidity?: string;
  condition?: string;
}

export interface TaskSummary {
  taskId: string;
  taskType: string;
  completed: boolean;
}

export interface JournalPhoto {
  id: string;
  url: string;
  alt?: string;
  uploadedAt: string;
}

export interface PlantJournalEntry {
  entry_id: string;
  user_id: string; // Assuming a user ID system, can be simplified if not used
  plant_id: string;
  plant_name: string; // Add plant name for easier display
  date: string; // ISO string date of the entry
  growth_stage_id?: string; // Link to a specific growth stage if applicable
  growth_stage_name?: string; // Display growth stage name
  note?: string;
  photos?: JournalPhoto[];
  weather_info?: WeatherInfo;
  task_summary?: TaskSummary[]; // Link to tasks completed on this day
  mood?: Mood;
  health_status?: HealthStatus;
  ai_suggestions?: string[]; // AI-generated insights/suggestions
  milestones?: string[]; // Notable events like first sprout, flowering, etc.
}

export interface PlantJournal {
  plant_id: string;
  entries: PlantJournalEntry[];
  plant_nickname?: string;
  planting_date: string;
}

// Types for Growing Guide stages (for reference/potential future use)
export interface GrowthStage {
  id: string;
  name: string;
  description: string;
  timing?: string; // e.g., "Weeks 1-2", "Days 15-30"
  duration_days?: number; // Duration in days if applicable
  tasks?: string[]; // Recommended tasks for this stage
  environmental_conditions?: any; // Ideal conditions
}

export interface GrowingGuide {
    guide_id: string;
    plant_id: string; // Should match the plant_id
    plant_name: string; // Full or common name
    stages: GrowthStage[];
    // other guide details
} 