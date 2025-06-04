import { useEffect, useState } from 'react';
import { GrowTask, TaskType } from '@/types/calendar';
import { TaskService } from '@/lib/services/taskService';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const taskService = TaskService.getInstance();

  useEffect(() => {
    loadTodayTasks();
  }, []);

  const loadTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = taskService.getTasks({
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
    });

    setTasks(todayTasks);
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
    selectedTypes.length === 0 || selectedTypes.includes(task.taskType)
  );

  const toggleTaskType = (type: TaskType) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(taskTypeIcons).map(([type, icon]) => (
          <button
            key={type}
            onClick={() => toggleTaskType(type as TaskType)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedTypes.includes(type as TaskType)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No tasks for today! 🎉</p>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{taskTypeIcons[task.taskType]}</span>
                <div>
                  <h3 className="font-medium">{task.plantName}</h3>
                  <p className="text-sm text-gray-600">
                    {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                  </p>
                  {task.notes && (
                    <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
                  )}
                </div>
              </div>
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
          ))
        )}
      </div>
    </div>
  );
} 