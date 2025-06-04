import { useEffect, useState } from 'react';
import { ReminderPreferences, TaskType } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';

const defaultPreferences: ReminderPreferences = {
  defaultReminderTime: 'morning',
  enabledTaskTypes: ['water', 'fertilize', 'harvest'],
  notificationTone: 'friendly',
  pushNotifications: true,
  emailNotifications: false,
};

export default function ReminderPreferences() {
  const [preferences, setPreferences] = useState<ReminderPreferences>(defaultPreferences);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const savedPreferences = localStorage.getItem('reminderPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  };

  const savePreferences = (newPreferences: ReminderPreferences) => {
    localStorage.setItem('reminderPreferences', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    toast({
      title: 'Preferences Saved',
      description: 'Your reminder preferences have been updated.',
    });
  };

  const handleTaskTypeToggle = (type: TaskType) => {
    const newPreferences = {
      ...preferences,
      enabledTaskTypes: preferences.enabledTaskTypes.includes(type)
        ? preferences.enabledTaskTypes.filter(t => t !== type)
        : [...preferences.enabledTaskTypes, type],
    };
    savePreferences(newPreferences);
  };

  const handleReminderTimeChange = (time: 'morning' | 'afternoon' | 'evening' | 'custom') => {
    const newPreferences = {
      ...preferences,
      defaultReminderTime: time,
    };
    savePreferences(newPreferences);
  };

  const handleCustomTimeChange = (time: string) => {
    const newPreferences = {
      ...preferences,
      customReminderTime: time,
    };
    savePreferences(newPreferences);
  };

  const handleNotificationToneChange = (tone: 'friendly' | 'strict' | 'scientific') => {
    const newPreferences = {
      ...preferences,
      notificationTone: tone,
    };
    savePreferences(newPreferences);
  };

  const handleNotificationTypeToggle = (type: 'push' | 'email') => {
    const newPreferences = {
      ...preferences,
      pushNotifications: type === 'push' ? !preferences.pushNotifications : preferences.pushNotifications,
      emailNotifications: type === 'email' ? !preferences.emailNotifications : preferences.emailNotifications,
    };
    savePreferences(newPreferences);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Reminder Preferences</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Default Reminder Time</h3>
          <div className="flex gap-2">
            {['morning', 'afternoon', 'evening', 'custom'].map(time => (
              <button
                key={time}
                onClick={() => handleReminderTimeChange(time as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${preferences.defaultReminderTime === time
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
          {preferences.defaultReminderTime === 'custom' && (
            <input
              type="time"
              value={preferences.customReminderTime || '09:00'}
              onChange={(e) => handleCustomTimeChange(e.target.value)}
              className="mt-2 px-3 py-1 border rounded"
            />
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">Task Types</h3>
          <div className="flex flex-wrap gap-2">
            {['water', 'fertilize', 'harvest', 'prune', 'pest_control', 'other'].map(type => (
              <button
                key={type}
                onClick={() => handleTaskTypeToggle(type as TaskType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${preferences.enabledTaskTypes.includes(type as TaskType)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Notification Tone</h3>
          <div className="flex gap-2">
            {['friendly', 'strict', 'scientific'].map(tone => (
              <button
                key={tone}
                onClick={() => handleNotificationToneChange(tone as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${preferences.notificationTone === tone
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Notification Methods</h3>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={() => handleNotificationTypeToggle('push')}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <span>Push Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={() => handleNotificationTypeToggle('email')}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <span>Email Notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 