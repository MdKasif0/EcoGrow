import { useEffect, useState } from 'react';
import { GrowTask, TaskType, TaskStatus } from '@/types/calendar';
import { TaskService } from '@/lib/services/taskService';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Clock, CircleDotDashed } from 'lucide-react';
import { format } from 'date-fns';

const taskTypeIcons: Record<TaskType, string> = {
  water: '💧',
  fertilize: '🌱',
  harvest: '🌿',
  prune: '✂️',
  pest_control: '🐛',
  other: '📝',
};

export default function TodayTasks() {
  const [tasks, setTasks] = useState<GrowTask[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus[]>(['pending', 'missed', 'snoozed']);

  const { toast } = useToast();
  const taskService = TaskService.getInstance();

  useEffect(() => {
    loadTodayTasks();
  }, [selectedTypes, selectedStatus]);

  const loadTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allTasks = taskService.getTasks({
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
    });

    setTasks(allTasks);
  };

  const handleTaskComplete = (taskId: string) => {
    taskService.updateTaskStatus(taskId, 'completed');
    loadTodayTasks();
    toast({
      title: 'Task Completed',
      description: 'Great job! Keep up the good work! 🌱',
    });
  };

  const handleTaskSnooze = (taskId: string) => {
    taskService.snoozeTask(taskId, 1);
    loadTodayTasks();
    toast({
      title: 'Task Snoozed',
      description: 'Task has been rescheduled for tomorrow.',
    });
  };

  const filteredTasks = tasks.filter(task =>
    (selectedTypes.length === 0 || selectedTypes.includes(task.taskType)) &&
    (selectedStatus.length === 0 || selectedStatus.includes(task.status))
  ).sort((a, b) => {
    const statusOrder: Record<TaskStatus, number> = { 'missed': 0, 'snoozed': 1, 'pending': 2, 'completed': 3 };
    return statusOrder[task.status] - statusOrder[b.status];
  });

  const toggleTaskType = (type: TaskType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleTaskStatus = (status: TaskStatus) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'missed':
        return <Clock className="h-5 w-5 text-red-500" />;
      case 'snoozed':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
      default:
        return <CircleDotDashed className="h-5 w-5 text-blue-500 animate-pulse" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Filter by Task Type</h3>
        <div className="flex flex-wrap gap-3">
          {['water', 'fertilize', 'harvest', 'prune', 'pest_control', 'other'].map(type => (
            <button
              key={type}
              onClick={() => toggleTaskType(type as TaskType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border
                ${selectedTypes.includes(type as TaskType)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
                }`}
            >
              {taskTypeIcons[type as TaskType]} {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
         <h3 className="text-lg font-semibold mb-3">Filter by Status</h3>
         <div className="flex flex-wrap gap-3">
           {['pending', 'completed', 'missed', 'snoozed'].map(status => (
             <button
               key={status}
               onClick={() => toggleTaskStatus(status as TaskStatus)}
               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border
                 ${selectedStatus.includes(status as TaskStatus)
                   ? 'bg-primary text-primary-foreground border-primary'
                   : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
                 }`}
             >
               {getStatusIcon(status as TaskStatus)}{' '}
               {status.charAt(0).toUpperCase() + status.slice(1)}
             </button>
           ))}
         </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Today&apos;s Tasks</h3>
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No tasks matching filters! 🎉</p>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-colors
                  ${task.status === 'completed' ? 'bg-green-100/20 border border-green-500/30' :
                    task.status === 'missed' ? 'bg-red-100/20 border border-red-500/30' :
                    task.status === 'snoozed' ? 'bg-yellow-100/20 border border-yellow-500/30' :
                    'bg-card border border-border hover:bg-accent/50'
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl flex-shrink-0">{taskTypeIcons[task.taskType]}</span>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg">{task.plantName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                      {task.repeat && <span className="ml-2">({task.repeat})</span>}
                    </p>
                    {task.status === 'snoozed' && task.snoozedUntil && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Snoozed until: {format(new Date(task.snoozedUntil), 'MMM dd, hh:mm a')}
                      </p>
                    )}
                    {task.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{task.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                   <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-green-600' : task.status === 'missed' ? 'text-red-600' : task.status === 'snoozed' ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {getStatusIcon(task.status)} {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                   </span>
                   {task.status === 'pending' || task.status === 'missed' || task.status === 'snoozed' ? (
                     <div className="flex gap-2">
                       <button
                         onClick={() => handleTaskComplete(task.id)}
                         className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                       >
                         Done
                       </button>
                       <button
                         onClick={() => handleTaskSnooze(task.id)}
                         className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                       >
                         Snooze
                       </button>
                     </div>
                   ) : task.status === 'completed' && task.completedAt ? (
                      <p className="text-xs text-muted-foreground">
                         Completed: {format(new Date(task.completedAt), 'MMM dd, hh:mm a')}
                      </p>
                   ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 