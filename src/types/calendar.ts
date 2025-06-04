export type TaskType = 'water' | 'fertilize' | 'harvest' | 'prune' | 'pest_control' | 'other';

export type TaskImportance = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 'pending' | 'completed' | 'missed' | 'snoozed';

export type ReminderTime = 'morning' | 'afternoon' | 'evening' | 'custom';

export interface GrowTask {
  id: string;
  plantId: string;
  plantName: string;
  taskType: TaskType;
  date: string;
  repeat?: string;
  importance: TaskImportance;
  status: TaskStatus;
  notes?: string;
  reminderTime?: ReminderTime;
  customReminderTime?: string;
  completedAt?: string;
  snoozedUntil?: string;
}

export interface CalendarFilters {
  taskTypes?: TaskType[];
  plants?: string[];
  status?: TaskStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ReminderPreferences {
  defaultReminderTime: ReminderTime;
  customReminderTime?: string;
  enabledTaskTypes: TaskType[];
  notificationTone: 'friendly' | 'strict' | 'scientific';
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface TaskStreak {
  plantId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
  badges: string[];
} 