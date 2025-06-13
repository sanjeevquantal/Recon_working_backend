
import React from 'react';
import { AlertCircle, AlertTriangle, X, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type ExceptionSeverity = 'error' | 'warning' | 'info';

interface ExceptionMessageProps {
  title: string;
  message: string;
  severity?: ExceptionSeverity;
  onDismiss?: () => void;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

const ExceptionMessage: React.FC<ExceptionMessageProps> = ({
  title,
  message,
  severity = 'error',
  onDismiss,
  actions = []
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default'; // Using default with custom styling
      case 'info':
      default:
        return 'default';
    }
  };

  return (
    <Alert 
      variant={getVariant() as any} 
      className={`my-4 relative ${
        severity === 'warning' ? 'border-amber-500 bg-amber-500/10' : 
        severity === 'info' ? 'border-blue-500 bg-blue-500/10' : ''
      }`}
    >
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">{message}</div>
        
        {(actions.length > 0 || onDismiss) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                onClick={action.onClick}
                className="text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </AlertDescription>
      
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="absolute top-2 right-2 h-6 w-6 p-0"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Alert>
  );
};

export default ExceptionMessage;
