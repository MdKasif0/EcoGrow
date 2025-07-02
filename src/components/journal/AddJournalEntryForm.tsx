'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { PlantJournalEntry, Mood, HealthStatus, JournalPhoto, TaskSummary, GrowingGuide, GrowthStage, WeatherInfo } from '@/types/plant-journal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, CloudUpload, Smile, Frown, HeartPulse, Leaf, Sun, Thermometer, Droplets, XCircle } from 'lucide-react';
import { TaskService } from '@/lib/services/taskService';
import { GrowTask } from '@/types/calendar';
import { format } from 'date-fns';
import { getWeatherData, WeatherData } from '@/lib/services/weatherService';
import { calculateGrowthStage, growingGuides } from '@/lib/services/growingGuideService';

interface AddJournalEntryFormProps {
  plantId: string;
  plantName: string;
  onEntryAdded: (newEntry: Omit<PlantJournalEntry, 'entry_id' | 'user_id'>) => void;
  onCancel: () => void;
  plantingDate?: string;
  growingGuide?: GrowingGuide;
  tasks: GrowTask[];
}

export function AddJournalEntryForm({
  plantId,
  plantName,
  onEntryAdded,
  onCancel,
  plantingDate,
  growingGuide,
  tasks
}: AddJournalEntryFormProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [mood, setMood] = useState<Mood | ''>('');
  const [healthStatus, setHealthStatus] = useState<HealthStatus | ''>('');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [currentGrowthStage, setCurrentGrowthStage] = useState<GrowthStage | null>(null);

  const taskService = TaskService.getInstance();

  useEffect(() => {
    getWeatherData(0, 0).then(weatherData => {
      if (weatherData) {
        setWeather({
          condition: weatherData.conditions,
          temperature: weatherData.temperature.toString(),
          humidity: weatherData.humidity.toString(),
        } as WeatherInfo);
      } else {
        setWeather(null);
      }
    }).catch(error => {
      console.error("Error fetching weather data:", error);
      setWeather(null);
    });

    if (plantingDate && growingGuide && growingGuides) {
      const guideData = growingGuides[growingGuide.guide_id];
      if (guideData) {
        const stage = calculateGrowthStage(new Date(date), new Date(plantingDate), guideData);
        setCurrentGrowthStage(stage);
      } else {
        console.warn("Growing guide data not found for guide_id:", growingGuide.guide_id);
        setCurrentGrowthStage(null);
      }
    } else {
      setCurrentGrowthStage(null);
    }
  }, [date, plantId, plantingDate, growingGuide]);

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files);
      setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, index) => index !== indexToRemove));
  };

  const handleTaskSelect = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev =>
      checked ? [...prev, taskId] : prev.filter(id => id !== taskId)
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const photoBase64s = await Promise.all(photos.map(file => fileToBase64(file)));

    const journalPhotos: JournalPhoto[] = photoBase64s.map(base64String => ({
      id: crypto.randomUUID(),
      url: base64String,
      alt: 'Uploaded plant photo',
      uploadedAt: new Date().toISOString(),
    }));

    const linkedTasks: TaskSummary[] = tasks
      .filter(task => selectedTasks.includes(task.id))
      .map(task => ({ taskId: task.id, taskType: task.taskType, completed: !!task.completedAt }));

    const weatherDataForEntry = await getWeatherData(0, 0);
    const weatherInfoForEntry: WeatherInfo | undefined = weatherDataForEntry ? {
      condition: weatherDataForEntry.conditions,
      temperature: weatherDataForEntry.temperature.toString(),
      humidity: weatherDataForEntry.humidity.toString(),
    } : undefined;

    const newEntryData: Omit<PlantJournalEntry, 'entry_id' | 'user_id'> = {
      plant_id: plantId,
      plant_name: plantName,
      date: date,
      note: note || undefined,
      photos: journalPhotos.length > 0 ? journalPhotos : undefined,
      mood: mood || undefined,
      health_status: healthStatus || undefined,
      weather_info: weatherInfoForEntry || undefined,
      task_summary: linkedTasks.length > 0 ? linkedTasks : undefined,
      growth_stage_id: currentGrowthStage?.id,
      growth_stage_name: currentGrowthStage?.name,
    };

    onEntryAdded(newEntryData);

    setIsSaving(false);
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setNote('');
    setPhotos([]);
    setMood('');
    setHealthStatus('');
    setSelectedTasks([]);
  };

  const handleQuickLog = async () => {
    setIsSaving(true);

    const photoBase64s = await Promise.all(photos.map(file => fileToBase64(file)));
    const journalPhotos: JournalPhoto[] = photoBase64s.map(base64String => ({
      id: crypto.randomUUID(),
      url: base64String,
      alt: 'Quick log photo',
      uploadedAt: new Date().toISOString(),
    }));

    const weatherDataForQuickLog = await getWeatherData(0, 0);
    const weatherInfoForQuickLog: WeatherInfo | undefined = weatherDataForQuickLog ? {
      condition: weatherDataForQuickLog.conditions,
      temperature: weatherDataForQuickLog.temperature.toString(),
      humidity: weatherDataForQuickLog.humidity.toString(),
    } : undefined;

    const tasksForQuickLog = tasks
      .filter(task => task.plantId === plantId)
      .map(task => ({ taskId: task.id, taskType: task.taskType, completed: !!task.completedAt }));

    const newEntryData: Omit<PlantJournalEntry, 'entry_id' | 'user_id'> = {
      plant_id: plantId,
      plant_name: plantName,
      date: date,
      note: note || 'Quick log entry - Plant status update.',
      photos: journalPhotos.length > 0 ? journalPhotos : undefined,
      mood: mood || undefined,
      health_status: healthStatus || undefined,
      weather_info: weatherInfoForQuickLog || undefined,
      task_summary: tasksForQuickLog.length > 0 ? tasksForQuickLog : undefined,
      growth_stage_id: currentGrowthStage?.id,
      growth_stage_name: currentGrowthStage?.name,
    };

    onEntryAdded(newEntryData);

    setIsSaving(false);
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setNote('');
    setPhotos([]);
    setMood('');
    setHealthStatus('');
    setSelectedTasks([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Add New Journal Entry</h3>

      <div className="grid gap-2">
        <Label htmlFor="entryDate">Date</Label>
        <Input type="date" id="entryDate" value={date} onChange={(e) => setDate(e.target.value)} required className="w-fit"/>
      </div>

      {currentGrowthStage && (
        <div className="grid gap-2">
          <Label>Detected Growth Stage</Label>
          <p className="text-primary font-medium">{currentGrowthStage.name}</p>
        </div>
      )}
      {!currentGrowthStage && plantingDate && growingGuide && (
        <p className="text-sm text-muted-foreground">Could not determine growth stage for this date.</p>
      )}
      {!plantingDate && (
        <p className="text-sm text-muted-foreground">Planting date not set, cannot determine growth stage.</p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="entryNote">Notes</Label>
        <Textarea id="entryNote" value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Write about your plant today..." />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="entryPhotos">Photos</Label>
        <div className="flex flex-col gap-4">
          <Input type="file" id="entryPhotos" multiple onChange={handlePhotoUpload} accept="image/*" className="hidden" />
          <Label htmlFor="entryPhotos" className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md bg-secondary hover:bg-secondary/80 transition-colors w-fit">
            <Camera className="h-5 w-5"/> Select Photos
          </Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {photos.map((photo, index) => (
              <div key={index} className="group relative">
                <div className="relative w-24 h-24 rounded-md shadow-sm overflow-hidden">
                  <Image
                      src={URL.createObjectURL(photo)}
                      alt={`Photo preview ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon" 
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500/70 hover:bg-red-600/70 text-white p-1"
                >
                  <XCircle className="h-4 w-4"/>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="entryMood">Mood</Label>
        <Select value={mood} onValueChange={(value: Mood | '') => setMood(value)}>
          <SelectTrigger id="entryMood" className="w-[180px]">
            <SelectValue placeholder="Select mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excited">Excited</SelectItem>
            <SelectItem value="happy">Happy</SelectItem>
            <SelectItem value="hopeful">Hopeful</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="concerned">Concerned</SelectItem>
            <SelectItem value="frustrated">Frustrated</SelectItem>
            <SelectItem value="sad">Sad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="entryHealth">Health Status</Label>
        <Select value={healthStatus} onValueChange={(value: HealthStatus | '') => setHealthStatus(value)}>
          <SelectTrigger id="entryHealth" className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="thriving">Thriving</SelectItem>
            <SelectItem value="stressed">Stressed</SelectItem>
            <SelectItem value="wilting">Wilting</SelectItem>
            <SelectItem value="diseased">Diseased</SelectItem>
            <SelectItem value="pest_issue">Pest Issue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {weather && (
        <div className="grid gap-2">
          <Label>Detected Weather</Label>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            {weather.condition && <span className="flex items-center gap-1"><Sun className="h-4 w-4" /> {weather.condition}</span>}
            {weather.temperature && <span className="flex items-center gap-1"><Thermometer className="h-4 w-4" /> {weather.temperature}</span>}
            {weather.humidity && <span className="flex items-center gap-1"><Droplets className="h-4 w-4" /> {weather.humidity}</span>}
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="grid gap-2">
          <Label className="text-lg font-semibold">Link Completed Tasks (Today for this plant)</Label>
          <div className="flex flex-wrap gap-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={selectedTasks.includes(task.id)}
                  onCheckedChange={(checked: boolean) => handleTaskSelect(task.id, checked)}
                />
                <Label htmlFor={`task-${task.id}`} className="flex items-center gap-2 cursor-pointer">
                  {taskTypeIcons[task.taskType] || <Leaf className="h-4 w-4"/>} {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Entry'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleQuickLog} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Quick Log (Photo + Tasks + Weather)
        </Button>
      </div>
    </form>
  );
}

const taskTypeIcons: Record<string, React.ReactNode> = {
  water: <Droplets className="h-4 w-4 text-blue-500" />,
  fertilize: <Leaf className="h-4 w-4 text-green-600" />,
  harvest: <Leaf className="h-4 w-4 text-brown-500" />,
  prune: <Leaf className="h-4 w-4 text-brown-500" />,
  pest_control: <Leaf className="h-4 w-4 text-red-500" />,
  other: <Leaf className="h-4 w-4 text-gray-500" />,
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}; 