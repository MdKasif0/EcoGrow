import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PlannerData } from '@/types/planner';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface PlantRecommendation {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  lightRequirements: string[];
  spaceRequirements: 'small' | 'medium' | 'large';
  idealPlantingTime: {
    start: string;
    end: string;
  };
  daysToHarvest: {
    min: number;
    max: number;
  };
  waterNeeds: {
    frequency: 'low' | 'moderate' | 'high';
    description: string;
  };
  growthStages: {
    name: string;
    duration: number;
    tasks: string[];
  }[];
  tags: string[];
}

// Mock plant database
const mockPlantDatabase: PlantRecommendation[] = [
  {
    id: '1',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    description: 'A popular garden vegetable that produces juicy, red fruits. Great for beginners and can be grown in containers or garden beds.',
    difficulty: 'beginner',
    lightRequirements: ['full sun'],
    spaceRequirements: 'medium',
    idealPlantingTime: {
      start: 'spring',
      end: 'early summer'
    },
    daysToHarvest: {
      min: 60,
      max: 85
    },
    waterNeeds: {
      frequency: 'moderate',
      description: 'Keep soil consistently moist but not waterlogged'
    },
    growthStages: [
      {
        name: 'Seedling',
        duration: 14,
        tasks: ['Keep soil moist', 'Provide warmth']
      },
      {
        name: 'Vegetative',
        duration: 30,
        tasks: ['Water regularly', 'Support stems']
      },
      {
        name: 'Fruiting',
        duration: 30,
        tasks: ['Monitor for pests', 'Harvest when ripe']
      }
    ],
    tags: ['vegetable', 'annual', 'container-friendly']
  },
  {
    id: '2',
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    description: 'A fragrant herb that adds flavor to many dishes. Easy to grow indoors or outdoors.',
    difficulty: 'beginner',
    lightRequirements: ['full sun', 'partial shade'],
    spaceRequirements: 'small',
    idealPlantingTime: {
      start: 'spring',
      end: 'summer'
    },
    daysToHarvest: {
      min: 30,
      max: 45
    },
    waterNeeds: {
      frequency: 'moderate',
      description: 'Water when soil surface feels dry'
    },
    growthStages: [
      {
        name: 'Seedling',
        duration: 10,
        tasks: ['Keep soil moist', 'Provide warmth']
      },
      {
        name: 'Vegetative',
        duration: 20,
        tasks: ['Pinch tips', 'Water regularly']
      },
      {
        name: 'Harvest',
        duration: 30,
        tasks: ['Harvest leaves', 'Prevent flowering']
      }
    ],
    tags: ['herb', 'annual', 'indoor-friendly']
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
    return mockPlantDatabase;
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
    if (aiRecommendations.length > 0) {
      return aiRecommendations;
    }

    // If AI recommendations fail, fall back to mock data
    return mockPlantDatabase;
  } catch (error) {
    console.error('Error getting plant recommendations:', error);
    // Return mock data as fallback
    return mockPlantDatabase;
  }
}; 