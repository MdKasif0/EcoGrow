import { GrowTask, TaskType, TaskImportance } from '@/types/calendar';
import { Plant } from '@/types/plant';
import { GrowingGuide } from '@/types/growing-guide';

export class TaskService {
  private static instance: TaskService;
  private tasks: GrowTask[] = [];

  private constructor() {
    this.loadTasks();
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  private loadTasks(): void {
    const savedTasks = localStorage.getItem('growTasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  private saveTasks(): void {
    localStorage.setItem('growTasks', JSON.stringify(this.tasks));
  }

  public generateTasksForPlant(plant: Plant, guide: GrowingGuide, plantingDate: string): GrowTask[] {
    const newTasks: GrowTask[] = [];
    const today = new Date();
    const plantDate = new Date(plantingDate);

    // Generate watering tasks
    if (guide.wateringFrequency) {
      const waterInterval = this.parseFrequency(guide.wateringFrequency);
      let currentDate = new Date(plantDate);
      
      while (currentDate <= new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())) {
        newTasks.push({
          id: crypto.randomUUID(),
          plantId: plant.id,
          plantName: plant.commonName,
          taskType: 'water',
          date: currentDate.toISOString(),
          repeat: guide.wateringFrequency,
          importance: 'high',
          status: 'pending',
          notes: guide.wateringInstructions
        });
        currentDate.setDate(currentDate.getDate() + waterInterval);
      }
    }

    // Generate fertilizing tasks
    if (guide.fertilizingFrequency) {
      const fertilizeInterval = this.parseFrequency(guide.fertilizingFrequency);
      let currentDate = new Date(plantDate);
      
      while (currentDate <= new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())) {
        newTasks.push({
          id: crypto.randomUUID(),
          plantId: plant.id,
          plantName: plant.commonName,
          taskType: 'fertilize',
          date: currentDate.toISOString(),
          repeat: guide.fertilizingFrequency,
          importance: 'medium',
          status: 'pending',
          notes: guide.fertilizingInstructions
        });
        currentDate.setDate(currentDate.getDate() + fertilizeInterval);
      }
    }

    // Add harvest task
    if (guide.harvestTime) {
      const harvestDate = new Date(plantDate);
      harvestDate.setDate(harvestDate.getDate() + guide.harvestTime);
      
      newTasks.push({
        id: crypto.randomUUID(),
        plantId: plant.id,
        plantName: plant.commonName,
        taskType: 'harvest',
        date: harvestDate.toISOString(),
        importance: 'critical',
        status: 'pending',
        notes: guide.harvestingInstructions
      });
    }

    this.tasks = [...this.tasks, ...newTasks];
    this.saveTasks();
    return newTasks;
  }

  private parseFrequency(frequency: string): number {
    const match = frequency.match(/(\d+)\s*(day|week|month)/i);
    if (!match) return 7; // Default to weekly

    const [, number, unit] = match;
    const num = parseInt(number);
    
    switch (unit.toLowerCase()) {
      case 'day':
        return num;
      case 'week':
        return num * 7;
      case 'month':
        return num * 30;
      default:
        return 7;
    }
  }

  public getTasks(filters?: {
    startDate?: string;
    endDate?: string;
    plantId?: string;
    taskType?: TaskType;
    status?: string;
  }): GrowTask[] {
    return this.tasks.filter(task => {
      if (filters?.startDate && new Date(task.date) < new Date(filters.startDate)) return false;
      if (filters?.endDate && new Date(task.date) > new Date(filters.endDate)) return false;
      if (filters?.plantId && task.plantId !== filters.plantId) return false;
      if (filters?.taskType && task.taskType !== filters.taskType) return false;
      if (filters?.status && task.status !== filters.status) return false;
      return true;
    });
  }

  public updateTaskStatus(taskId: string, status: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status as any;
      if (status === 'completed') {
        task.completedAt = new Date().toISOString();
      }
      this.saveTasks();
    }
  }

  public snoozeTask(taskId: string, days: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      const snoozeDate = new Date();
      snoozeDate.setDate(snoozeDate.getDate() + days);
      task.snoozedUntil = snoozeDate.toISOString();
      task.status = 'snoozed';
      this.saveTasks();
    }
  }
} 