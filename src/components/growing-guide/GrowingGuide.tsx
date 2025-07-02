'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown, CheckCircle2, AlertCircle, Lightbulb, Info, AlertTriangle } from 'lucide-react';
import { GrowingGuide as GrowingGuideType, GrowthStage } from '@/types/plant-journal'; // Corrected import
import { useToast } from '@/hooks/use-toast'; // Corrected import
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AIGrowingAssistant } from './AIGrowingAssistant';

interface GrowingGuideProps {
  guide: GrowingGuideType;
  progress?: {
    currentStage: number;
    stages: { completed: boolean }[];
  };
  onStageComplete?: (stageIndex: number) => void;
  onAddNote?: (stageIndex: number, note: string) => void;
  onAddPhoto?: (stageIndex: number, photo: File) => void;
}

export const GrowingGuide: React.FC<GrowingGuideProps> = ({
  guide,
  progress,
  onStageComplete,
  onAddNote,
  onAddPhoto,
}) => {
  const [expandedStage, setExpandedStage] = useState<number | null>(0);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedStage, setSelectedStage] = useState<GrowingStage | null>(null);
  const { toast } = useToast();

  const calculateProgress = () => {
    if (!progress) return 0;
    const completed = progress.stages.filter(stage => stage.completed).length;
    return (completed / guide.stages.length) * 100; // Changed from guide.growing_guide
  };

  const handleStageComplete = (stageIndex: number) => {
    onStageComplete?.(stageIndex);
    toast({
      title: "Stage Completed!",
      description: `Great job completing the ${guide.stages[stageIndex].name} stage!`, // Changed from guide.growing_guide[stageIndex].stage to guide.stages[stageIndex].name
    });
  };

  const handleAskAI = (stage: GrowthStage) => { // Changed type from GrowingStage to GrowthStage
    setSelectedStage(stage);
    setShowAIChat(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{guide.plant_name} Growing Guide</h2>
        <Progress value={calculateProgress()} className="w-1/3" />
      </div>

      <div className="space-y-4">
        {guide.stages.map((stage, index) => ( // Changed from guide.growing_guide
          <Card key={stage.id} className="overflow-hidden">
            <button
              className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              onClick={() => setExpandedStage(expandedStage === index ? null : index)}
            >
              <div className="flex items-center gap-4">
                {progress?.stages[index]?.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-primary" />
                )}
                <div className="text-left">
                  <h3 className="font-semibold">{stage.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {stage.duration_days ? `${stage.duration_days} days` : (stage.timing || 'Variable duration')}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedStage === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {expandedStage === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {/* Instructions */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Instructions</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {(stage.instructions || []).map((instruction, i) => (
                          <li key={i} className="text-sm">{instruction}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Tools Needed */}
                    {stage.toolsNeeded && stage.toolsNeeded.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Tools Needed</h4>
                        <div className="flex flex-wrap gap-2">
                          {stage.toolsNeeded.map((tool, i) => (
                            <Badge key={i} variant="secondary">{tool}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tips & Warnings */}
                    {(stage.tips || stage.warnings || stage.trivia) && (
                      <div className="space-y-2">
                        {stage.tips?.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="h-4 w-4 text-yellow-500 mt-1" />
                            <span>{tip}</span>
                          </div>
                        ))}
                        {stage.warnings?.map((warning, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-red-500">
                            <AlertTriangle className="h-4 w-4 mt-1" />
                            <span>{warning}</span>
                          </div>
                        ))}
                        {stage.trivia?.map((triviaItem, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-blue-500">
                            <Info className="h-4 w-4 mt-1" />
                            <span>{triviaItem}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Media */}
                    {stage.media && stage.media.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Visual Guide</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {stage.media.map((mediaItem, i) => (
                              <div key={i} className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                                {mediaItem.type === 'image' ? (
                                  <Image
                                    src={mediaItem.url}
                                    alt={mediaItem.alt || `${stage.name} media ${i + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                ) : (
                                  <video
                                    src={mediaItem.url}
                                    controls
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleAskAI(stage)}
                      >
                        Ask AI
                      </Button>
                      {!progress?.stages[index]?.completed && (
                        <Button
                          onClick={() => handleStageComplete(index)}
                        >
                          Mark as Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {showAIChat && selectedStage && guide && ( // Added guide null check
          <AIGrowingAssistant
            plantName={guide.plant_name} // Use plant_name from the correct guide type
            currentStage={selectedStage.id} // Pass currentStage id
            // stage={selectedStage} // Prop 'stage' does not exist on AIGrowingAssistant
            // onClose={() => setShowAIChat(false)} // Prop 'onClose' does not exist
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 