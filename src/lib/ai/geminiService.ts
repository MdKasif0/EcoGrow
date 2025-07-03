import { GoogleGenerativeAI } from '@google/generative-ai';
import { PlantRecommendation } from './plantRecommender';
import type { PlannerData } from '@/types/planner';

const GEMINI_API_KEY = 'AIzaSyCjpJoM126p3HmoSCrYTUrLshQTvCUumWk';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert horticulturist and plant recommendation system. 
Your task is to recommend plants based on the user's growing conditions and preferences.
Consider the following factors when making recommendations:
1. Climate zone compatibility
2. Light requirements
3. Space availability
4. Experience level
5. Growing season
6. Time commitment
7. Purpose (food, ornamental, etc.)

For each recommended plant, provide:
1. Common name
2. Scientific name
3. Brief description
4. Climate zones
5. Light requirements
6. Difficulty level
7. Growing season
8. Space requirements
9. Care instructions
10. Ideal planting time
11. Days to harvest
12. Water needs
13. Growth stages
14. Relevant tags

Format the response as a JSON array of plant objects.`;

export async function getAIRecommendations(plannerData: PlannerData): Promise<PlantRecommendation[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `${SYSTEM_PROMPT}

User's growing conditions and preferences:
- Climate Zone: ${plannerData.location.climateZone}
- Location: ${plannerData.location.lat}, ${plannerData.location.lng}
- Growing Space: ${plannerData.space}
- Sunlight: ${plannerData.sunlight}
- Experience Level: ${plannerData.experience}
- Time Commitment: ${plannerData.timeCommitment}
- Purpose: ${plannerData.purpose}

Please recommend plants that would be suitable for these conditions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const recommendations = JSON.parse(text) as PlantRecommendation[];

    // Add unique IDs to each recommendation
    return recommendations.map((plant, index) => ({
      ...plant,
      id: `${plant.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      imageUrl: `/images/plants/${plant.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    }));
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw new Error('Failed to get plant recommendations from AI');
  }
} 