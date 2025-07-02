'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Camera, MessageSquare, StickyNote } from 'lucide-react';
import { StepByStepGrowingGuide } from './StepByStepGrowingGuide';
import { PlantRecommendation } from '@/lib/ai/plantRecommender';

export function StepByStepGuides() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantRecommendation | null>(null);

  const handlePlantSelect = (plant: PlantRecommendation) => {
    setSelectedPlant(plant);
    setIsExpanded(true);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Step-by-Step Growing Guides</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>

        <p className="text-muted-foreground">
          Explore detailed, stage-by-stage growing guides for your plants. Select a plant below to access interactive features like photo documentation, progress tracking, notes, and an AI assistant.
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pt-4">
                {!selectedPlant ? (
                  // Display features and select plant message when no plant is selected
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Features</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Detailed stage-by-stage instructions
                          </li>
                          <li className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-primary" />
                            Photo documentation
                          </li>
                          <li className="flex items-center gap-2">
                            <StickyNote className="h-4 w-4 text-primary" />
                            Progress tracking and notes
                          </li>
                          <li className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            AI-powered growing assistant
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Available Plants</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {['Basil', 'Tomato', 'Lettuce', 'Bell Pepper'].map((plant) => (
                            <Button
                              key={plant}
                              variant="outline"
                              size="sm"
                              onClick={() => handlePlantSelect({
                                id: plant.toLowerCase().replace(' ', '_'),
                                name: plant
                              })}
                              className="justify-start"
                            >
                              {plant}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Card className="p-6 text-center text-muted-foreground">
                       Select a plant from your grow planner to view its growing guide.
                    </Card>
                  </>
                ) : (
                  // Render the full guide when a plant is selected
                  <StepByStepGrowingGuide
                    selectedPlant={selectedPlant}
                    onPlantSelect={handlePlantSelect}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
