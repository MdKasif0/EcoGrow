'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, AlertCircle, Lightbulb, Info } from 'lucide-react';
import { GrowingGuide as GrowingGuideType, GrowingStage } from '@/types/growing-guide';
import { useToast } from '@/components/ui/use-toast';
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
    return (completed / guide.growing_guide.length) * 100;
  };

  const handleStageComplete = (stageIndex: number) => {
    onStageComplete?.(stageIndex);
    toast({
      title: "Stage Completed!",
      description: `Great job completing the ${guide.growing_guide[stageIndex].stage} stage!`,
    });
  };

  const handleAskAI = (stage: GrowingStage) => {
    setSelectedStage(stage);
    setShowAIChat(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{guide.common_name} Growing Guide</h2>
        <Progress value={calculateProgress()} className="w-1/3" />
      </div>

      <div className="space-y-4">
        {guide.growing_guide.map((stage, index) => (
          <Card key={index} className="overflow-hidden">
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
                  <h3 className="font-semibold">{stage.stage}</h3>
                  <p className="text-sm text-muted-foreground">
                    {stage.duration_days} days
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
                        {stage.instructions.map((instruction, i) => (
                          <li key={i} className="text-sm">{instruction}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Tools Needed */}
                    {stage.tools_needed && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Tools Needed</h4>
                        <div className="flex flex-wrap gap-2">
                          {stage.tools_needed.map((tool, i) => (
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
                            <AlertCircle className="h-4 w-4 mt-1" />
                            <span>{warning}</span>
                          </div>
                        ))}
                        {stage.trivia?.map((trivia, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-blue-500">
                            <Info className="h-4 w-4 mt-1" />
                            <span>{trivia}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Media */}
                    {stage.media && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Visual Guide</h4>
                        {stage.media.images && (
                          <div className="grid grid-cols-2 gap-2">
                            {stage.media.images.map((image, i) => (
                              <img
                                key={i}
                                src={image}
                                alt={`${stage.stage} step ${i + 1}`}
                                className="rounded-lg object-cover h-32 w-full"
                              />
                            ))}
                          </div>
                        )}
                        {stage.media.video && (
                          <video
                            src={stage.media.video}
                            controls
                            className="w-full rounded-lg"
                          />
                        )}
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
        {showAIChat && selectedStage && (
          <AIGrowingAssistant
            stage={selectedStage}
            plantName={guide.common_name}
            onClose={() => setShowAIChat(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 