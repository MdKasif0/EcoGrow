import { PlantJournal, GrowingGuide, GrowthStage } from "@/types/plant-journal"; // Assuming these types are here or accessible
import { PlantTimeline, TimelineStage } from "@/types/plant-timeline"; // Import our new timeline types
import { growingGuides } from "@/lib/services/growingGuideService"; // Import the growing guides data
import { addDays, format, isValid, parseISO } from "date-fns"; // Import date utility functions

export class PlantTimelineService {
  private static instance: PlantTimelineService;

  private constructor() {
    // Singleton pattern
  }

  public static getInstance(): PlantTimelineService {
    if (!PlantTimelineService.instance) {
      PlantTimelineService.instance = new PlantTimelineService();
    }
    return PlantTimelineService.instance;
  }

  /**
   * Generates a PlantTimeline for a given plant journal.
   * @param journal The PlantJournal object.
   * @returns The calculated PlantTimeline, or null if necessary data is missing.
   */
  public generateTimeline(journal: PlantJournal): PlantTimeline | null {
    if (!journal.planting_date || !journal.plant_id) {
      console.warn("Cannot generate timeline: Missing planting date or plant ID.", journal);
      return null; // Cannot generate timeline without a planting date
    }

    // In a real app, you'd determine the growing guide based on plant variety.
    // For now, we'll assume the journal might link to a guide or we'll use a default/mock guide.
    // Let's try to find a guide based on the plant ID, assuming plantId might match a guideId pattern
    const growingGuideId = journal.growing_guide_id || Object.keys(growingGuides).find(id => id.startsWith(journal.plant_id.replace('plant-', '')));

    if (!growingGuideId || !growingGuides[growingGuideId]) {
      console.warn(`Cannot generate timeline: Growing guide not found for plant ID ${journal.plant_id} or guide ID ${growingGuideId}.`);
      // In a real app, you might fall back to a generic timeline or require user input
      return null;
    }

    const guide = growingGuides[growingGuideId];
    const plantingDate = parseISO(journal.planting_date);

    if (!isValid(plantingDate)) {
      console.error("Invalid planting date format:", journal.planting_date);
      return null;
    }

    let currentTimelineDate = plantingDate;
    const timelineStages: TimelineStage[] = [];
    let totalDuration = 0;

    // Calculate dates and durations for each stage
    for (const stage of guide.stages) {
      // Assuming GrowthStage has a duration_days property as used in calculateGrowthStage
      const duration = stage.duration_days || 0; // Use duration from the stage, default to 0
      const startDate = currentTimelineDate;
      const endDate = addDays(startDate, duration);

      const timelineStage: TimelineStage = {
        ...stage, // Copy existing stage properties
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        duration_days: duration, // Use the duration from the stage data
      };

      timelineStages.push(timelineStage);
      currentTimelineDate = endDate; // The next stage starts when this one ends
      totalDuration += duration;
    }

    const projectedHarvestDate = addDays(plantingDate, totalDuration);

    return {
      plant_id: journal.plant_id,
      plant_name: journal.plant_name, // Get plant name from journal
      planting_date: journal.planting_date,
      growing_guide_id: growingGuideId,
      stages: timelineStages,
      projected_harvest_date: format(projectedHarvestDate, 'yyyy-MM-dd'),
      last_updated: new Date().toISOString(),
    };
  }

  // Add other methods here for getting a timeline, updating it, etc.
  // For now, generating based on journal is the core need.
} 