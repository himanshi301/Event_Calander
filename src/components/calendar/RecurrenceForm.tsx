
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EventRecurrence } from '@/types/calendar';

interface RecurrenceFormProps {
  recurrence: EventRecurrence | null;
  onRecurrenceChange: (recurrence: EventRecurrence | null) => void;
  isRecurring: boolean;
  onIsRecurringChange: (isRecurring: boolean) => void;
}

export const RecurrenceForm = ({
  recurrence,
  onRecurrenceChange,
  isRecurring,
  onIsRecurringChange,
}: RecurrenceFormProps) => {
  const [endType, setEndType] = useState<'never' | 'date' | 'after'>(
    recurrence?.endDate ? 'date' : recurrence?.endAfter ? 'after' : 'never'
  );

  const handleRecurrenceTypeChange = (type: string) => {
    const newRecurrence: EventRecurrence = {
      type: type as EventRecurrence['type'],
      interval: recurrence?.interval || 1,
      endDate: endType === 'date' ? recurrence?.endDate : undefined,
      endAfter: endType === 'after' ? recurrence?.endAfter : undefined,
    };
    onRecurrenceChange(newRecurrence);
  };

  const handleIntervalChange = (interval: string) => {
    if (recurrence) {
      onRecurrenceChange({
        ...recurrence,
        interval: parseInt(interval) || 1,
      });
    }
  };

  const handleEndTypeChange = (type: string) => {
    setEndType(type as 'never' | 'date' | 'after');
    if (recurrence) {
      const newRecurrence = { ...recurrence };
      if (type === 'never') {
        delete newRecurrence.endDate;
        delete newRecurrence.endAfter;
      } else if (type === 'date') {
        delete newRecurrence.endAfter;
        newRecurrence.endDate = new Date().toISOString().split('T')[0];
      } else if (type === 'after') {
        delete newRecurrence.endDate;
        newRecurrence.endAfter = 5;
      }
      onRecurrenceChange(newRecurrence);
    }
  };

  const handleEndDateChange = (endDate: string) => {
    if (recurrence) {
      onRecurrenceChange({
        ...recurrence,
        endDate,
      });
    }
  };

  const handleEndAfterChange = (endAfter: string) => {
    if (recurrence) {
      onRecurrenceChange({
        ...recurrence,
        endAfter: parseInt(endAfter) || 1,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="recurring"
          checked={isRecurring}
          onChange={(e) => {
            onIsRecurringChange(e.target.checked);
            if (!e.target.checked) {
              onRecurrenceChange(null);
            } else {
              onRecurrenceChange({
                type: 'weekly',
                interval: 1,
              });
            }
          }}
          className="rounded border-gray-300"
        />
        <Label htmlFor="recurring">Recurring Event</Label>
      </div>

      {isRecurring && (
        <div className="space-y-4 border-l-2 border-gray-200 pl-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recurrence-type">Repeat</Label>
              <Select
                value={recurrence?.type || 'weekly'}
                onValueChange={handleRecurrenceTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interval">Every</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                value={recurrence?.interval || 1}
                onChange={(e) => handleIntervalChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label>End Recurrence</Label>
            <RadioGroup value={endType} onValueChange={handleEndTypeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never">Never</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="end-date" />
                <Label htmlFor="end-date">On</Label>
                {endType === 'date' && (
                  <Input
                    type="date"
                    value={recurrence?.endDate || ''}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="ml-2 w-auto"
                  />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="after" id="end-after" />
                <Label htmlFor="end-after">After</Label>
                {endType === 'after' && (
                  <Input
                    type="number"
                    min="1"
                    value={recurrence?.endAfter || 5}
                    onChange={(e) => handleEndAfterChange(e.target.value)}
                    className="ml-2 w-20"
                  />
                )}
                {endType === 'after' && <span className="text-sm text-gray-600">occurrences</span>}
              </div>
            </RadioGroup>
          </div>
        </div>
      )}
    </div>
  );
};
