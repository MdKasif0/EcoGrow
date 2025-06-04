import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Camera, Leaf, Smile, Frown, HeartPulse } from 'lucide-react';
import { PlantJournalService } from '@/lib/services/plantJournalService';
import { PlantJournalEntry } from '@/types/plant-journal';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

// Helper to get mood icon (simplified)
const getMoodIcon = (mood?: string) => {
  switch (mood) {
    case 'excited':
    case 'happy':
    case 'hopeful':
    case 'neutral':
      return <Smile className="h-4 w-4 text-yellow-500" />;
    case 'concerned':
    case 'frustrated':
    case 'sad':
      return <Frown className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

// Helper to get health icon (simplified)
const getHealthIcon = (health?: string) => {
  switch (health) {
    case 'healthy':
    case 'thriving':
      return <HeartPulse className="h-4 w-4 text-green-500" />;
    case 'stressed':
    case 'wilting':
    case 'diseased':
    case 'pest_issue':
      return <HeartPulse className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

export default function PlantGrowthTracker() {
  const [latestEntry, setLatestEntry] = useState<PlantJournalEntry | undefined>(undefined);
  const [journaledPlantsCount, setJournaledPlantsCount] = useState(0);
  const router = useRouter();
  const journalService = PlantJournalService.getInstance();

  // Find the latest entry across all journals and count how many plants have journals
  useEffect(() => {
    const allJournals = Object.values(journalService.journals); // Accessing directly for demo
    setJournaledPlantsCount(allJournals.length);
    let latest: PlantJournalEntry | undefined;
    let latestDate = new Date(0);

    allJournals.forEach(journal => {
      journal.entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate > latestDate) {
          latestDate = entryDate;
          latest = entry;
        }
      });
    });

    setLatestEntry(latest);
  }, []); // Empty dependency array means this runs once on mount

  const handleTrackProgress = () => {
    if (journaledPlantsCount === 1 && latestEntry) {
      // Only one plant with a journal, navigate directly to its page
      router.push(`/journal/${latestEntry.plant_id}`);
    } else {
      // Multiple plants or no entries, navigate to the general journal overview page
      router.push('/journal');
    }
  };

  // Find a plant name (Placeholder - ideally link to actual plant data)
  const plantName = latestEntry?.plant_name || 'Your Plant';

  return (
    <Card className="rounded-2xl h-full flex flex-col group hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-br from-primary/10 via-transparent to-transparent">
      <CardHeader className="flex flex-row items-center gap-3">
        <Camera size={28} className="text-primary group-hover:animate-sprout origin-bottom transition-transform duration-300" />
        <CardTitle className="font-serif">Plant Journal</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {latestEntry ? (
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Latest Entry{journaledPlantsCount > 1 ? ` for ${plantName}` : ``}:</p>
            <p className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                    {latestEntry.note || 'No note provided.'}
                </span>
            </p>
            <p className="flex items-center gap-2">
                 <span className="flex-shrink-0">{getHealthIcon(latestEntry.health_status)}</span>
                 <span className="flex-shrink-0">{getMoodIcon(latestEntry.mood)}</span>
                 <span>Logged {formatDistanceToNow(new Date(latestEntry.date))} ago</span>
            </p>
             {latestEntry.photos && latestEntry.photos.length > 0 && (
                <div className="flex gap-2 mt-2">
                    {latestEntry.photos.slice(0, 2).map(photo => (
                        // Use next/image here with proper configuration
                        <img 
                            key={photo.id} 
                            src={photo.url} 
                            alt={photo.alt || 'Plant photo'} 
                            className="w-16 h-16 object-cover rounded-md shadow"
                        />
                    ))}
                     {latestEntry.photos.length > 2 && (
                         <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md text-xs text-muted-foreground">
                             +{latestEntry.photos.length - 2} more
                         </div>
                     )}
                </div>
             )}
          </div>
        ) : (
        <p className="text-sm text-muted-foreground">
          Log photos, notes, and health conditions for your plants. Visualize progress in a timeline or gallery format.
        </p>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleTrackProgress}>
          Track Progress
        </Button>
      </CardFooter>
    </Card>
  );
}
