import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GrowTask, TaskType } from '@/types/calendar';
import { TaskService } from '@/lib/services/taskService';
import { useToast } from '@/components/ui/use-toast';
import styles from './GrowCalendar.module.css';
import { format } from 'date-fns';

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
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [calendarApi, setCalendarApi] = useState<any>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (calendarApi) {
      // FullCalendar months are 0-indexed, same as JavaScript Date
      calendarApi.gotoDate(new Date(new Date().getFullYear(), currentMonth, 1));
    }
  }, [currentMonth, calendarApi]);

  const loadTasks = () => {
    const allTasks = taskService.getTasks();
    setTasks(allTasks);
  };

  const handleEventClick = (info: any) => {
    const task = tasks.find(t => t.id === info.event.id);
    if (task) {
      toast({
        title: task.plantName,
        children: (
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
      children: 'Great job! Keep up the good work! 🌱',
    });
  };

  const handleTaskSnooze = (taskId: string) => {
    taskService.snoozeTask(taskId, 1);
    loadTasks();
    toast({
      title: 'Task Snoozed',
      children: 'Task has been rescheduled for tomorrow.',
    });
  };

  // Custom event content for branded chip look - Hide this as we are using dayCellContent
  // const renderEventContent = (eventInfo: any) => {
  //   return null; // Return null to hide the default event rendering
  // };

  // Custom day cell rendering
  const renderDayCellContent = (dayCellInfo: any) => {
    const date = dayCellInfo.date;
    const tasksOnDay = tasks.filter(task => format(new Date(task.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    const hasEvents = tasksOnDay.length > 0;
    const isToday = format(dayCellInfo.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    return (
      <div className={`${styles.dayContent} ${hasEvents ? styles.hasEvent : ''} ${isToday ? styles.isToday : ''}`}> {/* Apply classes for styling */}
        <div className={styles.dayNumber}>{dayCellInfo.dayNumberText}</div>
        {hasEvents && <div className={styles.eventIcon}>🍁</div>} {/* Placeholder leaf icon */}
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
      <div className={styles.monthNavigation}> {/* New month navigation container */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(monthIndex => {
          const monthName = new Date(new Date().getFullYear(), monthIndex).toLocaleString('default', { month: 'short' });
          const isCurrentMonth = monthIndex === currentMonth;
          return (
            <button
              key={monthIndex}
              className={`${styles.monthButton} ${isCurrentMonth ? styles.currentMonth : ''}`}
              onClick={() => setCurrentMonth(monthIndex)}
            >
              {monthName}
            </button>
          );
        })}
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '' // Remove view buttons
        }}
        events={events}
        eventClick={handleEventClick}
        // eventContent={renderEventContent} // Remove eventContent
        dayCellContent={renderDayCellContent} // Use dayCellContent for custom rendering
        height="auto"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        dayMaxEvents={true}
        nowIndicator={false} // Hide default today indicator
        selectable={true}
        selectMirror={true}
        weekends={true}
        editable={true}
        droppable={true}
        // Add classNames to root elements for easier CSS targeting if needed
        dayCellClassNames={styles.ecogrowDayCell} // Keep day cell class for general styling
        eventClassNames={styles.ecogrowEvent}
        dayHeaderClassNames={styles.ecogrowDayHeader} // Add class for weekday headers
        ref={calendarRef => {
          if (calendarRef) {
            setCalendarApi(calendarRef.getApi());
          }
        }}
      />
    </div>
  );
} 