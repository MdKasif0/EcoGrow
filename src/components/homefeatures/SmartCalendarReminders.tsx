import React, { useState } from 'react';
import { Calendar, Plus, Clock, Droplets, Sun, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

interface Reminder {
  id: string;
  plantName: string;
  task: string;
  date: Date;
  completed: boolean;
  type: 'watering' | 'fertilizing' | 'pruning' | 'other';
}

const mockReminders: Reminder[] = [
  {
    id: '1',
    plantName: 'Basil',
    task: 'Water plant',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    completed: false,
    type: 'watering'
  },
  {
    id: '2',
    plantName: 'Tomato',
    task: 'Apply fertilizer',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    completed: false,
    type: 'fertilizing'
  },
  {
    id: '3',
    plantName: 'Mint',
    task: 'Prune leaves',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    completed: false,
    type: 'pruning'
  }
];

const getTaskIcon = (type: string) => {
  switch (type) {
    case 'watering':
      return <Droplets className="w-4 h-4 text-blue-500" />;
    case 'fertilizing':
      return <Sun className="w-4 h-4 text-yellow-500" />;
    case 'pruning':
      return <Scissors className="w-4 h-4 text-green-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

export default function SmartCalendarReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    plantName: '',
    task: '',
    type: 'watering'
  });

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const addReminder = () => {
    if (!newReminder.plantName || !newReminder.task) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      plantName: newReminder.plantName,
      task: newReminder.task,
      date: new Date(),
      completed: false,
      type: newReminder.type as 'watering' | 'fertilizing' | 'pruning' | 'other'
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({ plantName: '', task: '', type: 'watering' });
    setShowAddForm(false);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Smart Calendar</h2>
        <Calendar className="w-6 h-6 text-green-600" />
      </div>

      <div className="space-y-4">
        {reminders.map(reminder => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              reminder.completed ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">{getTaskIcon(reminder.type)}</div>
                <div>
                  <h3 className="font-medium">{reminder.plantName}</h3>
                  <p className="text-sm text-gray-600">{reminder.task}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(reminder.date)}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={reminder.completed}
                onChange={() => toggleReminder(reminder.id)}
                className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
            </div>
          </motion.div>
        ))}

        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 border rounded-lg space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plant Name
              </label>
              <input
                type="text"
                value={newReminder.plantName}
                onChange={e => setNewReminder(prev => ({ ...prev, plantName: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="Enter plant name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task
              </label>
              <input
                type="text"
                value={newReminder.task}
                onChange={e => setNewReminder(prev => ({ ...prev, task: e.target.value }))}
                className="w-full p-2 border rounded-md"
                placeholder="Enter task"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Type
              </label>
              <select
                value={newReminder.type}
                onChange={e => setNewReminder(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="watering">Watering</option>
                <option value="fertilizing">Fertilizing</option>
                <option value="pruning">Pruning</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addReminder}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Reminder
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-600 hover:text-green-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Reminder</span>
          </button>
        )}
      </div>
    </div>
  );
}
