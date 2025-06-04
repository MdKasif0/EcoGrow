import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlantJournalEntry } from '@/types/plant-journal';
import { format } from 'date-fns';

interface JournalEntryDetailsDialogProps {
  entry: PlantJournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JournalEntryDetailsDialog({ entry, isOpen, onClose }: JournalEntryDetailsDialogProps) {
  if (!entry) {
    return null; // Don't render if no entry is selected
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Journal Entry Details</DialogTitle>
          <DialogDescription>
            Details for the entry on {format(new Date(entry.date), 'PPP p')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <div><span className="font-semibold">Date:</span> {format(new Date(entry.date), 'PPP p')}</div>
          {entry.notes && <div><span className="font-semibold">Notes:</span> {entry.notes}</div>}
          {/* Add more fields from PlantJournalEntry as needed */}
          {/* e.g., photos, weather, growthStage, etc. */}
          {entry.growthStage && <div><span className="font-semibold">Growth Stage:</span> {entry.growthStage.name}</div>}
          {entry.weather && (
            <div>
              <span className="font-semibold">Weather:</span> {entry.weather.conditions} ({entry.weather.temperature}°{entry.weather.unit})
            </div>
          )}
          {entry.photos && entry.photos.length > 0 && (
            <div>
              <span className="font-semibold">Photos:</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {entry.photos.map((photoUrl, index) => (
                  // Using a simple img tag. For production, consider Next.js Image component and optimization.
                  <img key={index} src={photoUrl} alt={`Plant photo ${index + 1}`} className="w-full h-auto object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
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