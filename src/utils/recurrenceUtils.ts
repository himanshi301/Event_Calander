
import { addDays, addWeeks, addMonths, addYears, isBefore, isAfter, format } from 'date-fns';
import { CalendarEvent, EventRecurrence } from '@/types/calendar';

export const generateRecurringEvents = (
  baseEvent: CalendarEvent,
  startDate: Date,
  endDate: Date
): CalendarEvent[] => {
  if (!baseEvent.recurrence || !baseEvent.isRecurring) {
    return [baseEvent];
  }

  const events: CalendarEvent[] = [];
  const recurrence = baseEvent.recurrence;
  let currentDate = new Date(baseEvent.date);
  let occurrenceCount = 0;

  // Add the original event
  events.push(baseEvent);

  while (isBefore(currentDate, endDate)) {
    // Calculate next occurrence
    switch (recurrence.type) {
      case 'daily':
        currentDate = addDays(currentDate, recurrence.interval);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, recurrence.interval);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, recurrence.interval);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, recurrence.interval);
        break;
      default:
        return events;
    }

    occurrenceCount++;

    // Check end conditions
    if (recurrence.endDate && isAfter(currentDate, new Date(recurrence.endDate))) {
      break;
    }
    if (recurrence.endAfter && occurrenceCount >= recurrence.endAfter) {
      break;
    }

    // Only add events within the view range
    if (!isBefore(currentDate, startDate) && !isAfter(currentDate, endDate)) {
      const recurringEvent: CalendarEvent = {
        ...baseEvent,
        id: `${baseEvent.id}-${format(currentDate, 'yyyy-MM-dd')}`,
        date: format(currentDate, 'yyyy-MM-dd'),
        parentEventId: baseEvent.id,
      };
      events.push(recurringEvent);
    }
  }

  return events;
};

export const getRecurrenceText = (recurrence: EventRecurrence): string => {
  const { type, interval, endDate, endAfter } = recurrence;
  
  let text = '';
  
  if (interval === 1) {
    switch (type) {
      case 'daily':
        text = 'Daily';
        break;
      case 'weekly':
        text = 'Weekly';
        break;
      case 'monthly':
        text = 'Monthly';
        break;
      case 'yearly':
        text = 'Yearly';
        break;
    }
  } else {
    switch (type) {
      case 'daily':
        text = `Every ${interval} days`;
        break;
      case 'weekly':
        text = `Every ${interval} weeks`;
        break;
      case 'monthly':
        text = `Every ${interval} months`;
        break;
      case 'yearly':
        text = `Every ${interval} years`;
        break;
    }
  }

  if (endDate) {
    text += ` until ${format(new Date(endDate), 'MMM d, yyyy')}`;
  } else if (endAfter) {
    text += ` for ${endAfter} occurrences`;
  }

  return text;
};
