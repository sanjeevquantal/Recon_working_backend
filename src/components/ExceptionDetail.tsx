
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ExceptionRecord } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ReferenceDataPopup from '@/components/exception/ReferenceDataPopup';
import ScratchPad from '@/components/exception/ScratchPad';
import { 
  CheckCircle, 
  CirclePause, 
  CircleX, 
  Zap
} from 'lucide-react';

interface ExceptionDetailProps {
  exception: ExceptionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (id: string, notes: string, status: 'resolved' | 'in-suspense' | 'closed') => void;
}

const ExceptionDetail = ({ exception, isOpen, onClose, onResolve }: ExceptionDetailProps) => {
  const [notes, setNotes] = useState('');
  const [recommendedAction, setRecommendedAction] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (status: 'resolved' | 'in-suspense' | 'closed') => {
    if (exception) {
      onResolve(exception.id, notes, status);
      onClose();
    }
  };

  const handleRecommendation = () => {
    if (!exception) return;
    
    setIsRecommending(true);
    toast({
      title: "Processing",
      description: "Generating recommendations...",
    });
    
    // Simulate AI recommendation (would be a real API call in production)
    setTimeout(() => {
      const recommendations = [
        "Discrepancy appears to be due to timing difference between systems. Recommend marking as in-suspense and checking next cycle.",
        "Values differ by exact percentage that matches the current promotion. Verify if promotional discount was applied correctly.",
        "Missing record in source 2. Likely due to batch processing delay. Recommend checking again in 24 hours."
      ];
      
      const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
      setRecommendedAction(randomRecommendation);
      setIsRecommending(false);
      
      toast({
        title: "Recommendation Ready",
        description: "AI recommendation has been generated",
      });
    }, 1500);
  };

  if (!exception) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Exception Details</DialogTitle>
          <DialogDescription>
            Review and resolve the reconciliation exception
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">Record ID</h3>
              <p className="text-sm text-muted-foreground">{exception.recordId}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Status</h3>
              <p className={`text-sm ${
                exception.status === 'open' 
                  ? 'text-amber-600' 
                  : exception.status === 'resolved' 
                    ? 'text-green-600' 
                    : exception.status === 'in-suspense'
                      ? 'text-blue-600'
                      : 'text-red-600'
              }`}>
                {exception.status.charAt(0).toUpperCase() + exception.status.slice(1)}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Validation Rule</h3>
            <p className="text-sm text-muted-foreground">{exception.rule}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">Source 1 Value</h3>
              <p className="text-sm font-mono bg-muted p-2 rounded">{exception.source1Value}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Source 2 Value</h3>
              <p className="text-sm font-mono bg-muted p-2 rounded">{exception.source2Value}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRecommendation}
              disabled={isRecommending}
            >
              <Zap className="h-4 w-4 mr-2" />
              Auto-Recommend
            </Button>
            <ReferenceDataPopup recordId={exception.recordId} />
            <ScratchPad recordId={exception.recordId} />
          </div>
          
          {recommendedAction && (
            <div className="bg-muted/50 p-3 border rounded-md">
              <h3 className="font-medium mb-1">AI Recommendation</h3>
              <p className="text-sm">{recommendedAction}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-1">Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this exception and how it was resolved..."
              className="h-24"
            />
          </div>
        </div>
        
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('in-suspense')}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <CirclePause className="h-4 w-4 mr-2" />
                Mark In-Suspense
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('closed')}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <CircleX className="h-4 w-4 mr-2" />
                Close
              </Button>
              <Button 
                onClick={() => handleStatusChange('resolved')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExceptionDetail;
