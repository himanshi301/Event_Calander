
import { useDrop } from 'react-dnd';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/stores/calendarStore';
import { EventCard } from './EventCard';
import { CalendarEvent } from '@/types/calendar';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export const CalendarDay = ({ date, isCurrentMonth, isToday, isWeekend }: CalendarDayProps) => {
  const { allEventsWithRecurrence, filteredEvents, eventFilters, setSelectedDate, setShowEventModal, setEditingEvent, updateEvent } = useCalendarStore();

  // Use filtered events if filters are active, otherwise use all events with recurrence
  const eventsToShow = eventFilters && (eventFilters.search || eventFilters.categories.length > 0 || eventFilters.colors.length > 0)
    ? filteredEvents
    : allEventsWithRecurrence;

  const dayEvents = eventsToShow.filter(
    (event) => event.date === format(date, 'yyyy-MM-dd')
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'event',
    drop: (item: { event: CalendarEvent }) => {
      const newDate = format(date, 'yyyy-MM-dd');
      if (item.event.date !== newDate) {
        // If it's a recurring event instance, update the parent event
        const eventToUpdate = item.event.parentEventId || item.event.id;
        updateEvent(eventToUpdate, { date: newDate });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleDayClick = () => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowEventModal(true);
  };

  return (
    <div
      ref={drop}
      className={cn(
        "min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50",
        !isCurrentMonth && "bg-gray-50/50 text-gray-400",
        isWeekend && isCurrentMonth && "bg-blue-50/30",
        isToday && "bg-gradient-to-br from-purple-100 to-blue-100",
        isOver && "bg-green-100 border-green-300 border-2"
      )}
      onClick={handleDayClick}
    >
      <div className="flex flex-col h-full">
        <div
          className={cn(
            "text-sm font-medium mb-1",
            isToday && "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
          )}
        >
          {format(date, 'd')}
        </div>
        
        <div className="flex-1 space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              isCompact 
              showRecurrenceIndicator={!!event.parentEventId}
            />
          ))}
          
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 font-medium">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
