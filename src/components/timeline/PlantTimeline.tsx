'use client';

import React, { useEffect, useRef, useState } from 'react';
import { type PlantTimeline, TimelineStage } from '@/types/plant-timeline'; // Import PlantTimeline as a type
import { differenceInDays, format, parseISO, isValid } from 'date-fns'; // Import necessary date-fns functions
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; // Assuming shadcn/ui Dialog for the popup
import { Camera, CheckCircle, NotebookPen, ZoomIn, ZoomOut } from 'lucide-react'; // Import icons for markers and zoom
import { PlantJournal, PlantJournalEntry } from '@/types/plant-journal'; // Import PlantJournal and PlantJournalEntry
import { GrowTask } from '@/types/calendar'; // Import GrowTask
import { JournalEntryDetailsDialog } from '@/components/journal/JournalEntryDetailsDialog'; // Import JournalEntryDetailsDialog
import { TaskDetailsDialog } from '@/components/calendar/TaskDetailsDialog'; // Import TaskDetailsDialog
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface PlantTimelineProps {
  timeline: PlantTimeline;
  journal: PlantJournal | undefined; // Accept journal prop
  tasks: GrowTask[]; // Accept tasks prop
}

export function PlantTimeline({ timeline, journal, tasks }: PlantTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedStage, setSelectedStage] = useState<TimelineStage | null>(null); // State for selected stage
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility

  const [selectedJournalEntry, setSelectedJournalEntry] = useState<PlantJournalEntry | null>(null); // State for selected journal entry
  const [isJournalPopupOpen, setIsJournalPopupOpen] = useState(false); // State to control journal popup visibility

  const [selectedTask, setSelectedTask] = useState<GrowTask | null>(null); // State for selected task
  const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false); // State to control task popup visibility

  // State for zooming and panning
  const [pixelsPerDay, setPixelsPerDay] = useState(20); // Initial zoom level
  const [isPanning, setIsPanning] = useState(false);

  // Function to open the popup with stage data
  const openStagePopup = (stage: TimelineStage) => {
    setSelectedStage(stage);
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const closeStagePopup = () => {
    setSelectedStage(null);
    setIsPopupOpen(false);
  };

  // Function to open the journal entry popup
  const openJournalEntryPopup = (entry: PlantJournalEntry) => {
    setSelectedJournalEntry(entry);
    setIsJournalPopupOpen(true);
  };

  // Function to close the journal entry popup
  const closeJournalPopup = () => {
    setSelectedJournalEntry(null);
    setIsJournalPopupOpen(false);
  };

  // Function to open the task details popup
  const openTaskPopup = (task: GrowTask) => {
    setSelectedTask(task);
    setIsTaskPopupOpen(true);
  };

  // Function to close the task details popup
  const closeTaskPopup = () => {
    setSelectedTask(null);
    setIsTaskPopupOpen(false);
  };

  // Handle zoom in
  const handleZoomIn = () => {
      setPixelsPerDay(prev => Math.min(100, prev + 5)); // Increase pixelsPerDay, max 100
  };

  // Handle zoom out
  const handleZoomOut = () => {
      setPixelsPerDay(prev => Math.max(5, prev - 5)); // Decrease pixelsPerDay, min 5
  };

  // Calculate total duration and render stages, Today marker, and progress
  useEffect(() => {
    const container = timelineRef.current;
    if (!container || !timeline?.stages || timeline.stages.length === 0) {
      return; // Nothing to render if no container or stages
    }

    // Clear previous rendering (if any) and remove old event listeners
    container.innerHTML = '';

    const plantingDate = parseISO(timeline.planting_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of the day

    if (!isValid(plantingDate)) {
         console.error("Invalid planting date for timeline visualization:", timeline.planting_date);
         return;
    }

    const totalDurationDays = timeline.stages.reduce((sum, stage) => sum + (stage.duration_days || 0), 0);

    if (totalDurationDays <= 0) {
        container.innerHTML = '<p class="text-muted-foreground">Timeline has no duration.</p>';
        return;
    }

    const totalWidth = totalDurationDays * pixelsPerDay;

    container.style.width = `${totalWidth}px`;
    container.style.position = 'relative';
    container.style.height = '120px'; // Adjusted height
    container.style.minWidth = '100%';

    let currentPosition = 0;

    let currentStageIndex = -1;
    let accumulatedDays = 0;
    for (let i = 0; i < timeline.stages.length; i++) {
        const stage = timeline.stages[i];
        const stageDuration = stage.duration_days || 0;
        const stageEndDate = addDays(plantingDate, accumulatedDays + stageDuration);

        if (today <= stageEndDate) {
             currentStageIndex = i;
             break;
        }
        accumulatedDays += stageDuration;
    }
     if (currentStageIndex === -1 && timeline.stages.length > 0) {
         currentStageIndex = timeline.stages.length - 1;
     }


    // Render each stage
    timeline.stages.forEach((stage, index) => {
      const stageDuration = stage.duration_days || 0;
      const stageWidth = stageDuration * pixelsPerDay;
      const stageStartDate = parseISO(stage.start_date);
      const stageEndDate = parseISO(stage.end_date);

      const stageElement = document.createElement('div');
      
      let stageClass = 'timeline-stage rounded-md absolute flex items-center justify-center text-xs text-white overflow-hidden shadow-sm cursor-pointer hover:opacity-90 transition-opacity';
      if (index < currentStageIndex) {
           stageClass += ' bg-green-500';
      } else if (index === currentStageIndex) {
           stageClass += ' bg-yellow-500';
      } else {
           stageClass += ' bg-gray-400/50';
      }

      stageElement.className = stageClass;
      stageElement.style.left = `${currentPosition}px`;
      stageElement.style.width = `${stageWidth}px`;
      stageElement.style.height = '80%';
      stageElement.style.top = '10%';
       stageElement.style.border = '1px solid rgba(0,0,0,0.1)';
       stageElement.dataset.stageId = stage.id;

      // Add label
      const label = document.createElement('span');
      label.textContent = `${stage.name} (${stageDuration} days)`;
      label.className = 'p-1 whitespace-nowrap overflow-hidden text-ellipsis';
      stageElement.appendChild(label);

      // Add click listener to open popup
      stageElement.addEventListener('click', () => openStagePopup(stage));

      container.appendChild(stageElement);

      currentPosition += stageWidth;
    });

     // Add Today marker
     const daysSincePlanting = differenceInDays(today, plantingDate);
     const todayPosition = Math.max(0, daysSincePlanting * pixelsPerDay);

     const todayMarker = document.createElement('div');
     todayMarker.className = 'timeline-today-marker absolute top-0 bottom-0 w-0.5 bg-red-500 z-20'; // Narrower, higher z-index
     todayMarker.style.left = `${todayPosition}px`;

      const markerHead = document.createElement('div');
      markerHead.className = 'absolute w-3 h-3 bg-red-500 rounded-full -left-1 top-1/2 transform -translate-y-1/2 z-20'; // Higher z-index
      todayMarker.appendChild(markerHead);

     container.appendChild(todayMarker);

     // Add Journal Entry Markers
     if (journal?.entries) {
           journal.entries.forEach(entry => {
               const entryDate = parseISO(entry.date);
                if (isValid(entryDate)) {
                   const daysSincePlantingForEntry = differenceInDays(entryDate, plantingDate);
                   const entryPosition = Math.max(0, daysSincePlantingForEntry * pixelsPerDay);

                   const entryMarker = document.createElement('div');
                    entryMarker.className = 'timeline-marker absolute top-0 bottom-0 w-4 h-4 flex items-center justify-center rounded-full bg-blue-500 text-white z-10 cursor-pointer'; // Journal marker style
                    entryMarker.style.left = `${entryPosition}px`;
                     entryMarker.style.top = '-8px'; // Position above the timeline band

                    // Add a simple icon or initial
                    const icon = document.createElement('div');
                     // Using Lucide icon directly if possible, otherwise simple text
                     // This might require more complex rendering than direct DOM manipulation for interactive icons
                     // For now, using text or a basic shape
                     icon.textContent = 'J'; // Placeholder text 'J' for Journal
                     // Or using a basic shape div:
                    //  icon.className = 'w-2 h-2 bg-white rounded-full';

                    // Using Lucide icon as a React element is not straightforward with direct DOM manipulation here.
                    // A better approach for icons would be to render markers using React within the main render function.
                    // For this direct DOM approach, we'll stick to simple text or background images if needed.
                    // Let's use text for now and add icons in a later refinement if we switch rendering methods.
                     entryMarker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-pen"><path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12"/><path d="M16 22l3.5-3.5L21 17l2.5-2.5"/><path d="M17.5 15.5L20 18"/><path d="M2 10h20"/></svg>'; // Notebook-pen icon
                     entryMarker.title = `Journal Entry: ${entryDate.toLocaleDateString()}`; // Add tooltip

                   // Add click listener
                   entryMarker.addEventListener('click', () => {
                       openJournalEntryPopup(entry);
                   });

                   container.appendChild(entryMarker);
               }
           });
      }

      // Add Task Markers
       if (tasks) {
            tasks.forEach(task => {
                 const taskDate = parseISO(task.date);
                 if (isValid(taskDate)) {
                    const daysSincePlantingForTask = differenceInDays(taskDate, plantingDate);
                    const taskPosition = Math.max(0, daysSincePlantingForTask * pixelsPerDay);

                    const taskMarker = document.createElement('div');
                    // Use a different style for completed vs. incomplete tasks
                    const isCompleted = !!task.completedAt;
                    const taskMarkerClass = isCompleted 
                        ? 'timeline-marker absolute top-0 bottom-0 w-4 h-4 flex items-center justify-center rounded-full bg-green-600 text-white z-10 cursor-pointer' // Completed task style
                        : 'timeline-marker absolute top-0 bottom-0 w-4 h-4 flex items-center justify-center rounded-full bg-orange-500 text-white z-10 cursor-pointer'; // Incomplete task style
                    
                    taskMarker.className = taskMarkerClass;
                    taskMarker.style.left = `${taskPosition}px`;
                     taskMarker.style.top = 'calc(100% - 8px)'; // Position below the timeline band

                     // Add a simple icon or initial
                    taskMarker.innerHTML = isCompleted
                        ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 22 3-3"/><path d="M22 4 12 14l-3-3"/></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>'; // Camera for task (placeholder, choose better icon)
                    
                    taskMarker.title = `Task: ${task.taskType} (${isCompleted ? 'Completed' : 'Incomplete'}) - ${taskDate.toLocaleDateString()}`; // Add tooltip

                   // Add click listener
                   taskMarker.addEventListener('click', () => {
                       openTaskPopup(task);
                   });

                   container.appendChild(taskMarker);
               }
            });
       }

     // Scroll to today's position (optional, can be refined)
     // container.scrollLeft = todayPosition - container.clientWidth / 2; // Center today marker

  }, [timeline, journal, tasks, pixelsPerDay]); // Re-run effect if timeline, journal, tasks, or zoom level changes

  // Add and clean up event listeners for panning and zooming
  useEffect(() => {
      const container = timelineRef.current;
      if (!container) return;

      let startX = 0;
      let scrollLeft = 0;

      const handleMouseDown = (e: MouseEvent) => {
          startX = e.pageX - container.offsetLeft;
          scrollLeft = container.scrollLeft;
          setIsPanning(true);
          container.style.cursor = 'grabbing';
          container.style.userSelect = 'none';
      };

      const handleMouseLeave = () => {
          setIsPanning(false);
          container.style.cursor = 'grab';
          container.style.removeProperty('user-select');
      };

      const handleMouseUp = () => {
          setIsPanning(false);
          container.style.cursor = 'grab';
          container.style.removeProperty('user-select');
      };

      const handleMouseMove = (e: MouseEvent) => {
          if (!isPanning) return;
          e.preventDefault();
          const x = e.pageX - container.offsetLeft;
          const walk = (x - startX) * 2; // Scroll speed
          container.scrollLeft = scrollLeft - walk;
      };

      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mousemove', handleMouseMove);

      return () => {
          container.removeEventListener('mousedown', handleMouseDown);
          container.removeEventListener('mouseleave', handleMouseLeave);
          container.removeEventListener('mouseup', handleMouseUp);
          container.removeEventListener('mousemove', handleMouseMove);
      };
  }, [pixelsPerDay, isPanning, startX, scrollLeft]); // Re-run effect if these states change

  return (
    <div className="relative w-full overflow-x-auto p-4 bg-card rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{timeline.plant_name} Timeline</h2>
       <p className="text-sm text-muted-foreground mb-4">Planting Date: {timeline.planting_date}</p>
       <p className="text-sm text-muted-foreground mb-6">Projected Harvest: {timeline.projected_harvest_date || 'N/A'}</p>

      {/* This div will be the container for the timeline visualization */}
      <div ref={timelineRef} className="h-48 border rounded-md p-2 text-muted-foreground relative overflow-x-auto">
         {/* Stages, Today marker, Journal/Task markers will be rendered directly into this div */}
      </div>

      {/* Stage Details Popup */}
      {/* Using shadcn/ui Dialog component */} 
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStage?.name}</DialogTitle>
             <DialogDescription>
                 {selectedStage?.description}
             </DialogDescription>
          </DialogHeader>
           <div className="py-4 space-y-4">
               {/* Display stage details here */}
               <p><span className="font-semibold">Duration:</span> {selectedStage?.duration_days} days</p>
               <p><span className="font-semibold">Start Date:</span> {selectedStage?.start_date}</p>
               <p><span className="font-semibold">End Date:</span> {selectedStage?.end_date}</p>
               {/* TODO: Add detailed care guide, journal logs, etc. */}
                {selectedStage?.instructions && selectedStage.instructions.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Instructions:</h4>
                        <ul className="list-disc list-inside">
                            {selectedStage.instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                            ))}
                        </ul>
                    </div>
                )}
               {/* Add more details like tools needed, tips, warnings from the stage data */}
                {selectedStage?.toolsNeeded && selectedStage.toolsNeeded.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Tools Needed:</h4>
                        <ul className="list-disc list-inside">
                            {selectedStage.toolsNeeded.map((tool, i) => (
                                <li key={i}>{tool}</li>
                            ))}
                        </ul>
                    </div>
                )}
                 {selectedStage?.tips && selectedStage.tips.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Tips:</h4>
                        <ul className="list-disc list-inside">
                            {selectedStage.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}
                 {selectedStage?.warnings && selectedStage.warnings.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Warnings:</h4>
                        <ul className="list-disc list-inside text-red-600">
                            {selectedStage.warnings.map((warning, i) => (
                                <li key={i}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* TODO: Display relevant journal entries and tasks for this stage's timeframe */}
                 {/* This would involve filtering journal.entries and tasks based on the selectedStage's start_date and end_date */}
                 {/* For now, just a placeholder */}
                  <div className="mt-4">
                     <h4 className="text-lg font-semibold mb-2">Related Logs & Tasks:</h4>
                     <p className="text-sm text-muted-foreground">Feature to display relevant journal entries and tasks here is coming soon!</p>
                  </div>

           </div>
           {/* TODO: Add options to mark complete/delayed, link to journal/tasks */}
        </DialogContent>
      </Dialog>

      {/* Journal Entry Details Popup */}
       <JournalEntryDetailsDialog
           entry={selectedJournalEntry}
           isOpen={isJournalPopupOpen}
           onClose={closeJournalPopup}
       />

      {/* Task Details Popup */}
       <TaskDetailsDialog
           task={selectedTask}
           isOpen={isTaskPopupOpen}
           onClose={closeTaskPopup}
       />

      {/* TODO: Add other interactive elements */}
    </div>
  );
}

// Helper function (Moved here or imported)
function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Helper function to convert File to Base64 string (Needed if we add photo logs to timeline directly)
// Moved here for now, could be in a utilities file
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};