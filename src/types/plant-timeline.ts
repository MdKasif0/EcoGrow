import { GrowingGuide, GrowthStage } from "./plant-journal"; // Assuming GrowingGuide and GrowthStage are defined here or in a shared types file

// Define a type for a single stage in the timeline
export interface TimelineStage extends GrowthStage {
  // Inherits id, name, description from GrowthStage
  start_date: string; // Calculated start date for this stage (ISO string)
  end_date: string;   // Calculated end date for this stage (ISO string)
  duration_days: number; // Actual or estimated duration in days
  // Add other stage-specific timeline data if needed, e.g.,
  // key_actions: string[];
  // milestones: string[];
  // linked_tasks?: string[]; // IDs of associated tasks
  // linked_journal_entries?: string[]; // IDs of associated journal entries
}

// Define the main structure for a plant's timeline data
export interface PlantTimeline {
  plant_id: string;
  plant_name: string; // For easy reference
  planting_date: string; // The date the timeline starts from (ISO string)
  growing_guide_id?: string; // Optional link to the growing guide used
  stages: TimelineStage[]; // Calculated timeline stages
  projected_harvest_date?: string; // Estimated date for harvest (ISO string)
  last_updated?: string; // Timestamp of the last calculation/update
}

// Optional: Define types for interactive elements or visualizations
// export interface TimelineMarker {
//   date: string;
//   type: 'milestone' | 'task' | 'journal';
//   label: string;
//   icon?: string;
//   link?: string; // Link to related task/journal entry
// } 