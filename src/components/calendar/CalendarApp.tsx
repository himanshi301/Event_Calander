
import { useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { EventModal } from './EventModal';
import { DragDropProvider } from './DragDropProvider';
import { useCalendarStore } from '@/stores/calendarStore';

export const CalendarApp = () => {
  const { loadEvents } = useCalendarStore();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <DragDropProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <CalendarHeader />
          <CalendarGrid />
          <EventModal />
        </div>
      </div>
    </DragDropProvider>
  );
};
