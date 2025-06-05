import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GrowTask, TaskType } from '@/types/calendar';
import { TaskService } from '@/lib/services/taskService';
import { useToast } from '@/hooks/use-toast';
import styles from './GrowCalendar.module.css';

// Define colors using CSS variables from the module
const taskTypeColors: Record<TaskType, string> = {
  water: 'var(--ecogrow-event-water)',
  fertilize: 'var(--ecogrow-event-fertilize)',
  harvest: 'var(--ecogrow-event-harvest)',
  prune: 'var(--ecogrow-event-prune)',
  pest_control: 'var(--ecogrow-event-pest)',
  other: 'var(--ecogrow-event-other)',
};

const taskTypeIcons: Record<TaskType, string> = {
  water: '💧',
  fertilize: '🌱',
  harvest: '🌿',
  prune: '✂️',
  pest_control: '🐛',
  other: '📝',
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
            <p className="font-medium">{taskTypeIcons[task.taskType]} {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}</p>
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

  // Custom event content for branded chip look
  const renderEventContent = (eventInfo: any) => {
    const task: GrowTask = eventInfo.event.extendedProps.task;
    return (
      <div
        className="flex items-center gap-2 px-2 py-1 rounded-full shadow-sm text-white"
        style={{
          background: taskTypeColors[task.taskType],
          // Using CSS variable for text color if defined, otherwise white
          color: 'var(--ecogrow-text-dark, #fff)',
          fontWeight: 600,
          fontSize: '0.95em',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          width: '100%' // Ensure it takes full width in day grid
        }}
      >
        <span className="text-base flex-shrink-0">{taskTypeIcons[task.taskType]}</span>
        <span className="flex-grow overflow-hidden text-ellipsis">{task.plantName}</span>
      </div>
    );
  };

  const events = tasks.map(task => ({
    id: task.id,
    title: `${task.taskType}: ${task.plantName}`,
    start: task.date,
    // Use eventContent for styling, background/borderColor can be basic
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textColor: 'transparent', // Hide default text
    extendedProps: {
      task,
    },
  }));

  return (
    <div className={styles.ecogrowCalendarRoot}> {/* Apply root styling */}
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
        eventContent={renderEventContent}
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
        // Add classNames to root elements for easier CSS targeting if needed
        dayCellClassNames={styles.ecogrowDayCell}
        eventClassNames={styles.ecogrowEvent}
      />
    </div>
  );
} 