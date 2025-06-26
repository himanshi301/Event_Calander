
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time?: string; // HH:MM format
  description?: string;
  color: string; // hex color code
  category?: string;
  recurrence?: EventRecurrence;
  isRecurring?: boolean;
  parentEventId?: string; // For recurring event instances
}

export interface EventRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number; // Every X days/weeks/months/years
  endDate?: string; // ISO date string when recurrence stops
  endAfter?: number; // Number of occurrences
  daysOfWeek?: number[]; // For weekly recurrence (0=Sunday, 1=Monday, etc.)
  dayOfMonth?: number; // For monthly recurrence
  monthOfYear?: number; // For yearly recurrence
}

export interface CalendarState {
  events: CalendarEvent[];
  selectedDate: Date;
  currentMonth: Date;
  showEventModal: boolean;
  editingEvent: CalendarEvent | null;
}
