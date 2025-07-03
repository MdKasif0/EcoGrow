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
import { useToast } from '@/components/ui/use-toast';
import { Download, Share2, Copy, Trash2, Edit2, Navigation, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import type { PlantRecommendation } from '@/lib/ai/plantRecommender';
import type { GrowPlan } from '@/lib/services/growPlanService';
import type { WeatherData } from '@/lib/services/weatherService';
import { getWeatherData } from '@/lib/services/weatherService';
import { saveGrowPlan, updateGrowPlan, deleteGrowPlan, duplicateGrowPlan, getAllGrowPlans, exportGrowPlanToPDF } from '@/lib/services/growPlanService';
import VoiceInput from '../ui/VoiceInput';
import { MapPin, Sun, Droplets, Ruler } from 'lucide-react';
import { ToastDescription, ToastTitle } from '@/components/ui/toast';
import { getPlantRecommendations } from '@/lib/ai/plantRecommender';
import useLocation from '@/hooks/use-location';

const TOTAL_PLANNER_STEPS = 4; // Location, Growing Space, Preferences, Maintenance

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

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

interface StepField {
  name: string;
  label: string;
  type: string;
  options?: string[];
}

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  fields: StepField[];
}

const steps: Step[] = [
  {
    id: 'location',
    title: 'Your Location',
    description: 'Help us understand your climate and growing conditions',
    icon: MapPin,
    fields: [
      { name: 'zipCode', label: 'ZIP Code', type: 'text' },
      { name: 'climateZone', label: 'Climate Zone', type: 'select', options: ['Tropical', 'Subtropical', 'Mediterranean', 'Temperate', 'Continental', 'Polar'] }
    ]
  },
  {
    id: 'space',
    title: 'Growing Space',
    description: 'Tell us about your available growing area',
    icon: Ruler,
    fields: [
      { name: 'spaceType', label: 'Space Type', type: 'select', options: ['Indoor', 'Outdoor', 'Greenhouse', 'Balcony', 'Small Yard', 'Large Garden'] },
      { name: 'spaceSize', label: 'Space Size (sq ft)', type: 'number' }
    ]
  },
  {
    id: 'preferences',
    title: 'Growing Preferences',
    description: 'What are you interested in growing?',
    icon: Sun,
    fields: [
      { name: 'plantTypes', label: 'Plant Types', type: 'multiselect', options: ['Vegetables', 'Herbs', 'Flowers', 'Fruits', 'Succulents'] },
      { name: 'experience', label: 'Experience Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] }
    ]
  },
  {
    id: 'maintenance',
    title: 'Maintenance Preferences',
    description: 'How much time can you dedicate to plant care?',
    icon: Droplets,
    fields: [
      { name: 'timeCommitment', label: 'Time Commitment', type: 'select', options: ['Low (1-2 hours/week)', 'Medium (3-5 hours/week)', 'High (5+ hours/week)'] },
      { name: 'wateringFrequency', label: 'Preferred Watering Frequency', type: 'select', options: ['Daily', 'Every 2-3 days', 'Weekly', 'As needed'] }
    ]
  }
];

interface FormData {
  location: {
    zipCode: string;
    climateZone: string;
    latitude: number | null;
    longitude: number | null;
  };
  growingSpace: {
    type: 'garden' | 'indoor' | 'balcony';
    size: string;
    sunlight: 'full' | 'partial' | 'shade';
  };
  preferences: {
    experience: 'beginner' | 'intermediate' | 'expert';
    goals: 'food' | 'ornamental' | 'medicinal' | 'mixed';
    plantTypes: string[];
  };
  maintenance: {
    timeCommitment: 'low' | 'moderate' | 'high';
    automation: string;
  };
}

const mockPlannerData: PlannerData = {
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    climateZone: "7a",
    address: "New York, NY",
    zipCode: "10001"
  },
  space: "garden",
  spaceSize: "100",
  sunlight: "full",
  experience: "beginner",
  timeCommitment: "moderate",
  purpose: "food",
  plantTypes: [],
  automation: "manual",
  userId: "defaultUser123",
  createdAt: new Date().toISOString()
};

interface PersonalizedGrowPlannerProps {
  onPlantSelect: (plant: PlantRecommendation) => void;
  onComplete: () => void;
}

const PersonalizedGrowPlanner: React.FC<PersonalizedGrowPlannerProps> = ({ onPlantSelect, onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    location: {
      zipCode: '',
      climateZone: '',
      latitude: null,
      longitude: null,
    },
    growingSpace: {
      type: 'garden',
      size: '',
      sunlight: 'full'
    },
    preferences: {
      experience: 'beginner',
      goals: 'food',
      plantTypes: []
    },
    maintenance: {
      timeCommitment: 'moderate',
      automation: ''
    }
  });
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
  const { location, loading: isLocating, error: locationError, getLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

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
      setPlannerData(loadedData);
      setFormData({
        location: {
          zipCode: loadedData.location?.zipCode || '',
          climateZone: loadedData.location?.climateZone || '',
          latitude: loadedData.location?.latitude || null,
          longitude: loadedData.location?.longitude || null,
        },
        growingSpace: {
          type: loadedData.space || 'garden',
          size: loadedData.spaceSize || '',
          sunlight: loadedData.sunlight || 'full',
        },
        preferences: {
          experience: loadedData.experience || 'beginner',
          goals: loadedData.purpose || 'food',
          plantTypes: loadedData.plantTypes || [],
        },
        maintenance: {
          timeCommitment: loadedData.timeCommitment || 'moderate',
          automation: loadedData.automation || '',
        },
      });
    }
    loadGrowPlans();
  }, []);

  const handleInputChange = (path: string, value: any) => {
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData };
      const keys = path.split('.');
      let current: any = newFormData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      // Special handling for plantTypes to ensure it's an array
      if (path === 'preferences.plantTypes' && !Array.isArray(value)) {
        current[keys[keys.length - 1]] = [value];
      } else if (path === 'preferences.plantTypes' && Array.isArray(value)) {
        current[keys[keys.length - 1]] = value;
      }

      return newFormData;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 0) {
        if (!formData.location.zipCode || !formData.location.climateZone) {
          toast({
            title: "Missing Information",
            description: "Please provide both ZIP Code and Climate Zone.",
            variant: "destructive",
          });
          return;
        }
      } else if (currentStep === 1) {
        if (!formData.growingSpace.type || !formData.growingSpace.size || !formData.growingSpace.sunlight) {
          toast({
            title: "Missing Information",
            description: "Please provide all growing space details.",
            variant: "destructive",
          });
          return;
        }
      } else if (currentStep === 2) {
        if (!formData.preferences.experience || formData.preferences.plantTypes.length === 0 || !formData.preferences.goals) {
          toast({
            title: "Missing Information",
            description: "Please provide your experience level, preferred plant types, and gardening goals.",
            variant: "destructive",
          });
          return;
        }
      } else if (currentStep === 3) {
        if (!formData.maintenance.timeCommitment || !formData.maintenance.automation) {
          toast({
            title: "Missing Information",
            description: "Please provide your maintenance preferences.",
            variant: "destructive",
          });
          return;
        }
      }
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === steps.length - 1) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLocationSubmit = () => {
    if (formData.location.zipCode && formData.location.climateZone) {
      handleNext();
    }
  };

  const renderStep = () => {
    const currentStepData = steps[displayedStep];

    if (currentStepData.id === 'location') {
      return (
        <LocationStep
          onNext={(data) => handleInputChange('location', data)}
          onBack={handleBack}
          data={{ location: formData.location }}
          location={location}
          isLocating={isLocating}
          locationError={locationError}
          onDetectLocation={getLocation}
        />
      );
    } else if (currentStepData.id === 'space') {
      return (
        <GrowingSpaceStep
          onNext={(data) => handleInputChange('growingSpace', data)}
          onBack={handleBack}
          data={formData.growingSpace}
        />
      );
    } else if (currentStepData.id === 'preferences') {
      return (
        <PurposeStep
          onNext={(data) => handleInputChange('preferences', data)}
          onBack={handleBack}
          data={formData.preferences}
        />
      );
    } else if (currentStepData.id === 'maintenance') {
      return (
        <TimeCommitmentStep
          onNext={(data) => handleInputChange('maintenance', data)}
          onBack={handleBack}
          data={formData.maintenance}
        />
      );
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const plannerDataToSave: PlannerData = {
        location: {
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          climateZone: formData.location.climateZone,
          address: location?.address || formData.location.zipCode,
          zipCode: formData.location.zipCode
        },
        space: formData.growingSpace.type,
        spaceSize: formData.growingSpace.size,
        sunlight: formData.growingSpace.sunlight,
        experience: formData.preferences.experience,
        timeCommitment: formData.maintenance.timeCommitment,
        purpose: formData.preferences.goals,
        plantTypes: formData.preferences.plantTypes,
        automation: formData.maintenance.automation,
        userId: 'defaultUser123',
        createdAt: new Date().toISOString(),
      };

      setPlannerData(plannerDataToSave);

      const recommendedPlants = await getPlantRecommendations(plannerDataToSave);

      if (recommendedPlants.length > 0) {
        onPlantSelect(recommendedPlants[0]);
      }

      onComplete();
      toast({
        title: "Onboarding Complete!",
        description: "Your personalized grow plan is ready.",
      });
    } catch (error) {
      console.error("Error during onboarding submission:", error);
      toast({
        title: "Error",
        description: "Failed to create your grow plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGrowPlan = async () => {
    if (plannerData) {
      try {
        setIsLoading(true);
        const newGrowPlan: Omit<GrowPlan, 'id' | 'createdAt' | 'updatedAt'> = {
          name: planName || 'New Grow Plan',
          description: planDescription || 'No description provided.',
          plannerData: plannerData,
          selectedPlants: savedPlants,
          notes: planNotes,
          isPublic: isPublic,
        };

        const savedPlan = saveGrowPlan(newGrowPlan);
        setGrowPlans(prev => [...prev, savedPlan]);
        setSelectedPlan(savedPlan);
        setIsEditing(false);
        toast({
          title: "Grow Plan Saved!",
          description: `'${savedPlan.name}' has been successfully saved.`,
        });
      } catch (error) {
        console.error("Error saving grow plan:", error);
        toast({
          title: "Error",
          description: "Failed to save grow plan. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteGrowPlan = async (plan: GrowPlan): Promise<void> => {
    try {
      deleteGrowPlan(plan.id); // Re-affirming plan.id is passed
      toast({
        title: "Grow Plan Deleted",
        description: "The grow plan has been deleted.",
      });
      loadGrowPlans();
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error deleting grow plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete grow plan.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateGrowPlan = async (growPlan: GrowPlan) => {
    try {
      await duplicateGrowPlan(growPlan.id);
      toast({
        title: "Grow Plan Duplicated",
        description: "A duplicate grow plan has been created.",
      });
      loadGrowPlans();
    } catch (error) {
      console.error("Error duplicating grow plan:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate grow plan.",
        variant: "destructive",
      });
    }
  };

  const handleExportGrowPlan = async (growPlan: GrowPlan) => {
    try {
      await exportGrowPlanToPDF(growPlan);
      toast({
        title: "Grow Plan Exported",
        description: "The grow plan has been exported as a PDF.",
      });
    } catch (error) {
      console.error("Error exporting grow plan:", error);
      toast({
        title: "Error",
        description: "Failed to export grow plan.",
        variant: "destructive",
      });
    }
  };

  const loadGrowPlans = async () => {
    try {
      const plans = await getAllGrowPlans();
      setGrowPlans(plans);
    } catch (error) {
      console.error("Error loading grow plans:", error);
      toast({
        title: "Error",
        description: "Failed to load grow plans.",
        variant: "destructive",
      });
    }
  };

  const handleEditPlan = (plan: GrowPlan) => {
    setSelectedPlan(plan);
    setPlanDescription(plan.description || '');
    setPlanNotes(plan.notes || '');
    setIsPublic(plan.isPublic || false);
    setPlannerData(plan.plannerData);
    setSavedPlants(plan.selectedPlants || []);
    setIsEditing(true);
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    setPlanName('');
    setPlanDescription('');
    setPlanNotes('');
    setIsPublic(false);
    clearPlannerData();
    setPlannerData(null);
    setSavedPlants([]);
    setIsEditing(false);
    setCurrentStep(0);
  };

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex-1 w-full ${animationClass}`}
    >
      <Card className="p-6">
        {renderStep()}
      </Card>

      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <Button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button
            onClick={handleNext}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Generate My Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {plannerData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-bold text-green-800 mb-4">My Personalized Grow Plan</h2>
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="my-plan">My Plan</TabsTrigger>
            </TabsList>
            <TabsContent value="recommendations" className="mt-4">
              <PlantRecommendations
                plannerData={plannerData}
                onAddToGrowPlan={onPlantSelect}
              />
            </TabsContent>
            <TabsContent value="my-plan" className="mt-4">
              <MyGrowPlan
                savedPlants={savedPlants}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                onSavePlan={handleSaveGrowPlan}
                onDeletePlan={handleDeleteGrowPlan}
                onDuplicatePlan={handleDuplicateGrowPlan}
                onExportPlan={handleExportGrowPlan}
                onEditPlan={handleEditPlan}
                onNewPlan={handleNewPlan}
                planName={planName}
                setPlanName={setPlanName}
                planDescription={planDescription}
                setPlanDescription={setPlanDescription}
                planNotes={planNotes}
                setPlanNotes={setPlanNotes}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
                isEditing={isEditing}
                shareUrl={shareUrl}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PersonalizedGrowPlanner;

interface GrowingSpaceStepProps {
  onNext: (data: { type: string; size: string; sunlight: string }) => void;
  onBack: () => void;
  data: { type: string; size: string; sunlight: string };
}

interface PurposeStepProps {
  onNext: (data: { goals: string; plantTypes: string[] }) => void;
  onBack: () => void;
  data: { goals: string; plantTypes: string[] };
}

interface TimeCommitmentStepProps {
  onNext: (data: { timeCommitment: string; automation: string }) => void;
  onBack: () => void;
  data: { timeCommitment: string; automation: string };
}

interface ExperienceLevelStepProps {
  onNext: (data: { experience: string; goals: string; plantTypes: string[] }) => void;
  onBack: () => void;
  data: { experience: string; goals: string; plantTypes: string[] };
}
