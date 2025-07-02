'use client';

import { WifiOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { PlantJournalService } from '@/lib/services/plantJournalService';
import { PlantJournal } from '@/types/plant-journal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function OfflinePage() {
  const [offlineJournals, setOfflineJournals] = useState<Record<string, PlantJournal>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      // Access localStorage only on the client side
      if (typeof window !== 'undefined') {
        const service = PlantJournalService.getInstance();
        // Accessing the private journals directly for simplicity in this offline view
        // A more robust solution might involve adding a public method to PlantJournalService
        // to safely expose a summary or list of available journals.
        const journals = localStorage.getItem('plantJournals');
        if (journals) {
          setOfflineJournals(JSON.parse(journals));
        }
      }
    } catch (error) {
      console.error('Failed to load offline journals:', error);
      setOfflineJournals({}); // Ensure state is empty on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const availablePlants = Object.keys(offlineJournals).filter(plantId => offlineJournals[plantId].entries.length > 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
      <WifiOff size={64} className="text-destructive mb-4" />
      <h1 className="text-3xl font-bold text-primary mb-2">You are offline</h1>
      <p className="text-lg text-muted-foreground mb-6">
        It seems you&apos;re not connected to the internet. Some features may be unavailable.
      </p>

      <Link href="/">
        <Button variant="default" className="mb-6">Go to Homepage</Button>
      </Link>

      {isLoading ? (
        <p>Loading offline data...</p>
      ) : availablePlants.length > 0 ? (
        <Card className="w-full max-w-md mt-4">
          <CardHeader>
            <CardTitle className="text-xl">Available Offline Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">You can access journal entries for the following plants:</p>
            <ul className="list-disc list-inside text-left">
              {availablePlants.map(plantId => (
                <li key={plantId} className="text-muted-foreground">
                  {plantId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} {/* Basic formatting */}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Full access to these entries requires an internet connection.
            </p>
          </CardContent>
        </Card>
      ) : (
        <p className="mt-4 text-muted-foreground">No offline journal data found.</p>
      )}

    </div>
  );
}
