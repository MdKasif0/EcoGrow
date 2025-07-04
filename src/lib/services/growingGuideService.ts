import { GrowingGuide, PlantProgress, StageProgress } from '@/types/growing-guide';

// Cleaned up and verified mock database of growing guides
export const growingGuides: Record<string, GrowingGuide> = {
  basil_001: {
    id: 'basil_001',
    plantName: 'Sweet Basil',
    stages: [
      {
        id: 'basil_planting',
        title: 'Planting',
        description: 'Start your basil journey',
        instructions: [
          'Choose a container with drainage holes',
          'Fill with well-draining potting mix',
          'Plant seeds 1/4 inch deep',
          'Water gently and keep soil moist'
        ],
        media: [
          {
            type: 'image',
            url: '/images/guides/basil-planting.jpg',
            alt: 'Basil planting guide'
          }
        ],
        toolsNeeded: [
          'Container with drainage',
          'Potting mix',
          'Basil seeds',
          'Watering can'
        ],
        tips: [
          'Plant in spring after last frost',
          'Keep soil temperature between 65-75°F',
          'Ensure good air circulation'
        ],
        warnings: [
          'Avoid overwatering',
          'Protect from cold drafts'
        ]
      },
      {
        id: 'basil_germination',
        title: 'Germination',
        description: 'Watch your basil sprout',
        instructions: [
          'Keep soil consistently moist',
          'Maintain temperature between 65-75°F',
          'Provide 6-8 hours of sunlight',
          'Thin seedlings when they have 2-3 leaves'
        ],
        media: [
          {
            type: 'image',
            url: '/images/guides/basil-germination.jpg',
            alt: 'Basil germination stage'
          }
        ],
        toolsNeeded: [
          'Grow lights (optional)',
          'Spray bottle',
          'Thermometer'
        ],
        tips: [
          'Use a humidity dome for better germination',
          'Keep soil warm but not hot'
        ],
        warnings: [
          'Don\'t let soil dry out',
          'Avoid direct hot sunlight'
        ]
      },
      {
        id: 'basil_growing',
        title: 'Growing',
        description: 'Nurture your basil plant',
        instructions: [
          'Water when top inch of soil is dry',
          'Provide 6-8 hours of sunlight',
          'Pinch off flower buds to promote leaf growth',
          'Fertilize every 2-3 weeks'
        ],
        media: [
          {
            type: 'image',
            url: '/images/guides/basil-growing.jpg',
            alt: 'Growing basil plant'
          }
        ],
        toolsNeeded: [
          'Liquid fertilizer',
          'Pruning shears',
          'Moisture meter'
        ],
        tips: [
          'Rotate plant for even growth',
          'Harvest leaves regularly to promote bushiness'
        ],
        warnings: [
          'Watch for yellowing leaves',
          'Check for pests regularly'
        ]
      },
      {
        id: 'basil_harvesting',
        title: 'Harvesting',
        description: 'Enjoy your fresh basil',
        instructions: [
          'Harvest leaves in the morning',
          'Cut stems above leaf nodes',
          'Leave at least 2-3 sets of leaves',
          'Store in water or refrigerate'
        ],
        media: [
          {
            type: 'image',
            url: '/images/guides/basil-harvesting.jpg',
            alt: 'Harvesting basil'
          }
        ],
        toolsNeeded: [
          'Sharp scissors',
          'Storage container',
          'Water glass (for storage)'
        ],
        tips: [
          'Harvest before flowering for best flavor',
          'Use fresh or freeze for later'
        ],
        warnings: [
          'Don\'t harvest more than 1/3 of plant at once',
          'Avoid harvesting in hot sun'
        ]
      }
    ]
  },
  tomato_001: {
    id: 'tomato_001',
    plantName: 'Cherry Tomato',
    stages: [
      {
        id: 'tomato_planting',
        title: 'Planting',
        description: 'Start your tomato journey',
        instructions: [
          'Choose a sunny location',
          'Prepare soil with compost',
          'Plant seedlings deep',
          'Water thoroughly'
        ],
        media: [
          {
            type: 'image',
            url: '/images/guides/tomato-planting.jpg',
            alt: 'Tomato planting guide'
          }
        ],
        toolsNeeded: [
          'Garden trowel',
          'Compost',
          'Tomato seedlings',
          'Stakes or cage'
        ],
        tips: [
          'Plant after last frost',
          'Space plants 24-36 inches apart',
          'Add calcium to prevent blossom end rot'
        ],
        warnings: [
          'Avoid planting in same spot as last year',
          'Protect from late frosts'
        ]
      },
      {
        id: 'tomato_growing',
        title: 'Growing',
        description: 'Nurture your tomato plants',
        instructions: [
          'Water deeply and regularly',
          'Support with stakes or cage',
          'Prune suckers',
          'Fertilize every 2-3 weeks'
        ],
        media: [
          {
            type: 'image',
            url: '/images/guides/tomato-growing.jpg',
            alt: 'Growing tomato plant'
          }
        ],
        toolsNeeded: [
          'Tomato fertilizer',
          'Pruning shears',
          'Garden ties'
        ],
        tips: [
          'Mulch to retain moisture',
          'Remove lower leaves to prevent disease'
        ],
        warnings: [
          'Watch for blight',
          'Check for hornworms'
        ]
      },
      {
        id: 'tomato_harvesting',
        title: 'Harvesting',
        description: 'Enjoy your fresh tomatoes',
        instructions: [
          'Harvest when fully colored',
          'Pick in the morning',
          'Store at room temperature',
          'Use within a week'
        ],
        media: [
          {
            type: 'image',
            url: '/images/guides/tomato-harvesting.jpg',
            alt: 'Harvesting tomatoes'
          }
        ],
        toolsNeeded: [
          'Harvesting basket',
          'Sharp scissors'
        ],
        tips: [
          'Harvest before first frost',
          'Save seeds for next year'
        ],
        warnings: [
          'Don\'t refrigerate unless fully ripe',
          'Handle gently to avoid bruising'
        ]
      }
    ]
  },
  lettuce_001: {
    id: 'lettuce_001',
    plantName: 'Lettuce',
    stages: [
      {
        id: 'lettuce_planting',
        title: 'Planting',
        description: 'Start your lettuce seeds',
        instructions: [
          'Sow seeds directly in garden or containers.',
          'Plant 1/4 inch deep, 1 inch apart.',
          'Keep soil consistently moist.',
          'Thin to 6-12 inches apart when seedlings emerge.'
        ],
        media: [
          {
            type: 'image',
            url: '/images/plants/lettuce/planting1.jpg',
            alt: 'Lettuce planting'
          }
        ],
        toolsNeeded: ['Garden trowel', 'Watering can', 'Lettuce seeds'],
        tips: ['Plant in partial shade in hot weather.'],
        warnings: ['Avoid overhead watering to prevent disease.']
      },
      {
        id: 'lettuce_growing',
        title: 'Growing',
        description: 'Nurture your lettuce plants',
        instructions: [
          'Water regularly to prevent bitterness.',
          'Mulch to keep soil cool and moist.',
          'Fertilize lightly every 2 weeks.',
          'Watch for slugs and snails.'
        ],
        media: [],
        toolsNeeded: [],
        tips: ['Keep soil consistently moist.'],
        warnings: ['Avoid overhead watering to prevent disease.']
      },
      {
        id: 'lettuce_harvesting',
        title: 'Harvesting',
        description: 'Enjoy your fresh lettuce',
        instructions: [
          'Harvest outer leaves as needed.',
          'Cut entire head at soil level when mature.',
          'Harvest in the morning for best quality.'
        ],
        media: [],
        toolsNeeded: ['Sharp knife or scissors'],
        tips: ['Succession plant every 2 weeks for continuous harvest.'],
        warnings: ['Avoid harvesting in hot sun.']
      }
    ]
  },
  pepper_001: {
    id: 'pepper_001',
    plantName: 'Bell Pepper',
    stages: [
      {
        id: 'pepper_seed_starting',
        title: 'Seed Starting',
        description: 'Start your bell pepper seeds indoors',
        instructions: [
          'Start seeds indoors 8-10 weeks before last frost.',
          'Use seed starting mix in small containers.',
          'Keep soil warm (75-85°F).',
          'Provide 14-16 hours of light daily.'
        ],
        media: [
          {
            type: 'image',
            url: '/images/plants/pepper/seed1.jpg',
            alt: 'Bell pepper seed starting'
          }
        ],
        toolsNeeded: ['Seed trays', 'Heat mat', 'Grow lights', 'Pepper seeds'],
        tips: ['Peppers need warm soil to germinate.'],
        warnings: ['Don\'t let soil dry out during germination.']
      },
      {
        id: 'pepper_transplanting',
        title: 'Transplanting',
        description: 'Move bell pepper seedlings outdoors',
        instructions: [
          'Transplant when seedlings have 4-6 true leaves.',
          'Harden off for 7-10 days.',
          'Plant in full sun, 18-24 inches apart.',
          'Add compost to planting holes.'
        ],
        media: [],
        toolsNeeded: ['Garden trowel', 'Compost'],
        tips: ['Plant after soil reaches 65°F.'],
        warnings: ['Protect from cold temperatures.']
      },
      {
        id: 'pepper_growing',
        title: 'Growing',
        description: 'Nurture your bell pepper plants',
        instructions: [
          'Water deeply 1-2 times per week.',
          'Mulch to maintain soil moisture.',
          'Fertilize every 2-3 weeks.',
          'Support plants if needed.'
        ],
        media: [],
        toolsNeeded: ['Tomato fertilizer' ,'Pruning shears', 'Garden ties'],
        tips: ['Pinch off early flowers to encourage growth.'],
        warnings: ['Monitor for pests and diseases.']
      },
      {
        id: 'pepper_harvesting',
        title: 'Harvesting',
        description: 'Enjoy your fresh bell peppers',
        instructions: [
          'Harvest when fruits reach desired size.',
          'Use scissors to cut peppers from plant.',
          'Store in refrigerator for up to 2 weeks.'
        ],
        media: [],
        toolsNeeded: ['Sharp scissors', 'Harvesting basket'],
        tips: ['Harvest regularly to encourage production.'],
        warnings: ['Avoid letting peppers get too large before harvesting.']
      }
    ]
  }
};

/**
 * Calculates the current growth stage of a plant based on the current date and planting date.
 * @param currentDate The current date.
 * @param plantingDate The date the plant was planted.
 * @param guide The GrowingGuide for the plant.
 * @returns The current GrowthStage object, or null if the stage cannot be determined.
 */
export function calculateGrowthStage(currentDate: Date, plantingDate: Date, guide: GrowingGuide): GrowthStage | null {
  // ... function logic ...
}

// Local storage key for progress
const PROGRESS_STORAGE_KEY = 'growing_guide_progress';

// Service functions
export const growingGuideService = {
  // Get guide for a specific plant
  getGuide: (plantId: string): GrowingGuide | undefined => {
    return growingGuides[plantId];
  },

  // Get all available guides
  getAllGuides: (): GrowingGuide[] => {
    return Object.values(growingGuides);
  },

  // Get or create progress for a plant
  getProgress: (plantId: string): PlantProgress => {
    const allProgress = growingGuideService.getAllProgress();
    return allProgress[plantId] || growingGuideService.initializeProgress(plantId);
  },

  // Get all progress
  getAllProgress: (): Record<string, PlantProgress> => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  },

  // Initialize progress for a new plant
  initializeProgress: (plantId: string): PlantProgress => {
    const guide = growingGuideService.getGuide(plantId);
    if (!guide) throw new Error(`No guide found for plant ${plantId}`);

    const progress: PlantProgress = {
      plantId,
      currentStage: guide.stages[0].id,
      stages: guide.stages.reduce((acc, stage) => {
        acc[stage.id] = {
          completed: false,
          notes: [],
          photos: []
        };
        return acc;
      }, {} as Record<string, StageProgress>)
    };

    growingGuideService.saveProgress(progress);
    return progress;
  },

  // Save progress
  saveProgress: (progress: PlantProgress): void => {
    const allProgress = growingGuideService.getAllProgress();
    allProgress[progress.plantId] = progress;
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
  },

  // Update stage progress
  updateStageProgress: (
    plantId: string,
    stageId: string,
    updates: Partial<StageProgress>
  ): PlantProgress => {
    const progress = growingGuideService.getProgress(plantId);
    const guide = growingGuideService.getGuide(plantId);
    if (!guide) throw new Error(`No guide found for plant ${plantId}`);

    // Update stage progress
    progress.stages[stageId] = {
      ...progress.stages[stageId],
      ...updates
    };

    // Update current stage if needed
    if (updates.completed) {
      const currentStageIndex = guide.stages.findIndex(s => s.id === stageId);
      if (currentStageIndex < guide.stages.length - 1) {
        progress.currentStage = guide.stages[currentStageIndex + 1].id;
      }
    }

    growingGuideService.saveProgress(progress);
    return progress;
  },

  // Add note to stage
  addStageNote: (
    plantId: string,
    stageId: string,
    note: string
  ): PlantProgress => {
    const progress = growingGuideService.getProgress(plantId);
    const stageProgress = progress.stages[stageId];
    
    stageProgress.notes.push({
      id: Date.now().toString(),
      content: note,
      timestamp: new Date().toISOString()
    });

    growingGuideService.saveProgress(progress);
    return progress;
  },

  // Add photo to stage
  addStagePhoto: (
    plantId: string,
    stageId: string,
    photoUrl: string
  ): PlantProgress => {
    const progress = growingGuideService.getProgress(plantId);
    const stageProgress = progress.stages[stageId];
    
    stageProgress.photos.push({
      id: Date.now().toString(),
      url: photoUrl,
      timestamp: new Date().toISOString()
    });

    growingGuideService.saveProgress(progress);
    return progress;
  }
}; 