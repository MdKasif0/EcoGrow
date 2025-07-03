import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlantRecommendation } from '@/lib/ai/plantRecommender';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Droplet, Sun, Trash2, Edit2, Copy, Download } from 'lucide-react';
import type { GrowPlan } from '@/lib/services/growPlanService';

interface MyGrowPlanProps {
  savedPlants: PlantRecommendation[];
  selectedPlan: GrowPlan | null;
  onSelectPlan: (plan: GrowPlan | null) => void;
  onSavePlan: () => Promise<void>;
  onDeletePlan: (plan: GrowPlan) => Promise<void>;
  onDuplicatePlan: (plan: GrowPlan) => Promise<void>;
  onExportPlan: (plan: GrowPlan) => Promise<void>;
  onEditPlan: (plan: GrowPlan) => void;
  onNewPlan: () => void;
  planName: string;
  setPlanName: (name: string) => void;
  planDescription: string;
  setPlanDescription: (description: string) => void;
  planNotes: string;
  setPlanNotes: (notes: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  isEditing: boolean;
  shareUrl: string | null;
}

const MyGrowPlan: React.FC<MyGrowPlanProps> = ({
  savedPlants,
  selectedPlan,
  onSelectPlan,
  onSavePlan,
  onDeletePlan,
  onDuplicatePlan,
  onExportPlan,
  onEditPlan,
  onNewPlan,
  planName,
  setPlanName,
  planDescription,
  setPlanDescription,
  planNotes,
  setPlanNotes,
  isPublic,
  setIsPublic,
  isEditing,
  shareUrl
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // Mock tasks data - in a real app, this would come from a backend
  const tasks = [
    { id: 1, plantId: 'tomato', title: 'Water tomato plants', dueDate: new Date(), completed: false },
    { id: 2, plantId: 'basil', title: 'Fertilize basil', dueDate: new Date(Date.now() + 86400000), completed: false },
  ];

  const getPlantProgress = (plant: PlantRecommendation) => {
    // Mock progress calculation - in a real app, this would be based on actual growth data
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Grow Plan</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNewPlan}>
            New Plan
          </Button>
          <Button variant="outline">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="plants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plants">My Plants</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="plants" className="space-y-4">
          {savedPlants.map((plant) => (
            <Card key={plant.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{plant.name}</h3>
                  <p className="text-sm text-gray-500">{plant.scientificName}</p>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 mr-1" />
                      <span className="text-sm">{plant.lightRequirements}</span>
                    </div>
                    <div className="flex items-center">
                      <Droplet className="w-4 h-4 mr-1" />
                      <span className="text-sm">{plant.waterNeeds}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Growth Progress</div>
                  <Progress value={getPlantProgress(plant)} className="w-[100px]" />
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      task.completed ? 'text-green-500' : 'text-gray-300'
                    }`}
                  />
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {task.dueDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Mark Complete
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </TabsContent>
      </Tabs>

      {selectedPlan && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Plan Actions</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEditPlan(selectedPlan)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDuplicatePlan(selectedPlan)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExportPlan(selectedPlan)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeletePlan(selectedPlan)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGrowPlan; 