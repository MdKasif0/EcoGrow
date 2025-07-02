'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import GrowCalendar from '@/components/calendar/GrowCalendar';
import TodayTasks from '@/components/calendar/TodayTasks';
import ReminderPreferences from '@/components/calendar/ReminderPreferences';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'today' | 'preferences'>('calendar');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold font-serif">Smart Calendar & Reminders</h1>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-primary/10 rounded-lg">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'today'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              Today&apos;s Tasks
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'preferences'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              Preferences
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <GrowCalendar />
            </div>
          )}
          {activeTab === 'today' && (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <TodayTasks />
            </div>
          )}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <ReminderPreferences />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 