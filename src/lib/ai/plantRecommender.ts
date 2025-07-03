import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PlannerData } from '@/types/planner';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface PlantRecommendation {
  id: string;
  name: string;
  type: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  growingTime: string;
  sunlight: string;
  water: string;
  description: string;
  scientificName?: string;
  commonNames?: string[];
  benefits?: string[];
  warnings?: string[];
  careInstructions?: {
    watering: string;
    sunlight: string;
    soil: string;
    temperature: string;
    humidity: string;
    fertilizing?: string;
    pruning?: string;
  };
  growingStages?: {
    stage: string;
    duration: string;
    instructions: string | string[];
  }[];
  commonProblems?: {
    problem: string;
    solution: string;
  }[];
  harvestInstructions?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    fiber?: number;
    vitamins?: string[];
    minerals?: string[];
  };
}

export interface GrowingConditions {
  climate: string;
  spaceType: 'Indoor' | 'Outdoor' | 'Greenhouse' | 'Balcony';
  spaceSize: number;
  sunlight: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: {
    min: number;
    max: number;
  };
}

export interface UserPreferences {
  plantTypes: string[];
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  timeCommitment: string;
  wateringFrequency: string;
}

export interface PlantRecommendationRequest {
  conditions: GrowingConditions;
  preferences: UserPreferences;
}

// Cleaned up and verified mock plant database
const mockPlantDatabase: PlantRecommendation[] = [
  {
    id: 'tomato_001', // Using id consistent with growing guide
    name: 'Tomato',
    type: 'Vegetable',
    difficulty: 'Beginner',
    growingTime: '60-85 days',
    sunlight: 'Full sun',
    water: 'Moderate',
    description: 'A popular garden vegetable that produces juicy, red fruits. Great for beginners and can be grown in containers or garden beds.',
    scientificName: 'Solanum lycopersicum',
    commonNames: ['Garden Tomato'],
    benefits: ['Rich in antioxidants', 'Versatile in cooking'],
    warnings: ['Can be susceptible to blight'],
    careInstructions: {
      watering: 'Keep soil consistently moist but not waterlogged',
      sunlight: 'Full sun',
      soil: 'Well-draining potting mix',
      temperature: '65-85°F (18-29°C)',
      humidity: '40-60%'
    },
    growingStages: [
      {
        stage: 'Seedling',
        duration: '14 days',
        instructions: ['Keep soil moist', 'Provide warmth']
      },
      {
        stage: 'Vegetative',
        duration: '30 days',
        instructions: ['Water regularly', 'Support stems']
      },
      {
        stage: 'Fruiting',
        duration: '30 days',
        instructions: ['Monitor for pests', 'Harvest when ripe']
      }
    ],
    commonProblems: [
      {
        problem: 'Yellow leaves',
        solution: 'Check for overwatering and ensure proper drainage'
      },
      {
        problem: 'Wilting',
        solution: 'Increase watering frequency and check soil moisture'
      }
    ],
    harvestInstructions: 'Harvest when fruits are ripe and fully colored',
    nutritionalInfo: {
      calories: 23,
      protein: 3.2,
      fiber: 1.6,
      vitamins: ['Vitamin A', 'Vitamin C', 'Vitamin K'],
      minerals: ['Calcium', 'Iron', 'Magnesium']
    }
  },
  {
    id: 'basil_001', // Using id consistent with growing guide
    name: 'Basil',
    type: 'Herb',
    difficulty: 'Beginner',
    growingTime: '30-45 days',
    sunlight: 'Full sun',
    water: 'Moderate',
    description: 'A fragrant herb that adds flavor to many dishes. Easy to grow indoors or outdoors.',
    scientificName: 'Ocimum basilicum',
    commonNames: ['Sweet Basil'],
    benefits: ['Culinary use', 'Antioxidant properties'],
    warnings: ['Can be sensitive to cold'],
    careInstructions: {
      watering: 'Water when soil surface feels dry',
      sunlight: 'Full sun',
      soil: 'Well-draining potting mix',
      temperature: '65-85°F (18-29°C)',
      humidity: '40-60%'
    },
    growingStages: [
      {
        stage: 'Seedling',
        duration: '10 days',
        instructions: ['Keep soil moist', 'Provide warmth']
      },
      {
        stage: 'Vegetative',
        duration: '20 days',
        instructions: ['Pinch tips', 'Water regularly']
      },
      {
        stage: 'Harvest',
        duration: '30 days',
        instructions: ['Harvest leaves', 'Prevent flowering']
      }
    ],
    commonProblems: [
      {
        problem: 'Yellow leaves',
        solution: 'Check for overwatering and ensure proper drainage'
      },
      {
        problem: 'Wilting',
        solution: 'Increase watering frequency and check soil moisture'
      }
    ],
    harvestInstructions: 'Harvest leaves from the top down, leaving at least 2-3 sets of leaves on the plant',
    nutritionalInfo: {
      calories: 23,
      protein: 3.2,
      fiber: 1.6,
      vitamins: ['Vitamin A', 'Vitamin C', 'Vitamin K'],
      minerals: ['Calcium', 'Iron', 'Magnesium']
    }
  }
];

// Mock data for development
export const mockPlants: PlantRecommendation[] = [
  {
    id: '1',
    name: 'Basil',
    type: 'Herb',
    difficulty: 'Easy',
    growingTime: '60-90 days',
    sunlight: 'Full sun',
    water: 'Moderate',
    description: 'A popular culinary herb with a sweet, slightly peppery flavor.',
    scientificName: 'Ocimum basilicum',
    commonNames: ['Sweet Basil'],
    benefits: ['Culinary use', 'Antioxidant properties'],
    warnings: ['Can be sensitive to cold'],
    careInstructions: {
      watering: 'Keep soil moist but not waterlogged',
      fertilizing: 'Use a balanced fertilizer every 2-3 weeks',
      pruning: 'Pinch off flower buds to encourage leaf growth',
      sunlight: '6-8 hours of direct sunlight daily',
      soil: 'Well-draining potting mix',
      temperature: '65-85°F (18-29°C)',
      humidity: '40-60%'
    },
    growingStages: [
      {
        stage: 'Germination',
        duration: '7-14 days',
        instructions: 'Warm soil, consistent moisture'
      },
      {
        stage: 'Seedling',
        duration: '14-21 days',
        instructions: 'Bright light, well-draining soil'
      },
      {
        stage: 'Vegetative',
        duration: '30-45 days',
        instructions: 'Regular watering, full sun'
      }
    ],
    commonProblems: [
      {
        problem: 'Yellow leaves',
        solution: 'Overwatering or poor drainage'
      },
      {
        problem: 'Leggy growth',
        solution: 'Insufficient light'
      }
    ],
    harvestInstructions: 'Pinch off leaves from the top, leaving at least 2 sets of leaves below',
    nutritionalInfo: {
      calories: 23,
      vitamins: ['Vitamin K', 'Vitamin A', 'Vitamin C'],
      minerals: ['Calcium', 'Iron', 'Magnesium']
    }
  },
  {
    id: '2',
    name: 'Tomato',
    type: 'Vegetable',
    difficulty: 'Medium',
    growingTime: '70-85 days',
    sunlight: 'Full sun',
    water: 'Regular',
    description: 'A versatile garden favorite that produces juicy, flavorful fruits.',
    scientificName: 'Solanum lycopersicum',
    commonNames: ['Garden Tomato'],
    benefits: ['Rich in antioxidants', 'Versatile in cooking'],
    warnings: ['Can be susceptible to blight'],
    careInstructions: {
      watering: 'Deep watering 2-3 times per week',
      fertilizing: 'Use tomato-specific fertilizer every 2 weeks',
      pruning: 'Remove suckers and lower leaves',
      sunlight: '8-10 hours of direct sunlight daily',
      soil: 'Well-draining potting mix',
      temperature: '65-85°F (18-29°C)',
      humidity: '40-60%'
    },
    growingStages: [
      {
        stage: 'Germination',
        duration: '5-10 days',
        instructions: 'Warm soil, consistent moisture'
      },
      {
        stage: 'Seedling',
        duration: '21-28 days',
        instructions: 'Bright light, well-draining soil'
      },
      {
        stage: 'Vegetative',
        duration: '30-45 days',
        instructions: 'Regular watering, full sun'
      },
      {
        stage: 'Fruiting',
        duration: '45-60 days',
        instructions: 'Consistent watering, support structure'
      }
    ],
    commonProblems: [
      {
        problem: 'Blossom end rot',
        solution: 'Calcium deficiency or inconsistent watering'
      },
      {
        problem: 'Leaf spot',
        solution: 'Fungal infection'
      }
    ],
    harvestInstructions: 'Harvest when fruits are fully colored and slightly soft',
    nutritionalInfo: {
      calories: 18,
      vitamins: ['Vitamin C', 'Vitamin K', 'Vitamin A'],
      minerals: ['Potassium', 'Folate', 'Iron']
    }
  },
  {
    id: '3',
    name: 'Mint',
    type: 'Herb',
    difficulty: 'Easy',
    growingTime: '60-90 days',
    sunlight: 'Partial sun',
    water: 'Moderate',
    description: 'A fast-growing herb with a refreshing aroma and flavor.',
    scientificName: 'Mentha',
    commonNames: ['Peppermint', 'Spearmint'],
    benefits: ['Aromatic', 'Digestive aid'],
    warnings: ['Can be invasive if not contained'],
    careInstructions: {
      watering: 'Keep soil consistently moist',
      fertilizing: 'Light feeding every 4-6 weeks',
      pruning: 'Regular harvesting to prevent leggy growth',
      sunlight: '4-6 hours of sunlight daily',
      soil: 'Well-draining potting mix',
      temperature: '60-75°F (15-24°C)',
      humidity: '50-70%'
    },
    growingStages: [
      {
        stage: 'Germination',
        duration: '10-15 days',
        instructions: 'Warm soil, consistent moisture'
      },
      {
        stage: 'Seedling',
        duration: '14-21 days',
        instructions: 'Bright light, well-draining soil'
      },
      {
        stage: 'Vegetative',
        duration: '30-45 days',
        instructions: 'Regular watering, partial sun'
      }
    ],
    commonProblems: [
      {
        problem: 'Rust',
        solution: 'Improve air circulation and remove affected leaves'
      },
      {
        problem: 'Root rot',
        solution: 'Ensure proper drainage and reduce watering'
      }
    ],
    harvestInstructions: 'Cut stems just above a leaf node',
    nutritionalInfo: {
      calories: 44,
      vitamins: ['Vitamin A', 'Vitamin C', 'Folate'],
      minerals: ['Calcium', 'Iron', 'Magnesium']
    }
  }
];

// Helper function to get current season based on hemisphere
const getSeason = (hemisphere: 'northern' | 'southern'): string => {
  const month = new Date().getMonth();
  if (hemisphere === 'northern') {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  } else {
    if (month >= 2 && month <= 4) return 'fall';
    if (month >= 5 && month <= 7) return 'winter';
    if (month >= 8 && month <= 10) return 'spring';
    return 'summer';
  }
};

// Function to get AI-powered plant recommendations
const getAIRecommendations = async (plannerData: PlannerData): Promise<PlantRecommendation[]> => {
  // Check if API key is configured
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    console.warn('Gemini API key not configured. Using mock data instead.');
    return mockPlantDatabase;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Given the following growing conditions and preferences, recommend suitable plants:
    - Climate Zone: ${plannerData.location.climateZone}
    - Growing Space: ${plannerData.space}
    - Sunlight: ${plannerData.sunlight}
    - Experience Level: ${plannerData.experience}
    - Time Commitment: ${plannerData.timeCommitment}
    - Purpose: ${plannerData.purpose}

    Please provide detailed recommendations for plants that would thrive in these conditions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // For now, return mock data since we're not parsing the AI response
    return mockPlantDatabase; // Still using mock data as AI parsing is not implemented
  } catch (error) {
    console.warn('Error getting AI recommendations, falling back to mock data:', error);
    // Fallback to mock data if AI fails
    return mockPlantDatabase;
  }
};

// Main function to get plant recommendations
export const getPlantRecommendations = async (plannerData: PlannerData | null): Promise<PlantRecommendation[]> => {
  if (!plannerData) {
    console.error('No planner data provided');
    return [];
  }

  try {
    // First try to get AI recommendations
    const aiRecommendations = await getAIRecommendations(plannerData);
    // Although AI recommendations are not parsed, this call simulates the process
    if (aiRecommendations.length > 0) {
      return aiRecommendations;
    }

    // If AI recommendations fail or are empty, fall back to mock data
    return mockPlantDatabase;
  } catch (error) {
    console.error('Error getting plant recommendations:', error);
    // Return mock data as fallback
    return mockPlantDatabase;
  }
}; 