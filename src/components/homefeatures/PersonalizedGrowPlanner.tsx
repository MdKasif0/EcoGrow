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
  const [currentStep, setCurrentStep] = useState(0);
  const [plannerData, setPlannerData] = useState<Partial<PlannerData>>(getPlannerData() || {});
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

  // useEffect for saving data (now removed as saving is handled in handleNextStep)
  // useEffect(() => {
  //   if (currentStep > 0 && currentStep <= TOTAL_PLANNER_STEPS && plannerData && Object.keys(plannerData).length > 0) {
  // console.log("Intermediate save of planner data:", plannerData);
  // savePlannerData(plannerData as PlannerData); // CAUTION with partial data
  //   }
  // }, [plannerData, currentStep]);

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
  }, [plannerData?.location, toast]);

  const handleNextStep = (stepData: any) => {
    const newPlannerData = { ...plannerData, ...stepData };
    setPlannerData(newPlannerData);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    if (nextStep === TOTAL_PLANNER_STEPS + 1) { // Transitioning to results view after last data step
      // Ensure all required fields for PlannerData are present before casting
      // This is a simplified check; more robust validation might be needed.
      if (newPlannerData.location && newPlannerData.space && newPlannerData.sunlight && newPlannerData.experience && newPlannerData.timeCommitment && newPlannerData.purpose) {
        savePlannerData({
          ...newPlannerData,
          userId: newPlannerData.userId || "defaultUser123", // Ensure userId
          createdAt: newPlannerData.createdAt || new Date().toISOString(), // Ensure createdAt
        } as PlannerData);
      } else {
        console.warn("Attempted to save incomplete planner data at final step.", newPlannerData);
        // Optionally, show a toast message to the user
        toast({
          title: "Incomplete Data",
          description: "Some planner information is missing. Please review previous steps.",
          variant: "destructive",
        });
        setCurrentStep(TOTAL_PLANNER_STEPS); // Stay on the last step
        return;
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1)); // Prevent going below 0
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
    // Animation logic for displayedStep can remain if still desired
    // For simplicity in this instruction, directly use currentStep for switch
    const LAST_DATA_COLLECTION_STEP = TOTAL_PLANNER_STEPS;

    switch (currentStep) {
      case 0: // Intro screen
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">Welcome to Your Personalized Grow Planner!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Answer a few simple questions about your gardening space and preferences,
              and we&apos;ll help you find the perfect plants to grow.
            </p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                onClick={() => {
                  // Optionally clear old data or merge. For now, just proceed.
                  // setPlannerData(getPlannerData() || {}); // Load existing or start fresh
                  setCurrentStep(1);
                }}
              >
                Let&apos;s Get Started!
              </Button>
            </motion.div>
            { (getPlannerData() && Object.keys(getPlannerData() || {}).length > 0) &&
              <Button variant="link" onClick={() => { setPlannerData(getPlannerData() || {}); setCurrentStep(LAST_DATA_COLLECTION_STEP + 1); }}>
                Resume previous session or View Recommendations
              </Button>
            }
          </div>
        );
      case 1:
        return <LocationStep data={plannerData} onNext={handleNextStep} onBack={handlePreviousStep} />;
      case 2:
        return <GrowingSpaceStep data={plannerData} onNext={handleNextStep} onBack={handlePreviousStep} />;
      case 3:
        return <SunlightExposureStep data={plannerData} onNext={handleNextStep} onBack={handlePreviousStep} />;
      case 4:
        return <PurposeStep data={plannerData} onNext={handleNextStep} onBack={handlePreviousStep} />;
      case 5:
        return <TimeCommitmentStep data={plannerData} onNext={handleNextStep} onBack={handlePreviousStep} />;
      case TOTAL_PLANNER_STEPS: // This is step 6, the last data collection step
        return <ExperienceLevelStep data={plannerData} onNext={handleNextStep} onBack={handlePreviousStep} />;
      case TOTAL_PLANNER_STEPS + 1: // This is step 7, the results view
        return (
          <div className="space-y-6">
            <Tabs defaultValue="recommendations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="recommendations">Plant Recommendations</TabsTrigger>
                <TabsTrigger value="grow-plan">My Grow Plan</TabsTrigger>
                <TabsTrigger value="saved-plans">Saved Plans</TabsTrigger>
              </TabsList>
              <TabsContent value="recommendations">
                {/* Weather data display can remain */}
                {weatherData && (
                  <Card className="p-4 mb-4">
                    <h3 className="font-semibold mb-2">Current Weather</h3>
                    <p>Temperature: {weatherData.temperature}°C</p>
                    <p>Conditions: {weatherData.conditions}</p>
                    <p className="mt-2 text-sm text-blue-600">{weatherData.plantingAdvice}</p>
                  </Card>
                )}
                <PlantRecommendations
                  plannerData={plannerData as PlannerData} // Should be complete now
                  onAddToGrowPlan={handleAddToGrowPlan}
                />
              </TabsContent>
              <TabsContent value="grow-plan">
                {/* MyGrowPlan and save plan form can remain */}
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
                {/* Display saved plans logic can remain */}
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
              <Button variant="outline" onClick={() => { clearPlannerData(); setPlannerData({}); setCurrentStep(0); }}>
                Start Over
              </Button>
              {/* Optional: Add other buttons like "Browse All Plants" */}
            </div>
          </div>
        );
      default:
        return <div>Error: Unknown step. <Button onClick={() => setCurrentStep(0)}>Reset</Button></div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        {currentStep > 0 && currentStep <= TOTAL_PLANNER_STEPS && (
          <ProgressBar currentStep={currentStep -1} totalSteps={TOTAL_PLANNER_STEPS} />
        )}
        <div className={animationClass}>
         {renderStep()}
        </div>
      </Card>
    </motion.div>
  );
};

export default PersonalizedGrowPlanner;
