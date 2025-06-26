
import { useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { CalendarDay } from './CalendarDay';
import { EventFilters } from './EventFilters';
import { useCalendarStore } from '@/stores/calendarStore';

export const CalendarGrid = () => {
  const { currentMonth, generateRecurringEventsForView } = useCalendarStore();

  useEffect(() => {
    generateRecurringEventsForView();
  }, [currentMonth, generateRecurringEventsForView]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <EventFilters />
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with day names */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <CalendarDay
              key={day.toISOString()}
              date={day}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isToday={isToday(day)}
              isWeekend={day.getDay() === 0 || day.getDay() === 6}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
