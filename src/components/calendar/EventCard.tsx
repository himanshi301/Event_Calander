
import { useDrag } from 'react-dnd';
import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/stores/calendarStore';
import { Repeat } from 'lucide-react';

interface EventCardProps {
  event: CalendarEvent;
  isCompact?: boolean;
  showRecurrenceIndicator?: boolean;
}

export const EventCard = ({ event, isCompact = false, showRecurrenceIndicator = false }: EventCardProps) => {
  const { setEditingEvent, setShowEventModal } = useCalendarStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'event',
    item: { event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setShowEventModal(true);
  };

  return (
    <div
      ref={drag}
      onClick={handleEventClick}
      className={cn(
        "px-2 py-1 rounded-md text-white text-xs font-medium cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105",
        isCompact ? "truncate" : "mb-1",
        isDragging && "opacity-50 scale-95"
      )}
      style={{ backgroundColor: event.color }}
      title={`${event.title}${event.time ? ` at ${event.time}` : ''}${showRecurrenceIndicator ? ' (Recurring)' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="truncate">
          {event.time && !isCompact && (
            <span className="opacity-90 mr-1">{event.time}</span>
          )}
          {event.title}
        </span>
        {(event.isRecurring || showRecurrenceIndicator) && (
          <Repeat className="w-3 h-3 ml-1 opacity-80 flex-shrink-0" />
        )}
      </div>
    </div>
  );
};
