
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCalendarStore } from '@/stores/calendarStore';
import { CalendarEvent, EventRecurrence } from '@/types/calendar';
import { RecurrenceForm } from './RecurrenceForm';
import { ConflictWarning } from './ConflictWarning';
import { getRecurrenceText } from '@/utils/recurrenceUtils';
import { EventConflict } from '@/utils/conflictUtils';

const EVENT_COLORS = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#EC4899', // Pink
];

const CATEGORIES = [
  'Work',
  'Personal',
  'Health',
  'Family',
  'Education',
  'Travel',
  'Other'
];

export const EventModal = () => {
  const {
    showEventModal,
    setShowEventModal,
    editingEvent,
    selectedDate,
    addEvent,
    updateEvent,
    deleteEvent,
    checkEventConflicts,
  } = useCalendarStore();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    color: EVENT_COLORS[0],
    category: '',
  });

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<EventRecurrence | null>(null);
  const [conflicts, setConflicts] = useState<EventConflict[]>([]);

  useEffect(() => {
    if (showEventModal) {
      if (editingEvent) {
        setFormData({
          title: editingEvent.title,
          date: editingEvent.date,
          time: editingEvent.time || '',
          description: editingEvent.description || '',
          color: editingEvent.color,
          category: editingEvent.category || '',
        });
        setIsRecurring(editingEvent.isRecurring || false);
        setRecurrence(editingEvent.recurrence || null);
      } else {
        setFormData({
          title: '',
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: '',
          description: '',
          color: EVENT_COLORS[0],
          category: '',
        });
        setIsRecurring(false);
        setRecurrence(null);
      }
      setConflicts([]);
    }
  }, [showEventModal, editingEvent, selectedDate]);

  // Check for conflicts whenever form data changes
  useEffect(() => {
    if (formData.title && formData.date && formData.time) {
      const eventData = {
        ...formData,
        isRecurring,
        recurrence: isRecurring ? recurrence : undefined,
      };
      
      const detectedConflicts = checkEventConflicts(
        eventData, 
        editingEvent?.id
      );
      setConflicts(detectedConflicts);
    } else {
      setConflicts([]);
    }
  }, [formData, isRecurring, recurrence, editingEvent, checkEventConflicts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const eventData = {
      ...formData,
      isRecurring,
      recurrence: isRecurring ? recurrence : undefined,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    setShowEventModal(false);
  };

  const handleDelete = () => {
    if (editingEvent) {
      deleteEvent(editingEvent.id);
      setShowEventModal(false);
    }
  };

  return (
    <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time (Optional)</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div>
            <Label>Event Color</Label>
            <div className="flex gap-2 mt-2">
              {EVENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <RecurrenceForm
            recurrence={recurrence}
            onRecurrenceChange={setRecurrence}
            isRecurring={isRecurring}
            onIsRecurringChange={setIsRecurring}
          />

          {isRecurring && recurrence && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Recurrence:</strong> {getRecurrenceText(recurrence)}
              </p>
            </div>
          )}

          <ConflictWarning conflicts={conflicts} />

          <div className="flex justify-between pt-4">
            {editingEvent && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete Event
              </Button>
            )}
            
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEventModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {conflicts.length > 0 ? 'Save Anyway' : (editingEvent ? 'Update' : 'Create')} Event
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
