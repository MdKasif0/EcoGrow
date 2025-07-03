'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lightbulb, Search, Calendar, Camera, Users, BookOpen } from 'lucide-react';
import MyPlantsOverview from '@/components/homefeatures/MyPlantsOverview';
import PersonalizedGrowPlanner from '@/components/homefeatures/PersonalizedGrowPlanner';
import PlantGrowthTracker from '@/components/homefeatures/PlantGrowthTracker';
import PlantHealthScanner from '@/components/homefeatures/PlantHealthScanner';
import SmartCalendarReminders from '@/components/homefeatures/SmartCalendarReminders';
import QuickActions from '@/components/home/QuickActions';
import InfoBanner from '@/components/home/InfoBanner';
import { StepByStepGuides } from '@/components/homefeatures/StepByStepGuides';
import SeedToHarvestTimeline from '@/components/homefeatures/SeedToHarvestTimeline';
import CommunityFeatures from '@/components/homefeatures/CommunityFeatures';
import LearnSection from '@/components/homefeatures/LearnSection';
import SmartPlantRecommender from '@/components/homefeatures/SmartPlantRecommender';
import DiseasePrediction from '@/components/homefeatures/DiseasePrediction';
import AITips from '@/components/homefeatures/AITips';
import AIGardenDesignAssistantTeaser from '@/components/homefeatures/AIGardenDesignAssistantTeaser';
import UniversalSearch from '@/components/search/UniversalSearch';
import PlantOverview from '@/components/plant/PlantOverview';
import { PlantRecommendation } from '@/lib/ai/plantRecommender';
import PlantJournalOverview from '@/components/homefeatures/PlantJournalOverview';
import PlantScannerButton from '@/components/home/PlantScannerButton';
import WeatherDisplay from '@/components/homefeatures/WeatherDisplay';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HomePage() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantRecommendation | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('hasCompletedOnboarding');
    setHasCompletedOnboarding(onboardingStatus === 'true');
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setHasCompletedOnboarding(true);
  };

  const handlePlantSelect = (plant: PlantRecommendation) => {
    setSelectedPlant(plant);
  };

  const handleBack = () => {
    setSelectedPlant(null);
  };

  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              Welcome to EcoGrow
            </h1>
            <p className="text-lg text-gray-600">
              Let's create your personalized growing plan
            </p>
          </motion.div>
          <PersonalizedGrowPlanner
            onPlantSelect={handlePlantSelect}
            onComplete={handleOnboardingComplete}
          />
        </div>
      </div>
    );
  }

  if (selectedPlant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <PlantOverview plant={selectedPlant} onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Your Plant Growing Journey
          </h1>
          <p className="text-lg text-gray-600">
            Search for any plant or get personalized recommendations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <UniversalSearch onPlantSelect={handlePlantSelect} />
        </motion.div>

        {/* Quick Actions / Featured sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <MyPlantsOverview />

          <SmartCalendarReminders />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              Plant Health Scanner
            </h2>
            <p className="text-gray-600">
              Use your camera to analyze plant health and get instant recommendations.
            </p>
            <PlantScannerButton />
          </div>

          <PlantJournalOverview />

          <WeatherDisplay />

          <CommunityFeatures />

          <AITips />

          <AIGardenDesignAssistantTeaser />

          <QuickActions />
        </motion.div>
      </div>
    </div>
  );
}
