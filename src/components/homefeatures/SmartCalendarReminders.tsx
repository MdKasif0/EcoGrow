import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarDays, CheckCircle2, Clock } from 'lucide-react';
import { GrowTask, TaskType } from '@/types/calendar';
import { TaskService } from '@/lib/services/taskService';
import { useRouter } from 'next/navigation';

const taskTypeIcons: Record<TaskType, string> = {
  water: '💧',
  fertilize: '🌱',
  harvest: '🌿',
  prune: '✂️',
  pest_control: '🐛',
  other: '📝',
};

export default function SmartCalendarReminders() {
  const [todayTasks, setTodayTasks] = useState<GrowTask[]>([]);
  const router = useRouter();
  const taskService = TaskService.getInstance();

  useEffect(() => {
    loadTodayTasks();
  }, []);

  const loadTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = taskService.getTasks({
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
    });

    setTodayTasks(tasks);
  };

  const handleTaskComplete = (taskId: string) => {
    taskService.updateTaskStatus(taskId, 'completed');
    loadTodayTasks();
  };

  const handleViewCalendar = () => {
    router.push('/calendar');
  };

  return (
    <Card className="rounded-2xl h-full flex flex-col group hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-br from-primary/10 via-transparent to-transparent">
      <CardHeader className="flex flex-row items-center gap-3">
        <CalendarDays size={28} className="text-primary group-hover:animate-sprout origin-bottom transition-transform duration-300" />
        <div>
          <CardTitle className="font-serif">Smart Calendar & Reminders</CardTitle>
          <CardDescription className="text-sm">
            {todayTasks.length} tasks for today
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {todayTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tasks scheduled for today. Time to plan your next gardening activities!
          </p>
        ) : (
          <div className="space-y-2">
            {todayTasks.slice(0, 3).map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{taskTypeIcons[task.taskType]}</span>
                  <div>
                    <p className="text-sm font-medium">{task.plantName}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTaskComplete(task.id)}
                  className="h-8 w-8 p-0"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {todayTasks.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{todayTasks.length - 3} more tasks
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push('/calendar?tab=today')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Today's Tasks
        </Button>
        <Button
          className="flex-1"
          onClick={handleViewCalendar}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
      </CardFooter>
    </Card>
  );
}
