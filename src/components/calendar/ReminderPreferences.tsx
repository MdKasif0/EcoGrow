import { useEffect, useState } from 'react';
import { ReminderPreferences, TaskType, ReminderTime } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    if (typeof window === 'undefined') return;
    const savedPreferences = localStorage.getItem('reminderPreferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Failed to parse reminder preferences from localStorage:', error);
        setPreferences(defaultPreferences);
      }
    }
  };

  const savePreferences = (newPreferences: ReminderPreferences) => {
    if (typeof window === 'undefined') return;
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

  const handleReminderTimeChange = (time: ReminderTime) => {
    const newPreferences = {
      ...preferences,
      defaultReminderTime: time,
      customReminderTime: time === 'custom' ? preferences.customReminderTime : undefined,
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

  const handleNotificationTypeToggle = (type: 'push' | 'email', checked: boolean) => {
    const newPreferences = {
      ...preferences,
      pushNotifications: type === 'push' ? checked : preferences.pushNotifications,
      emailNotifications: type === 'email' ? checked : preferences.emailNotifications,
    };
    savePreferences(newPreferences);
  };

  return (
    <div className="space-y-8 p-6 bg-card text-card-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 border-b pb-4 border-border">Reminder Preferences</h2>
      
      <div className="grid gap-6">
        <div className="grid gap-4">
          <Label className="text-lg font-semibold text-muted-foreground">Default Reminder Time</Label>
          <RadioGroup
            value={preferences.defaultReminderTime}
            onValueChange={(value: ReminderTime) => handleReminderTimeChange(value)}
            className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="morning" id="time-morning" />
              <Label htmlFor="time-morning">Morning (e.g., 8:00 AM)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="afternoon" id="time-afternoon" />
              <Label htmlFor="time-afternoon">Afternoon (e.g., 1:00 PM)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="evening" id="time-evening" />
              <Label htmlFor="time-evening">Evening (e.g., 6:00 PM)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="time-custom" />
              <Label htmlFor="time-custom">Custom</Label>
            </div>
          </RadioGroup>
          {preferences.defaultReminderTime === 'custom' && (
            <input
              type="time"
              value={preferences.customReminderTime || '09:00'}
              onChange={(e) => handleCustomTimeChange(e.target.value)}
              className="mt-2 px-3 py-2 border rounded-md w-fit bg-input text-input-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          )}
        </div>

        <div className="grid gap-4">
          <Label className="text-lg font-semibold text-muted-foreground">Enable Reminders For:</Label>
          <div className="flex flex-wrap gap-y-3 gap-x-6">
            {['water', 'fertilize', 'harvest', 'prune', 'pest_control', 'other'].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`task-type-${type}`}
                  checked={preferences.enabledTaskTypes.includes(type as TaskType)}
                  onCheckedChange={(checked) => handleTaskTypeToggle(type as TaskType)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor={`task-type-${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <Label className="text-lg font-semibold text-muted-foreground">Notification Tone</Label>
          <Select
            value={preferences.notificationTone}
            onValueChange={(value: 'friendly' | 'strict' | 'scientific') => handleNotificationToneChange(value)}
          >
            <SelectTrigger className="w-[180px] bg-input text-input-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground border-border">
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="strict">Strict</SelectItem>
              <SelectItem value="scientific">Scientific</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          <Label className="text-lg font-semibold text-muted-foreground">Notification Methods</Label>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-push"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked: boolean) => handleNotificationTypeToggle('push', checked)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor="notify-push">Push Notifications (PWA)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-email"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked: boolean) => handleNotificationTypeToggle('email', checked)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor="notify-email">Email Notifications</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 