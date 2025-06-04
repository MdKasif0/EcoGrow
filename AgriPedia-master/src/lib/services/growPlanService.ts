import type { PlannerData } from '@/types/planner';
import type { PlantRecommendation } from '@/lib/ai/plantRecommender';

export interface GrowPlan {
  id: string;
  name: string;
  description: string;
  plannerData: PlannerData;
  selectedPlants: PlantRecommendation[];
  createdAt: string;
  updatedAt: string;
  notes: string;
  isPublic: boolean;
  shareId?: string;
}

const STORAGE_KEY = 'grow_plans';

export function saveGrowPlan(plan: Omit<GrowPlan, 'id' | 'createdAt' | 'updatedAt'>): GrowPlan {
  const plans = getAllGrowPlans();
  const newPlan: GrowPlan = {
    ...plan,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shareId: plan.isPublic ? crypto.randomUUID() : undefined
  };
  
  plans.push(newPlan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  return newPlan;
}

export function updateGrowPlan(id: string, updates: Partial<GrowPlan>): GrowPlan {
  const plans = getAllGrowPlans();
  const index = plans.findIndex(plan => plan.id === id);
  
  if (index === -1) {
    throw new Error('Grow plan not found');
  }

  const updatedPlan = {
    ...plans[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  plans[index] = updatedPlan;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  return updatedPlan;
}

export function deleteGrowPlan(id: string): void {
  const plans = getAllGrowPlans();
  const filteredPlans = plans.filter(plan => plan.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlans));
}

export function duplicateGrowPlan(id: string): GrowPlan {
  const plans = getAllGrowPlans();
  const planToDuplicate = plans.find(plan => plan.id === id);
  
  if (!planToDuplicate) {
    throw new Error('Grow plan not found');
  }

  const duplicatedPlan: GrowPlan = {
    ...planToDuplicate,
    id: crypto.randomUUID(),
    name: `${planToDuplicate.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    shareId: undefined
  };

  plans.push(duplicatedPlan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  return duplicatedPlan;
}

export function getAllGrowPlans(): GrowPlan[] {
  const plansJson = localStorage.getItem(STORAGE_KEY);
  return plansJson ? JSON.parse(plansJson) : [];
}

export function getGrowPlanById(id: string): GrowPlan | null {
  const plans = getAllGrowPlans();
  return plans.find(plan => plan.id === id) || null;
}

export function getGrowPlanByShareId(shareId: string): GrowPlan | null {
  const plans = getAllGrowPlans();
  return plans.find(plan => plan.shareId === shareId) || null;
}

export async function exportGrowPlanToPDF(plan: GrowPlan): Promise<Blob> {
  // This is a placeholder for PDF generation
  // You would typically use a library like jsPDF or html2pdf
  const content = `
    Grow Plan: ${plan.name}
    Created: ${new Date(plan.createdAt).toLocaleDateString()}
    Last Updated: ${new Date(plan.updatedAt).toLocaleDateString()}
    
    Location: ${plan.plannerData.location.address}
    Climate Zone: ${plan.plannerData.location.climateZone}
    Growing Space: ${plan.plannerData.space}
    Sunlight: ${plan.plannerData.sunlight}
    Experience Level: ${plan.plannerData.experience}
    Time Commitment: ${plan.plannerData.timeCommitment}
    Purpose: ${plan.plannerData.purpose}
    
    Selected Plants:
    ${plan.selectedPlants.map(plant => `
      - ${plant.name} (${plant.scientificName})
      Difficulty: ${plant.difficulty}
      Days to Harvest: ${plant.daysToHarvest.min}-${plant.daysToHarvest.max}
      Water Needs: ${plant.waterNeeds.frequency}
    `).join('\n')}
    
    Notes:
    ${plan.notes}
  `;

  // For now, return a text blob
  return new Blob([content], { type: 'text/plain' });
} 