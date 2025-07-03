import React, { useEffect, useState } from 'react';
import { PlantJournalService } from '@/lib/services/plantJournalService';
import { PlantJournal } from '@/types/plant-journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BookOpen, PlusCircle } from 'lucide-react';

export default function PlantJournalOverview() {
  const [journals, setJournals] = useState<PlantJournal[]>([]);
  const journalService = PlantJournalService.getInstance();
  const router = useRouter();

  useEffect(() => {
    setJournals(journalService.getAllJournals());
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-green-800">Plant Journal Center</h2>
        <BookOpen className="w-6 h-6 text-green-600" />
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No journal entries yet. Start by adding your first plant entry!</p>
          {/* Optionally, add a button to navigate to a general add entry page or guided flow */}
        </div>
      ) : (
        <div className="space-y-4">
          {journals.map(journal => (
            <div
              key={journal.plant_id}
              className="flex items-center justify-between p-4 border rounded-md shadow-sm"
            >
              <div>
                <h3 className="font-medium text-lg">{journal.plant_nickname || journal.plant_id}</h3>
                <p className="text-sm text-gray-500">{journal.entries.length} entries</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/journal/${journal.plant_id}`)}
              >
                View Journal
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
} 