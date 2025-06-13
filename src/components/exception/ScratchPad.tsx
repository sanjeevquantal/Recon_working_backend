
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

interface ScratchPadProps {
  recordId?: string; // Optional - if provided, this is for a specific record
}

const ScratchPad: React.FC<ScratchPadProps> = ({ recordId }) => {
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const storageKey = recordId 
    ? `reconciliation-notes-${recordId}` 
    : 'reconciliation-general-notes';
    
  // Load existing notes when component mounts or recordId changes
  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes('');
    }
  }, [storageKey]);
  
  const handleSave = () => {
    localStorage.setItem(storageKey, notes);
    toast({
      title: "Notes saved",
      description: "Your scratch pad notes have been saved",
    });
    setOpen(false);
  };
  
  const title = recordId 
    ? `Scratch Pad - Record #${recordId}` 
    : "Scratch Pad - General Notes";
    
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Scratch Pad
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <Textarea
            className="min-h-[300px]"
            placeholder="Add your notes here. You can include hyperlinks to offers using [Offer-ID]..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Notes</Button>
          </div>
          
          {/* Display hints for linking to offers */}
          <div className="text-sm text-muted-foreground border-t pt-4 mt-4">
            <p className="font-medium mb-2">Formatting Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Link to offers using [OFF-1001] syntax</li>
              <li>Create bullet points with * at the start of a line</li>
              <li>URLs will automatically be converted to links</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ScratchPad;
