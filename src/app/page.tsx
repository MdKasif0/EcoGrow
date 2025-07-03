'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import MyPlantsOverview from '@/components/homefeatures/MyPlantsOverview';
import PersonalizedGrowPlanner from '@/components/homefeatures/PersonalizedGrowPlanner';
import PlantGrowthTracker from '@/components/homefeatures/PlantGrowthTracker';
import PlantHealthScanner from '@/components/homefeatures/PlantHealthScanner';
import SmartCalendarReminders from '@/components/homefeatures/SmartCalendarReminders';
import QuickActions from '@/components/home/QuickActions';
import InfoBanner from '@/components/home/InfoBanner';
import { Lightbulb } from 'lucide-react';
import { StepByStepGuides } from '@/components/homefeatures/StepByStepGuides';
import SeedToHarvestTimeline from '@/components/homefeatures/SeedToHarvestTimeline';
import CommunityFeatures from '@/components/homefeatures/CommunityFeatures';
import LearnSection from '@/components/homefeatures/LearnSection';
import { PlantRecommendation } from '@/lib/ai/plantRecommender';

// Import the new AI feature components
import SmartPlantRecommender from '@/components/homefeatures/SmartPlantRecommender';
import DiseasePrediction from '@/components/homefeatures/DiseasePrediction';
import AITips from '@/components/homefeatures/AITips';
import AIGardenDesignAssistantTeaser from '@/components/homefeatures/AIGardenDesignAssistantTeaser';

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
  const [selectedPlant, setSelectedPlant] = React.useState<PlantRecommendation | undefined>();

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Welcome to EcoGrow!</h1>
          <p className="text-muted-foreground">Your AI-powered gardening companion</p>
        </div>
      </header>

      <main className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <InfoBanner
            icon={Lightbulb}
            title="Tip of the Day"
            description="Remember to check the soil moisture before watering your plants. Overwatering can be as harmful as underwatering!"
            className="mb-6"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <QuickActions />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}><MyPlantsOverview /></motion.div>
          <motion.div variants={itemVariants}><PersonalizedGrowPlanner onPlantSelect={setSelectedPlant} /></motion.div>
          <motion.div variants={itemVariants}><PlantGrowthTracker /></motion.div>
          <motion.div variants={itemVariants}><PlantHealthScanner /></motion.div>
          <motion.div variants={itemVariants}><SmartCalendarReminders /></motion.div>
          <motion.div variants={itemVariants}><StepByStepGuides /></motion.div>
          <motion.div variants={itemVariants}><SeedToHarvestTimeline /></motion.div>
          <motion.div variants={itemVariants}><CommunityFeatures /></motion.div>
          <motion.div variants={itemVariants}><LearnSection /></motion.div>
          <motion.div variants={itemVariants}><SmartPlantRecommender /></motion.div>
          <motion.div variants={itemVariants}><DiseasePrediction /></motion.div>
          <motion.div variants={itemVariants}><AITips /></motion.div>
          <motion.div variants={itemVariants}><AIGardenDesignAssistantTeaser /></motion.div>
        </motion.div>
      </main>

      <footer className="w-full max-w-4xl mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EcoGrow. Grow smarter.</p>
      </footer>
    </div>
  );
}
