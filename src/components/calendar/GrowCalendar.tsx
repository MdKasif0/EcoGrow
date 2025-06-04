import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GrowTask, TaskType } from '@/types/calendar';
import { TaskService } from '@/lib/services/taskService';
import { useToast } from '@/components/ui/use-toast';

const taskTypeColors: Record<TaskType, string> = {
  water: '#3b82f6', // blue
  fertilize: '#22c55e', // green
  harvest: '#eab308', // yellow
  prune: '#8b5cf6', // purple
  pest_control: '#ef4444', // red
  other: '#6b7280', // gray
};

export default function GrowCalendar() {
  const [tasks, setTasks] = useState<GrowTask[]>([]);
  const { toast } = useToast();
  const taskService = TaskService.getInstance();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const allTasks = taskService.getTasks();
    setTasks(allTasks);
  };

  const handleEventClick = (info: any) => {
    const task = tasks.find(t => t.id === info.event.id);
    if (task) {
      toast({
        title: task.plantName,
        description: (
          <div className="space-y-2">
            <p className="font-medium">{task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}</p>
            {task.notes && <p className="text-sm text-gray-600">{task.notes}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => handleTaskComplete(task.id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Complete
              </button>
              <button
                onClick={() => handleTaskSnooze(task.id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Snooze
              </button>
            </div>
          </div>
        ),
      });
    }
  };

  const handleTaskComplete = (taskId: string) => {
    taskService.updateTaskStatus(taskId, 'completed');
    loadTasks();
    toast({
      title: 'Task Completed',
      description: 'Great job! Keep up the good work! 🌱',
    });
  };

  const handleTaskSnooze = (taskId: string) => {
    taskService.snoozeTask(taskId, 1);
    loadTasks();
    toast({
      title: 'Task Snoozed',
      description: 'Task has been rescheduled for tomorrow.',
    });
  };

  const events = tasks.map(task => ({
    id: task.id,
    title: `${task.taskType}: ${task.plantName}`,
    start: task.date,
    backgroundColor: taskTypeColors[task.taskType],
    borderColor: taskTypeColors[task.taskType],
    textColor: '#ffffff',
    extendedProps: {
      task,
    },
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        dayMaxEvents={true}
        nowIndicator={true}
        selectable={true}
        selectMirror={true}
        weekends={true}
        editable={true}
        droppable={true}
      />
    </div>
  );
} 