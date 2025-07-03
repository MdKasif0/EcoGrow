'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { PlantJournalService } from '@/lib/services/plantJournalService';
import { useEffect, useState } from 'react';
import { PlantJournal } from '@/types/plant-journal';

// This page will list all the user's plants and link to their journals

// Mock plant data - Replace with actual data fetching in a real app
const mockPlants = [
  { id: 'plant-1', name: 'Tomato (Cherry)' },
  { id: 'plant-2', name: 'Basil' },
  { id: 'plant-3', name: 'Cucumber' },
  { id: 'plant-4', name: 'Bell Pepper' },
  { id: 'plant-cocoa_beveragecrop', name: 'Cocoa (Beverage)' }, // Example with conflicting ID
  { id: 'plant-cocoa_cashcrop', name: 'Cocoa (Cash)' }, // Example with conflicting ID
];

export default function JournalOverviewPage() {
  const [journals, setJournals] = useState<Record<string, PlantJournal>>({}); // Use PlantJournal type
  const journalService = PlantJournalService.getInstance();

  useEffect(() => {
    // Fetch all existing journals when the page loads
    setJournals(journalService.journals);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Plants</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <p className="text-lg text-muted-foreground mb-6">
        Select a plant below to view its journal or start a new one.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlants.map(plant => {
          const journalExists = journals[plant.id] && journals[plant.id].entries.length > 0;
          const latestEntry = journalExists ? journals[plant.id].entries[journals[plant.id].entries.length - 1] : null;
          const latestEntryDate = latestEntry ? new Date(latestEntry.date).toLocaleDateString() : 'No entries';

          return (
            <Card key={plant.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plant.name}</CardTitle>
                <CardDescription>
                   {journalExists ? `Last updated: ${latestEntryDate}` : 'No journal started'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 {journalExists ? (
                   <p className="text-sm text-muted-foreground line-clamp-3">
                     {latestEntry?.note || 'No note provided for the latest entry.'}
                   </p>
                 ) : (
                   <p className="text-sm text-muted-foreground italic">
                      No journal entries yet. Click below to start tracking progress!
                   </p>
                 )}
              </CardContent>
              <CardFooter>
                 <Link href={`/journal/${plant.id}`} className="w-full">
                   <Button className="w-full">
                     {journalExists ? 'View Journal' : 'Start Journal'}
                   </Button>
                 </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 