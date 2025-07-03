import { PlantJournal, PlantJournalEntry, Mood, HealthStatus, JournalPhoto, TaskSummary } from '@/types/plant-journal';

const JOURNAL_STORAGE_KEY = 'plantJournals';

export class PlantJournalService {
  private static instance: PlantJournalService;
  private journals: Record<string, PlantJournal> = {};

  private constructor() {
    this.loadJournals();
  }

  public static getInstance(): PlantJournalService {
    if (!PlantJournalService.instance) {
      PlantJournalService.instance = new PlantJournalService();
    }
    return PlantJournalService.instance;
  }

  private loadJournals(): void {
    if (typeof window === 'undefined') return;
    const savedJournals = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (savedJournals) {
      try {
        this.journals = JSON.parse(savedJournals);
      } catch (error) {
        console.error('Failed to parse plant journals from localStorage:', error);
        this.journals = {}; // Reset on error
      }
    }
  }

  private saveJournals(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(this.journals));
  }

  public getJournal(plantId: string): PlantJournal | undefined {
    return this.journals[plantId];
  }

  public getAllJournals(): PlantJournal[] {
    return Object.values(this.journals);
  }

  public getJournalEntry(plantId: string, entryId: string): PlantJournalEntry | undefined {
    const journal = this.getJournal(plantId);
    return journal?.entries.find(entry => entry.entry_id === entryId);
  }

  public addJournalEntry(plantId: string, entry: Omit<PlantJournalEntry, 'entry_id' | 'user_id'>): PlantJournalEntry {
    if (!this.journals[plantId]) {
      this.journals[plantId] = {
        plant_id: plantId,
        entries: []
      };
    }

    const newEntry: PlantJournalEntry = {
      entry_id: crypto.randomUUID(),
      user_id: 'guest', // Placeholder user ID
      ...entry,
      date: new Date(entry.date).toISOString(), // Ensure date is ISO string
    };

    this.journals[plantId].entries.push(newEntry);
    this.journals[plantId].entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date
    this.saveJournals();
    return newEntry;
  }

  public updateJournalEntry(plantId: string, updatedEntry: PlantJournalEntry): void {
    const journal = this.getJournal(plantId);
    if (journal) {
      const entryIndex = journal.entries.findIndex(entry => entry.entry_id === updatedEntry.entry_id);
      if (entryIndex !== -1) {
        journal.entries[entryIndex] = { ...updatedEntry, date: new Date(updatedEntry.date).toISOString() };
        this.saveJournals();
      }
    }
  }

  public deleteJournalEntry(plantId: string, entryId: string): void {
    const journal = this.getJournal(plantId);
    if (journal) {
      journal.entries = journal.entries.filter(entry => entry.entry_id !== entryId);
      this.saveJournals();
    }
  }

  public addPhotoToEntry(plantId: string, entryId: string, photo: Omit<JournalPhoto, 'id' | 'uploadedAt'>): JournalPhoto | undefined {
    const journal = this.getJournal(plantId);
    const entry = journal?.entries.find(e => e.entry_id === entryId);
    if (entry) {
      if (!entry.photos) {
        entry.photos = [];
      }
      const newPhoto: JournalPhoto = {
        id: crypto.randomUUID(),
        ...photo,
        uploadedAt: new Date().toISOString(),
      };
      entry.photos.push(newPhoto);
      this.saveJournals();
      return newPhoto;
    }
    return undefined;
  }

  // Placeholder for adding task summary to an entry
  public addTaskSummaryToEntry(plantId: string, entryId: string, task: TaskSummary): void {
    const journal = this.getJournal(plantId);
    const entry = journal?.entries.find(e => e.entry_id === entryId);
    if (entry) {
      if (!entry.task_summary) {
        entry.task_summary = [];
      }
      // Prevent duplicate tasks in summary (basic check)
      if (!entry.task_summary.some(t => t.taskId === task.taskId)) {
         entry.task_summary.push(task);
         this.saveJournals();
      }
    }
  }

  // Placeholder for AI suggestion updates
  public addAiSuggestionsToEntry(plantId: string, entryId: string, suggestions: string[]): void {
     const journal = this.getJournal(plantId);
     const entry = journal?.entries.find(e => e.entry_id === entryId);
     if (entry) {
       entry.ai_suggestions = suggestions;
       this.saveJournals();
     }
  }

  // Placeholder for milestone updates
  public addMilestoneToEntry(plantId: string, entryId: string, milestone: string): void {
    const journal = this.getJournal(plantId);
    const entry = journal?.entries.find(e => e.entry_id === entryId);
    if (entry) {
      if (!entry.milestones) {
         entry.milestones = [];
      }
      if (!entry.milestones.includes(milestone)) {
         entry.milestones.push(milestone);
         this.saveJournals();
      }
    }
  }

  // Placeholder for updating mood or health status
  public updateEntryDetails(plantId: string, entryId: string, updates: { mood?: Mood; health_status?: HealthStatus; note?: string }): void {
    const journal = this.getJournal(plantId);
    const entry = journal?.entries.find(e => e.entry_id === entryId);
    if (entry) {
      Object.assign(entry, updates);
      this.saveJournals();
    }
  }
} 