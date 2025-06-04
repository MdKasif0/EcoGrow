'use client';

import { useState } from 'react';
import GrowCalendar from '@/components/calendar/GrowCalendar';
import TodayTasks from '@/components/calendar/TodayTasks';
import ReminderPreferences from '@/components/calendar/ReminderPreferences';

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'today' | 'preferences'>('calendar');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Smart Calendar & Reminders</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'calendar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'today'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today's Tasks
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'preferences'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {activeTab === 'calendar' && <GrowCalendar />}
        {activeTab === 'today' && <TodayTasks />}
        {activeTab === 'preferences' && <ReminderPreferences />}
      </div>
    </div>
  );
} 