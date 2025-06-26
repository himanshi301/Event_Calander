
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { EventConflict, getConflictMessage } from '@/utils/conflictUtils';

interface ConflictWarningProps {
  conflicts: EventConflict[];
}

export const ConflictWarning = ({ conflicts }: ConflictWarningProps) => {
  if (conflicts.length === 0) return null;

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Event Conflict Detected</AlertTitle>
      <AlertDescription>
        {getConflictMessage(conflicts)}
        <div className="mt-2 text-sm">
          {conflicts.map((conflict, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: conflict.conflictingEvent.color }}
              />
              <span>
                {conflict.conflictingEvent.title} at {conflict.conflictingEvent.time}
              </span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};
