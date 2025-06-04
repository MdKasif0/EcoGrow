'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Check, Camera, MessageSquare, StickyNote } from 'lucide-react';
import { PlantRecommendation } from '@/lib/ai/plantRecommender';
import { growingGuideService } from '@/lib/services/growingGuideService';
import { GrowingGuide, PlantProgress } from '@/types/growing-guide';
import { AIGrowingAssistant } from '@/components/growing-guide/AIGrowingAssistant';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface StepByStepGrowingGuideProps {
  selectedPlant?: PlantRecommendation;
  onPlantSelect?: (plant: PlantRecommendation) => void;
}

export function StepByStepGrowingGuide({ selectedPlant, onPlantSelect }: StepByStepGrowingGuideProps) {
  const [guide, setGuide] = useState<GrowingGuide | null>(null);
  const [progress, setProgress] = useState<PlantProgress | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const { toast } = useToast();
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentStageId, setCurrentStageId] = useState('');

  useEffect(() => {
    if (selectedPlant) {
      const guideData = growingGuideService.getGuide(selectedPlant.id);
      if (guideData) {
        setGuide(guideData);
        const progressData = growingGuideService.getProgress(selectedPlant.id);
        setProgress(progressData);
        setExpandedStage(progressData.currentStage);
      }
    }
  }, [selectedPlant]);

  const handleStageComplete = (stageId: string) => {
    if (!progress || !guide) return;

    const updatedProgress = growingGuideService.updateStageProgress(guide.id, stageId, {
      completed: true
    });

    setProgress(updatedProgress);
    toast({
      title: 'Stage Completed!',
      description: 'Great job! Move on to the next stage.',
    });
  };

  const handleAddNote = (stageId: string) => {
    setCurrentStageId(stageId);
    setCurrentNote('');
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;

    const updatedProgress = growingGuideService.addStageNote(selectedPlant, currentStageId, currentNote);
    setProgress(updatedProgress);
    setNoteDialogOpen(false);

    toast({
      title: 'Success',
      description: 'Note added successfully',
    });
  };

  const handlePhotoUpload = async (stageId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('plantId', selectedPlant);
        formData.append('stageId', stageId);

        // Here you would typically send this to your backend
        // For now, we'll create a local URL for the image
        const imageUrl = URL.createObjectURL(file);

        // Update the progress with the new photo
        const updatedProgress = growingGuideService.addStagePhoto(selectedPlant, stageId, imageUrl);
        setProgress(updatedProgress);

        toast({
          title: 'Success',
          description: 'Photo added successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload photo',
          variant: 'destructive',
        });
      }
    };
    input.click();
  };

  if (!selectedPlant || !guide || !progress) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          Select a plant from your grow planner to view its growing guide.
        </p>
      </Card>
    );
  }

  const completedStages = Object.values(progress.stages).filter(stage => stage.completed).length;
  const totalStages = guide.stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{guide.plantName} Growing Guide</h2>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {completedStages} of {totalStages} stages completed
          </p>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {guide.stages.map((stage) => {
              const stageProgress = progress.stages[stage.id];
              const isExpanded = expandedStage === stage.id;

              return (
                <Card key={stage.id} className="overflow-hidden">
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {stageProgress.completed ? (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-primary" />
                        )}
                        <h3 className="font-semibold">{stage.title}</h3>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stage.description}
                    </p>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 border-t">
                          <Tabs defaultValue="instructions">
                            <TabsList className="mb-4">
                              <TabsTrigger value="instructions">Instructions</TabsTrigger>
                              <TabsTrigger value="tools">Tools</TabsTrigger>
                              <TabsTrigger value="media">Media</TabsTrigger>
                              <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="instructions" className="space-y-4">
                              <ul className="list-disc list-inside space-y-2">
                                {stage.instructions.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                                ))}
                              </ul>
                              {stage.tips.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Tips</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {stage.tips.map((tip, index) => (
                                      <li key={index}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {stage.warnings.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Warnings</h4>
                                  <ul className="list-disc list-inside space-y-1 text-destructive">
                                    {stage.warnings.map((warning, index) => (
                                      <li key={index}>{warning}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="tools" className="space-y-4">
                              <ul className="list-disc list-inside space-y-2">
                                {stage.toolsNeeded.map((tool, index) => (
                                  <li key={index}>{tool}</li>
                                ))}
                              </ul>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                {stage.media.map((item, index) => (
                                  <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                                    {item.type === 'image' ? (
                                      <img
                                        src={item.url}
                                        alt={item.alt}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <video
                                        src={item.url}
                                        controls
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePhotoUpload(stage.id)}
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Add Photo
                                </Button>
                              </div>
                            </TabsContent>

                            <TabsContent value="notes" className="space-y-4">
                              <div className="space-y-2">
                                {stageProgress.notes.map((note) => (
                                  <div key={note.id} className="p-2 bg-muted rounded-lg">
                                    <p className="text-sm">{note.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(note.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddNote(stage.id)}
                              >
                                <StickyNote className="h-4 w-4 mr-2" />
                                Add Note
                              </Button>
                            </TabsContent>
                          </Tabs>

                          <div className="flex justify-between mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAI(true)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Ask AI Assistant
                            </Button>
                            {!stageProgress.completed && (
                              <Button
                                size="sm"
                                onClick={() => handleStageComplete(stage.id)}
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
              );
            })}
          </div>
        </ScrollArea>

        {showAI && (
          <AIGrowingAssistant
            plantName={guide.plantName}
            currentStage={expandedStage || guide.stages[0].id}
          />
        )}

        {/* Note Input Dialog */}
        <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your note here..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setNoteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNote}
                  disabled={!currentNote.trim()}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
} 