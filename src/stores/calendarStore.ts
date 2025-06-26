
import { create } from 'zustand';
import { CalendarEvent, CalendarState } from '@/types/calendar';
import { generateRecurringEvents } from '@/utils/recurrenceUtils';
import { detectEventConflicts, EventConflict } from '@/utils/conflictUtils';
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

interface EventFilters {
  search: string;
  categories: string[];
  colors: string[];
}

interface CalendarStore extends CalendarState {
  eventFilters: EventFilters | null;
  filteredEvents: CalendarEvent[];
  allEventsWithRecurrence: CalendarEvent[];
  // Actions
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (date: Date) => void;
  setShowEventModal: (show: boolean) => void;
  setEditingEvent: (event: CalendarEvent | null) => void;
  setEventFilters: (filters: EventFilters) => void;
  loadEvents: () => void;
  saveEvents: () => void;
  generateRecurringEventsForView: () => void;
  checkEventConflicts: (event: Partial<CalendarEvent>, excludeEventId?: string) => EventConflict[];
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const EVENT_COLORS = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#EC4899', // Pink
];

const applyFilters = (events: CalendarEvent[], filters: EventFilters | null): CalendarEvent[] => {
  if (!filters) return events;

  return events.filter(event => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        event.title.toLowerCase().includes(searchLower) ||
        (event.description && event.description.toLowerCase().includes(searchLower)) ||
        (event.category && event.category.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!event.category || !filters.categories.includes(event.category)) {
        return false;
      }
    }

    // Color filter
    if (filters.colors.length > 0) {
      if (!filters.colors.includes(event.color)) {
        return false;
      }
    }

    return true;
  });
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  // Initial state
  events: [],
  filteredEvents: [],
  allEventsWithRecurrence: [],
  eventFilters: null,
  selectedDate: new Date(),
  currentMonth: new Date(),
  showEventModal: false,
  editingEvent: null,

  // Actions
  addEvent: (eventData) => {
    const event: CalendarEvent = {
      ...eventData,
      id: generateId(),
      color: eventData.color || EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
    };
    
    set((state) => {
      const newEvents = [...state.events, event];
      return {
        events: newEvents,
      };
    });
    get().generateRecurringEventsForView();
    get().saveEvents();
  },

  updateEvent: (id, updates) => {
    set((state) => {
      const newEvents = state.events.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      );
      return {
        events: newEvents,
      };
    });
    get().generateRecurringEventsForView();
    get().saveEvents();
  },

  deleteEvent: (id) => {
    set((state) => {
      const newEvents = state.events.filter((event) => event.id !== id);
      return {
        events: newEvents,
      };
    });
    get().generateRecurringEventsForView();
    get().saveEvents();
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setCurrentMonth: (date) => {
    set({ currentMonth: date });
    get().generateRecurringEventsForView();
  },
  
  setShowEventModal: (show) => set({ showEventModal: show }),
  setEditingEvent: (event) => set({ editingEvent: event }),

  setEventFilters: (filters) => {
    set((state) => ({
      eventFilters: filters,
      filteredEvents: applyFilters(state.allEventsWithRecurrence, filters),
    }));
  },

  checkEventConflicts: (event, excludeEventId) => {
    const { allEventsWithRecurrence } = get();
    return detectEventConflicts(event, allEventsWithRecurrence, excludeEventId);
  },

  generateRecurringEventsForView: () => {
    const { events, currentMonth, eventFilters } = get();
    
    // Generate view range (current month plus previous and next month for better UX)
    const viewStart = startOfMonth(subMonths(currentMonth, 1));
    const viewEnd = endOfMonth(addMonths(currentMonth, 1));
    
    // Generate all events including recurring instances
    const allEventsWithRecurrence: CalendarEvent[] = [];
    
    events.forEach(event => {
      if (event.isRecurring && event.recurrence) {
        const recurringEvents = generateRecurringEvents(event, viewStart, viewEnd);
        allEventsWithRecurrence.push(...recurringEvents);
      } else {
        allEventsWithRecurrence.push(event);
      }
    });
    
    set({
      allEventsWithRecurrence,
      filteredEvents: applyFilters(allEventsWithRecurrence, eventFilters),
    });
  },

  loadEvents: () => {
    try {
      const stored = localStorage.getItem('calendar-events');
      if (stored) {
        const events = JSON.parse(stored);
        set({ events });
        get().generateRecurringEventsForView();
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  },

  saveEvents: () => {
    try {
      const { events } = get();
      // Only save the base events, not the generated recurring instances
      const baseEvents = events.filter(event => !event.parentEventId);
      localStorage.setItem('calendar-events', JSON.stringify(baseEvents));
    } catch (error) {
      console.error('Failed to save events:', error);
    }
  },
}));
