import React, { useState, useEffect, useRef } from 'react';
import LocationStep from '../planner/LocationStep';
import GrowingSpaceStep from '../planner/GrowingSpaceStep';
import SunlightExposureStep from '../planner/SunlightExposureStep';
import PurposeStep from '../planner/PurposeStep';
import TimeCommitmentStep from '../planner/TimeCommitmentStep';
import ExperienceLevelStep from '../planner/ExperienceLevelStep';
import ProgressBar from '../planner/ProgressBar';
import ErrorBoundary from '../ErrorBoundary';
import { Button } from '@/components/ui/button';
import { savePlannerData, getPlannerData, clearPlannerData } from '@/lib/userDataStore';
import type { PlannerData } from '@/types/planner';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlantRecommendations from '../planner/PlantRecommendations';
import MyGrowPlan from '../planner/MyGrowPlan';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Copy, Trash2, Edit2 } from 'lucide-react';
import type { PlantRecommendation } from '@/lib/ai/plantRecommender';
import type { GrowPlan } from '@/lib/services/growPlanService';
import type { WeatherData } from '@/lib/services/weatherService';
import { getWeatherData } from '@/lib/services/weatherService';
import { saveGrowPlan, updateGrowPlan, deleteGrowPlan, duplicateGrowPlan, getAllGrowPlans, exportGrowPlanToPDF } from '@/lib/services/growPlanService';
import VoiceInput from '../ui/VoiceInput';

const TOTAL_PLANNER_STEPS = 6; // Location to Experience Level

// Simple validation function
const isValidStepData = (data: any): boolean => {
  if (typeof data !== 'object' || data === null) {
    console.error("Validation Error: Step data is not an object.", data);
    return false;
  }
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) { // Check if key is own property
      if (typeof data[key] === 'function') {
        console.error(`Validation Error: Step data for key '${key}' is a function.`, data);
        return false;
      }
      // Example: Check for excessively deep objects (potential performance issue or circular ref)
      if (typeof data[key] === 'object' && data[key] !== null) {
        try {
          // A simple way to check for circular references or too complex objects for JSON
          JSON.stringify(data[key]);
        } catch (e) {
          console.error(`Validation Error: Step data for key '${key}' is too complex or has circular references.`, data[key], e);
          return false;
        }
      }
    }
  }
  return true;
};

const mockPlannerData: PlannerData = {
  location: {
    lat: 40.7128,
    lng: -74.0060,
    climateZone: "7a",
    address: "New York, NY"
  },
  space: "garden",
  sunlight: "full",
  experience: "beginner",
  timeCommitment: "moderate",
  purpose: "food",
  userId: "defaultUser123",
  createdAt: new Date().toISOString()
};

interface PersonalizedGrowPlannerProps {
  // Add any props if needed
}

const PersonalizedGrowPlanner: React.FC<PersonalizedGrowPlannerProps> = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [plannerData, setPlannerData] = useState<PlannerData | null>(null);
  const [savedPlants, setSavedPlants] = useState<PlantRecommendation[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [growPlans, setGrowPlans] = useState<GrowPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<GrowPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [animationClass, setAnimationClass] = useState('animate-fadeIn'); // Initial animation
  const [displayedStep, setDisplayedStep] = useState(currentStep);
  const previousStepRef = useRef<number>(currentStep);

  useEffect(() => {
    if (previousStepRef.current < currentStep) {
      setAnimationClass('animate-slideOutToLeft');
      setTimeout(() => {
        setDisplayedStep(currentStep);
        setAnimationClass('animate-slideInFromRight');
        previousStepRef.current = currentStep;
      }, 300);
    } else if (previousStepRef.current > currentStep) {
      setAnimationClass('animate-slideOutToRight');
      setTimeout(() => {
        setDisplayedStep(currentStep);
        setAnimationClass('animate-slideInFromLeft');
        previousStepRef.current = currentStep;
      }, 300);
    } else if (displayedStep !== currentStep) {
      setDisplayedStep(currentStep);
      setAnimationClass('animate-fadeIn');
    }
  }, [currentStep, displayedStep]);

  // Load existing planner data from local storage on component mount
  useEffect(() => {
    const loadedData = getPlannerData();
    if (loadedData) {
      console.log("Loaded planner data from local storage:", loadedData);
      // The loadedData includes userId and createdAt, which are not typically part of the
      // step-by-step formData accumulation but are fine to include when setting the initial state.
      // The step components will pick the fields they are responsible for (e.g., data.location, data.space).
      setPlannerData(loadedData);
    }
  }, []); // Empty dependency array ensures this runs only on mount

  useEffect(() => {
    if (currentStep === TOTAL_PLANNER_STEPS && Object.keys(plannerData).length > 0) {
      // Ensure all expected fields are present before trying to save.
      // This is a basic check; individual step data should already be structured correctly.
      const plannerToSave: Partial<PlannerData> = {
        ...plannerData, // Spread the collected form data
        userId: "defaultUser123", // Placeholder userId
        createdAt: new Date().toISOString(),
      };

      // Log the data being saved for debugging
      console.log("Attempting to save planner data:", plannerToSave);

      // Type assertion is used here assuming plannerData has been correctly populated by the steps
      // and matches the structure of PlannerData fields.
      // The isValidPlannerData function within savePlannerData will perform the final validation.
      savePlannerData(plannerToSave as PlannerData);
    }
  }, [currentStep, plannerData]); // Trigger when currentStep or plannerData changes

  // Load saved plans on mount
  useEffect(() => {
    const plans = getAllGrowPlans();
    setGrowPlans(plans);
  }, []);

  // Fetch weather data when location is set
  useEffect(() => {
    if (plannerData?.location) {
      getWeatherData(plannerData.location.lat, plannerData.location.lng)
        .then(setWeatherData)
        .catch(error => {
          console.error('Error fetching weather:', error);
          toast({
            title: "Error",
            description: "Failed to fetch weather data",
            variant: "destructive",
          });
        });
    }
  }, [plannerData?.location]);

  const handlePlannerComplete = () => {
    setPlannerData(mockPlannerData);
    setCurrentStep(2);
  };

  const handleAddToGrowPlan = (plant: PlantRecommendation) => {
    setSavedPlants(prev => [...prev, plant]);
    toast({
      title: "Plant Added",
      description: `Added ${plant.name} to your grow plan`,
    });
  };

  const handleSavePlan = () => {
    if (!plannerData) return;

    const newPlan: Omit<GrowPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      name: planName || `Grow Plan ${new Date().toLocaleDateString()}`,
      description: planDescription,
      plannerData,
      selectedPlants: savedPlants,
      notes: planNotes,
      isPublic
    };

    const savedPlan = saveGrowPlan(newPlan);
    setGrowPlans(prev => [...prev, savedPlan]);
    setSelectedPlan(savedPlan);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Grow plan saved successfully",
    });
  };

  const handleUpdatePlan = () => {
    if (!selectedPlan) return;

    const updatedPlan = updateGrowPlan(selectedPlan.id, {
      name: planName,
      description: planDescription,
      selectedPlants: savedPlants,
      notes: planNotes,
      isPublic
    });

    setGrowPlans(prev => prev.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    ));
    setSelectedPlan(updatedPlan);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Grow plan updated successfully",
    });
  };

  const handleDeletePlan = (id: string) => {
    deleteGrowPlan(id);
    setGrowPlans(prev => prev.filter(plan => plan.id !== id));
    if (selectedPlan?.id === id) {
      setSelectedPlan(null);
    }
    toast({
      title: "Success",
      description: "Grow plan deleted",
    });
  };

  const handleDuplicatePlan = (id: string) => {
    const duplicatedPlan = duplicateGrowPlan(id);
    setGrowPlans(prev => [...prev, duplicatedPlan]);
    toast({
      title: "Success",
      description: "Grow plan duplicated",
    });
  };

  const handleExportPlan = async (plan: GrowPlan) => {
    try {
      const blob = await exportGrowPlanToPDF(plan);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Grow plan exported successfully",
      });
    } catch (error) {
      console.error('Error exporting plan:', error);
      toast({
        title: "Error",
        description: "Failed to export grow plan",
        variant: "destructive",
      });
    }
  };

  const handleSharePlan = (plan: GrowPlan) => {
    if (!plan.shareId) {
      const updatedPlan = updateGrowPlan(plan.id, { isPublic: true });
      setGrowPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      setShareUrl(`${window.location.origin}/share/${updatedPlan.shareId}`);
    } else {
      setShareUrl(`${window.location.origin}/share/${plan.shareId}`);
    }
  };

  const handleVoiceInput = (text: string) => {
    if (currentStep === 1) {
      toast({
        title: "Voice Input",
        description: `Received: ${text}`,
      });
    } else if (isEditing) {
      setPlanNotes(prev => prev + ' ' + text);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Personalized Grow Planner</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Answer a few questions to get personalized plant recommendations based on your growing conditions and preferences.
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={handlePlannerComplete}>
                Get Recommendations
              </Button>
              <VoiceInput onTranscript={handleVoiceInput} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <Tabs defaultValue="recommendations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="recommendations">Plant Recommendations</TabsTrigger>
                <TabsTrigger value="grow-plan">My Grow Plan</TabsTrigger>
                <TabsTrigger value="saved-plans">Saved Plans</TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations">
                {weatherData && (
                  <Card className="p-4 mb-4">
                    <h3 className="font-semibold mb-2">Current Weather</h3>
                    <p>Temperature: {weatherData.temperature}°C</p>
                    <p>Conditions: {weatherData.conditions}</p>
                    <p className="mt-2 text-sm text-blue-600">{weatherData.plantingAdvice}</p>
                  </Card>
                )}
                <PlantRecommendations
                  plannerData={plannerData}
                  onAddToGrowPlan={handleAddToGrowPlan}
                />
              </TabsContent>

              <TabsContent value="grow-plan">
                <MyGrowPlan savedPlants={savedPlants} />
                {savedPlants.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <Input
                      placeholder="Plan Name"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                    />
                    <Textarea
                      placeholder="Plan Description"
                      value={planDescription}
                      onChange={(e) => setPlanDescription(e.target.value)}
                    />
                    <Textarea
                      placeholder="Notes"
                      value={planNotes}
                      onChange={(e) => setPlanNotes(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <label htmlFor="isPublic">Make this plan public</label>
                    </div>
                    <Button onClick={handleSavePlan}>Save Plan</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved-plans">
                <div className="space-y-4">
                  {growPlans.map(plan => (
                    <Card key={plan.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(plan.createdAt).toLocaleDateString()}
                          </p>
                          <p className="mt-2">{plan.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleExportPlan(plan)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSharePlan(plan)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDuplicatePlan(plan.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Start Over
              </Button>
              <Button variant="outline">
                Browse All Plants
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        {renderStep()}
      </Card>
    </motion.div>
  );
};

export default PersonalizedGrowPlanner;
