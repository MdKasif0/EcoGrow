import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { GrowTask } from '@/types/calendar';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have a Checkbox component

interface TaskDetailsDialogProps {
  task: GrowTask | null;
  isOpen: boolean;
  onClose: () => void;
  // Optional: Add an onToggleComplete handler if needed later
  // onToggleComplete?: (taskId: string, completed: boolean) => void;
}

export function TaskDetailsDialog({ task, isOpen, onClose }: TaskDetailsDialogProps) {
  if (!task) {
    return null; // Don't render if no task is selected
  }

  // Determine the date to display (dueDate, completedAt, or createdAt)
  const displayDate = task.date ? new Date(task.date) : (task.completedAt ? new Date(task.completedAt) : undefined); // Using task.date based on the type definition
  const formattedDate = displayDate ? format(displayDate, 'PPP p') : 'N/A';

  const isCompleted = !!task.completedAt;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task.taskType.replace('_', ' ').replace(/b\w/g, l => l.toUpperCase())} Task</DialogTitle> {/* Basic formatting */}
          <DialogDescription>
            Details for the task for {task.plantName}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <div><span className="font-semibold">Plant:</span> {task.plantName}</div>
          <div><span className="font-semibold">Type:</span> {task.taskType.replace('_', ' ').replace(/b\w/g, l => l.toUpperCase())}</div>
          <div><span className="font-semibold">Date:</span> {formattedDate}</div>
          <div><span className="font-semibold">Status:</span> {task.status.charAt(0).toUpperCase() + task.status.slice(1)}</div>
          <div><span className="font-semibold">Importance:</span> {task.importance.charAt(0).toUpperCase() + task.importance.slice(1)}</div>
          {task.notes && <div><span className="font-semibold">Notes:</span> {task.notes}</div>}
          {task.repeat && <div><span className="font-semibold">Repeat:</span> {task.repeat}</div>}
          {task.completedAt && <div><span className="font-semibold">Completed At:</span> {format(new Date(task.completedAt), 'PPP p')}</div>}

          {/* Optional: Add a checkbox to mark as complete/incomplete */}
           {/* <div className="flex items-center space-x-2 mt-4">
               <Checkbox
                   id={`task-completed-${task.id}`}
                   checked={isCompleted}
                   onCheckedChange={(checked) => onToggleComplete?.(task.id, !!checked)}
               />
               <label
                   htmlFor={`task-completed-${task.id}`}
                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
               >
                   Mark as Completed
               </label>
           </div> */}

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 bg-gray-200 rounded-md">Close</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 