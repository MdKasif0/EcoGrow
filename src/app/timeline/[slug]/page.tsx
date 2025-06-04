'use client'; // This page will use client-side hooks and interactivity

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { PlantJournalService } from '@/lib/services/plantJournalService';
import { PlantTimelineService } from '@/lib/services/plantTimelineService';
import { PlantJournal } from '@/types/plant-journal';
import { PlantTimeline } from '@/types/plant-timeline';
import { PlantTimeline as PlantTimelineComponent } from '@/components/timeline/PlantTimeline'; // Rename import to avoid conflict
import { ArrowLeft } from 'lucide-react';
import { TaskService } from '@/lib/services/taskService'; // Import TaskService
import { GrowTask } from '@/types/calendar'; // Import GrowTask type
import { DynamicMetaTags } from '@/components/SEO/DynamicMetaTags';
import { PageStructuredData, articleData } from '@/components/SEO/PageStructuredData';

interface PlantTimelinePageProps {
  params: {
    slug: string; // The plantId captured from the URL
  };
}

export default function PlantTimelinePage({ params }: PlantTimelinePageProps) {
  const router = useRouter();
  const plantId = params.slug;

  const [journal, setJournal] = useState<PlantJournal | undefined>(undefined);
  const [timeline, setTimeline] = useState<PlantTimeline | null>(null);
  const [tasks, setTasks] = useState<GrowTask[]>([]); // State for tasks

  const journalService = PlantJournalService.getInstance();
  const timelineService = PlantTimelineService.getInstance();
  const taskService = TaskService.getInstance(); // Get TaskService instance

  useEffect(() => {
    // Fetch the plant journal for this plantId
    const plantJournal = journalService.getJournal(plantId);
    setJournal(plantJournal);

     // Fetch tasks for this plantId
    const plantTasks = taskService.getTasks({ plantId: plantId }); // Assuming a method to get tasks by plantId
    setTasks(plantTasks);

    // If journal exists and has a planting date, generate the timeline
    if (plantJournal && plantJournal.planting_date) {
      const generatedTimeline = timelineService.generateTimeline(plantJournal);
      setTimeline(generatedTimeline);
    } else {
        setTimeline(null);
    }

  }, [plantId, journalService, timelineService, taskService]); // Added dependencies

  // TODO: Handle cases where journal or timeline are null

  const pageData = {
    ...articleData,
    headline: `${journal?.plant_name || plantId} Growth Timeline`,
    description: `Track the growth journey of your ${journal?.plant_name || plantId} from seed to harvest with our interactive timeline visualization.`,
    image: journal?.image || '/og-image.jpg',
    datePublished: journal?.createdAt,
    dateModified: new Date().toISOString(),
  };

  return (
    <>
      <DynamicMetaTags
        title={`${journal?.plant_name || plantId} Growth Timeline`}
        description={`Track the growth journey of your ${journal?.plant_name || plantId} from seed to harvest with our interactive timeline visualization.`}
        keywords={['plant growth', 'garden management', 'plant tracking', 'growing guide', 'plant journal', 'garden calendar', 'plant care', 'harvest tracking', (journal?.plant_name || plantId), 'timeline', 'growth stages', 'plant tracking']}
        ogType="article"
        canonicalUrl={`https://eco-grow.netlify.app/timeline/${params.slug}`}
      />
      <PageStructuredData type="Article" data={pageData} />
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
             <ArrowLeft className="h-6 w-6" />
          </Button>
           <h1 className="text-3xl font-bold">Timeline for {journal?.plant_name || plantId}</h1>
        </div>

        {/* Render the timeline component or a message */}
        {timeline ? (
          <PlantTimelineComponent timeline={timeline} journal={journal} tasks={tasks} /> {/* Pass journal and tasks */}
        ) : (journal && !journal.planting_date ? (
            <p className="text-lg text-muted-foreground text-center">Planting date is required to generate the timeline. Please add a journal entry with a planting date.</p>
        ) : (
             <p className="text-lg text-muted-foreground text-center">Loading timeline data or journal not found...</p>
        ))
        }

         {/* TODO: Add a link or button to add a journal entry if needed */}
          {journal && !journal.planting_date && (
              <div className="text-center mt-6">
                   <Link href={`/journal/${plantId}`} passHref>
                        <Button>Add First Journal Entry (with Planting Date)</Button>
                   </Link>
              </div>
          )}

      </div>
    </>
  );
} 