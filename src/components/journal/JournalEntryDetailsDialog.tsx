import React from 'react';
import Image from 'next/image';
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
          {entry.note && <div><span className="font-semibold">Notes:</span> {entry.note}</div>}
          {/* Add more fields from PlantJournalEntry as needed */}
          {/* e.g., photos, weather, growthStage, etc. */}
          {entry.growth_stage_name && <div><span className="font-semibold">Growth Stage:</span> {entry.growth_stage_name}</div>}
          {entry.weather_info && (
            <div>
              <span className="font-semibold">Weather:</span> {entry.weather_info?.condition} ({entry.weather_info?.temperature}°)
            </div>
          )}
          {entry.photos && entry.photos.length > 0 && (
            <div>
              <span className="font-semibold">Photos:</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {entry.photos.map((photoUrl, index) => (
                  <div key={index} className="relative w-full aspect-square rounded-md overflow-hidden"> {/* Added aspect-square for demo */}
                    <Image key={index} src={photoUrl} alt={`Plant photo ${index + 1}`} layout="fill" objectFit="cover" />
                  </div>
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