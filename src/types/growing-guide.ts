export interface GrowingStage {
  stage: string;
  duration_days: number;
  instructions: string[];
  media?: {
    images?: string[];
    video?: string;
  };
  tools_needed?: string[];
  tips?: string[];
  reminders?: string[];
  warnings?: string[];
  trivia?: string[];
}

export interface GrowingGuide {
  plant_id: string;
  common_name: string;
  scientific_name: string;
  growing_guide: GrowingStage[];
}

export interface StageProgress {
  stageId: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  photos?: string[];
}

export interface PlantProgress {
  plantId: string;
  startDate: Date;
  stages: StageProgress[];
  currentStage: number;
  customizations?: {
    location?: string;
    space?: string;
    skill?: 'beginner' | 'intermediate' | 'advanced';
  };
} 