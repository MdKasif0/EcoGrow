'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PlantJournalService } from '@/lib/services/plantJournalService';
import { PlantJournal, PlantJournalEntry, GrowingGuide, GrowthStage, Mood, HealthStatus, JournalPhoto, TaskSummary } from '@/types/plant-journal';
import { ArrowLeft, Camera, Leaf, Smile, Frown, HeartPulse, Droplets, Sprout, Sun, Thermometer, Wind, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, differenceInDays, isValid } from 'date-fns';
import { AddJournalEntryForm } from '@/components/journal/AddJournalEntryForm';

// Helper to get mood icon (simplified)
const getMoodIcon = (mood?: string) => {
  switch (mood) {
    case 'excited':
    case 'happy':
    case 'hopeful':
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

// Helper to get task icon (simplified)
const getTaskIcon = (taskType: string) => {
    switch (taskType) {
        case 'water': return <Droplets className="h-4 w-4 text-blue-500" />;
        case 'fertilize': return <Sprout className="h-4 w-4 text-green-500" />;
        // Add more task types as needed
        default: return null;
    }
};

// Helper to fetch growing guide data (mock/placeholder)
// In a real app, you might fetch this from a service or API
const fetchGrowingGuide = async (plantId: string): Promise<GrowingGuide | undefined> => {
    // Assuming guide files are named like [plantId].json in src/lib/data/growingGuides
    try {
        // This dynamic import won't work directly in client-side code for a static path,
        // and fetch() won't work for local files. A realistic approach would be:
        // 1. Have an API endpoint that reads the JSON file.
        // 2. Import statically if the set of guides is known at build time.
        // For now, let's simulate fetching.
        // We'll need to map plantId to a specific guide file name.

        // Example: Assuming a guide for 'cocoa_beveragecrop' exists as src/lib/data/growingGuides/cocoa_beveragecrop.json
        const guidePath = `/api/growing-guides?plantId=${plantId}`;
        const response = await fetch(guidePath);

        if (!response.ok) {
            console.error(`Failed to fetch growing guide for ${plantId}: ${response.statusText}`);
            return undefined;
        }

        const guide: GrowingGuide = await response.json();
        return guide;

    } catch (error) {
        console.error(`Error fetching growing guide for ${plantId}:`, error);
        return undefined;
    }
};

// Helper to determine growth stage based on date
const getGrowthStageForDate = (date: string, plantingDate: string, guide?: GrowingGuide): GrowthStage | undefined => {
    if (!guide || !plantingDate || !date) return undefined;

    const entryDate = parseISO(date);
    const plantStartDate = parseISO(plantingDate);

    if (!isValid(entryDate) || !isValid(plantStartDate)) return undefined; // Ensure dates are valid

    const daysSincePlanting = differenceInDays(entryDate, plantStartDate);

    // Iterate through stages and find the one that matches the days since planting
    // This logic depends heavily on how the 'timing' or 'duration_days' is structured in your guide data
    // Assuming guide stages are ordered and timing is like "Days X-Y" or "Weeks A-B"
    for (const stage of guide.stages) {
        if (stage.timing) {
            // Attempt to parse timing string (basic implementation)
            const timingMatch = stage.timing.match(/(Days|Weeks)\s*(\d+)(?:\s*-\s*(\d+))?/);
            if (timingMatch) {
                const unit = timingMatch[1]; // "Days" or "Weeks"
                const start = parseInt(timingMatch[2], 10);
                const end = timingMatch[3] ? parseInt(timingMatch[3], 10) : start;

                let startDays = start;
                let endDays = end;

                if (unit === 'Weeks') {
                    startDays = start * 7;
                    endDays = end * 7;
                }

                if (daysSincePlanting >= startDays && daysSincePlanting <= endDays) {
                    return stage;
                }
            }
        } else if (stage.duration_days !== undefined) {
             // If duration_days is provided, calculate based on cumulative duration
             // This requires iterating through previous stages as well, which is more complex.
             // A simpler approach might be if the guide provides cumulative days for stage end.
             // For now, let's stick to the 'timing' string parsing or a simplified cumulative check.
             // If guide provides total days from planting to *end* of stage:
             // if (daysSincePlanting <= stage.cumulative_days_end) return stage;

             // If stages have duration_days and are sequential, calculate cumulative start/end:
             let cumulativeDays = 0;
             for(const s of guide.stages) {
                 const stageDuration = s.duration_days || 0;
                 const stageStartDays = cumulativeDays;
                 const stageEndDays = cumulativeDays + stageDuration;
                 if (daysSincePlanting >= stageStartDays && daysSinceSincePlanting < stageEndDays) {
                     return s; // Found the stage
                 }
                 cumulativeDays += stageDuration;
             }
        }
         // Fallback if timing/duration parsing fails or doesn't match
         // Could potentially match based on stage order if no timing is given?
    }

    return undefined; // No matching stage found
};

export default function PlantJournalPage() {
  const params = useParams();
  const plantId = params.slug as string; // Assuming slug is the plantId
  const router = useRouter();
  const journalService = PlantJournalService.getInstance();
  const [journal, setJournal] = useState<PlantJournal | undefined>(undefined);
  const [growingGuide, setGrowingGuide] = useState<GrowingGuide | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'timeline' | 'analytics' | 'ai-insights'>('timeline');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [showAddEntryForm, setShowAddEntryForm] = useState(false);

  useEffect(() => {
    if (plantId) {
      const fetchedJournal = journalService.getJournal(plantId);
      setJournal(fetchedJournal);

      // Fetch the growing guide when the plantId is available
      fetchGrowingGuide(plantId).then(setGrowingGuide);
    }
  }, [plantId, showAddEntryForm]);

  const toggleExpandEntry = (entryId: string) => {
    setExpandedEntryId(expandedEntryId === entryId ? null : entryId);
  };

  const handleAddEntry = (newEntryData: Omit<PlantJournalEntry, 'entry_id' | 'user_id'>) => {
      // Add a placeholder planting date if none exists yet (for demo purposes)
      if (!journal?.planting_date) {
          // In a real app, this should be set when the plant is added or first journal entry is created
          // For now, let's set it to the date of the first entry if it doesn't exist
          const updatedJournal = journalService.getJournal(plantId); // Get latest journal state
          if (updatedJournal && (!updatedJournal.planting_date || updatedJournal.entries.length === 0)) {
              const firstEntryDate = newEntryData.date;
               journalService.updateJournal(plantId, { ...updatedJournal, planting_date: firstEntryDate });
          }
      }

    const addedEntry = journalService.addJournalEntry(plantId, newEntryData);
    // Re-fetch journal to get the updated planting_date if it was just set
    setJournal(journalService.getJournal(plantId));
    setShowAddEntryForm(false);
    setExpandedEntryId(addedEntry.entry_id);
  };

  if (!plantId) {
    return <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">Select a plant to view its journal.</div>;
  }

  // Determine if we should show the 'No journal' message or the journal content
  const showNoJournalMessage = !journal || (journal.entries.length === 0 && !showAddEntryForm);

  if (showNoJournalMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-transparent to-transparent flex flex-col items-center justify-center px-4 py-8">
        <p className="text-muted-foreground mb-4">No journal found for this plant. Start by adding your first entry!</p>
        <Button onClick={() => setShowAddEntryForm(true)}>
           <PlusCircle className="h-5 w-5 mr-2" />
           Add First Entry
        </Button>
        <Button variant="outline" onClick={() => router.push('/')} className="mt-4">Back to Home</Button>
      </div>
    );
  }

  const plantName = journal?.plant_nickname || journal?.plant_id || 'Unknown Plant';

  // Sort entries by date descending for timeline
  const sortedEntries = [...(journal?.entries || [])].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold font-serif">{plantName}'s Journal</h1>
           {!showAddEntryForm && journal && (
             <Button onClick={() => setShowAddEntryForm(true)} size="sm">
               <PlusCircle className="h-4 w-4 mr-2" />
               Add Entry
             </Button>
           )}
        </div>

        {showAddEntryForm && (
           <div className="mb-8">
              <AddJournalEntryForm 
                 plantId={plantId} 
                 plantName={plantName}
                 onEntryAdded={handleAddEntry}
                 onCancel={() => setShowAddEntryForm(false)}
                 plantingDate={journal?.planting_date}
                 growingGuide={growingGuide}
              />
           </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-primary/10 rounded-lg">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('ai-insights')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'ai-insights'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              AI Insights
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'timeline' && (
            <div className="relative pl-8 sm:pl-32 py-6">
              {/* Timeline line */}
              <div className="absolute left-8 sm:left-32 inset-y-0 w-0.5 bg-border"></div>

              {
                sortedEntries.map((entry, index) => {
                    const entryDate = parseISO(entry.date);
                    const plantingDate = journal?.planting_date ? parseISO(journal.planting_date) : undefined;
                    const growthStage = plantingDate && isValid(entryDate) && isValid(plantingDate)
                        ? getGrowthStageForDate(entry.date, journal.planting_date, growingGuide)
                        : undefined;

                    return (
                        <div key={entry.entry_id} className="mb-8 flex items-center w-full">
                            {/* Date Circle */}
                            <div className="absolute left-4 sm:left-28 flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground ring-4 ring-background shadow z-10">
                                    <span className="text-sm font-bold">{format(entryDate, 'dd')}</span>
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">{format(entryDate, 'MMM')}</span>
                            </div>

                            <Card className="flex-1 ml-16 sm:ml-40 rounded-lg shadow-sm overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-semibold">{format(entryDate, 'PPP')}</CardTitle>
                                    <Button variant="ghost" size="icon" onClick={() => toggleExpandEntry(entry.entry_id)}>
                                        {expandedEntryId === entry.entry_id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </Button>
                                </CardHeader>

                                {expandedEntryId === entry.entry_id && (
                                    <CardContent className="space-y-4">
                                        {/* Display Growth Stage */}
                                        {entry.growth_stage_name && (
                                            <p className="text-sm font-medium text-primary">Stage: {entry.growth_stage_name}</p>
                                        )}

                                        {entry.photos && entry.photos.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {entry.photos.map(photo => (
                                                    // Use img tag with Base64 source
                                                    <img 
                                                        key={photo.id} 
                                                        src={photo.url} // This will be the Base64 string
                                                        alt={photo.alt || 'Plant photo'} 
                                                        className="w-full h-32 object-cover rounded-md shadow-sm"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {entry.note && (
                                            <div>
                                                <h4 className="font-semibold text-md mb-1">Notes:</h4>
                                                <p className="text-sm text-muted-foreground">{entry.note}</p>
                                            </div>
                                        )}

                                        {(entry.mood || entry.health_status) && (
                                            <div className="flex items-center gap-4">
                                                {entry.mood && <span className="flex items-center gap-1 text-sm text-muted-foreground">{getMoodIcon(entry.mood)} Mood: {entry.mood}</span>}
                                                {entry.health_status && <span className="flex items-center gap-1 text-sm text-muted-foreground">{getHealthIcon(entry.health_status)} Health: {entry.health_status}</span>}
                                            </div>
                                        )}

                                        {entry.task_summary && entry.task_summary.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-md mb-1">Tasks Completed:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {entry.task_summary.map(task => (
                                                        <span key={task.taskId} className="flex items-center gap-1 text-sm px-3 py-1 bg-secondary rounded-full text-secondary-foreground">
                                                            {getTaskIcon(task.taskType)}{task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {entry.weather_info && (
                                            <div>
                                                <h4 className="font-semibold text-md mb-1">Weather:</h4>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    {entry.weather_info.condition && <span className="flex items-center gap-1"><Sun className="h-4 w-4" /> {entry.weather_info.condition}</span>}
                                                    {entry.weather_info.temperature && <span className="flex items-center gap-1"><Thermometer className="h-4 w-4" /> {entry.weather_info.temperature}</span>}
                                                    {entry.weather_info.humidity && <span className="flex items-center gap-1"><Droplets className="h-4 w-4" /> {entry.weather_info.humidity}</span>}
                                                    {/* Add wind icon if needed */}
                                                </div>
                                            </div>
                                        )}

                                        {/* Add other entry details here */}
                                    </CardContent>
                                )}
                            </Card>
                        </div>
                    );
                })
              }

              {/* Add Entry point if timeline is not empty */}
                {journal?.entries && journal.entries.length > 0 && !showAddEntryForm && (
                    <div className="flex justify-center mt-8">
                        <Button onClick={() => setShowAddEntryForm(true)}>
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Add New Entry
                        </Button>
                    </div>
                )}

            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6 text-center text-muted-foreground">
              <h3 className="text-xl font-semibold mb-4">Plant Analytics (Coming Soon)</h3>
              <p>Visualize growth trends, health history, task completion rates, and more over time.</p>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div className="p-6 text-center text-muted-foreground">
               <h3 className="text-xl font-semibold mb-4">AI-Powered Insights (Coming Soon)</h3>
               <p>Get smart recommendations and analysis based on your journal data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 