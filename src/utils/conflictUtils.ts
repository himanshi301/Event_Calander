
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

export interface EventConflict {
  conflictingEvent: CalendarEvent;
  type: 'overlap' | 'same-time';
}

export const detectEventConflicts = (
  newEvent: Partial<CalendarEvent>,
  existingEvents: CalendarEvent[],
  excludeEventId?: string
): EventConflict[] => {
  const conflicts: EventConflict[] = [];
  
  // If no time is specified, we can't detect time-based conflicts
  if (!newEvent.time || !newEvent.date) {
    return conflicts;
  }

  const newEventTime = parseTime(newEvent.time);
  const newEventDate = newEvent.date;

  existingEvents.forEach(event => {
    // Skip the event being edited
    if (excludeEventId && event.id === excludeEventId) {
      return;
    }

    // Only check events on the same date
    if (event.date === newEventDate && event.time) {
      const existingEventTime = parseTime(event.time);
      
      // Check for exact time match
      if (newEventTime === existingEventTime) {
        conflicts.push({
          conflictingEvent: event,
          type: 'same-time'
        });
      }
      // For now, we'll focus on same-time conflicts
      // Future enhancement could include duration-based overlap detection
    }
  });

  return conflicts;
};

const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes; // Convert to minutes for easy comparison
};

export const getConflictMessage = (conflicts: EventConflict[]): string => {
  if (conflicts.length === 0) return '';
  
  if (conflicts.length === 1) {
    const conflict = conflicts[0];
    return `This event conflicts with "${conflict.conflictingEvent.title}" at ${conflict.conflictingEvent.time}`;
  }
  
  return `This event conflicts with ${conflicts.length} other events at the same time`;
};

export const shouldPreventSave = (conflicts: EventConflict[]): boolean => {
  // For now, we'll show warnings but not prevent saving
  // This can be made configurable based on user preferences
  return false;
};
