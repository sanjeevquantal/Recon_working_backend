
import React, { useState } from 'react';
import { 
  Table, 
  TableBody,
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ValidationEntity {
  id: string;
  serialNo: number;
  sourceField1: string;
  sourceField2: string;
}

interface ValidationEntitiesProps {
  workspaceId: string;
}

// Mock field options for the dropdowns
const mockFieldOptions = [
  { value: 'item_date', label: 'Item Date' },
  { value: 'purchase_date', label: 'Purchase Date' },
  { value: 'order_reference', label: 'Order Reference' },
  { value: 'invoice_number', label: 'Invoice Number' },
  { value: 'amount', label: 'Amount' },
  { value: 'emi', label: 'EMI' },
];

const ValidationEntities: React.FC<ValidationEntitiesProps> = ({ workspaceId }) => {
  // Initial mock data for validation entities
  const [entities, setEntities] = useState<ValidationEntity[]>([
    {
      id: '1',
      serialNo: 1,
      sourceField1: 'amount',
      sourceField2: 'amount'
    },
    {
      id: '2',
      serialNo: 2,
      sourceField1: 'emi',
      sourceField2: 'emi'
    }
  ]);
  
  const { toast } = useToast();

  const handleAddEntity = () => {
    const newEntity: ValidationEntity = {
      id: crypto.randomUUID(),
      serialNo: entities.length + 1,
      sourceField1: '',
      sourceField2: ''
    };
    
    setEntities([...entities, newEntity]);
  };

  const handleDeleteEntity = (id: string) => {
    const updatedEntities = entities
      .filter(entity => entity.id !== id)
      .map((entity, index) => ({
        ...entity,
        serialNo: index + 1
      }));
    
    setEntities(updatedEntities);
    
    toast({
      title: "Entity removed",
      description: "Validation entity has been removed successfully.",
    });
  };

  const handleChangeField = (entityId: string, field: 'sourceField1' | 'sourceField2', value: string) => {
    setEntities(
      entities.map(entity => 
        entity.id === entityId 
          ? { ...entity, [field]: value }
          : entity
      )
    );
  };

  const getSourceFieldName = (fieldKey: string) => {
    const field = mockFieldOptions.find(option => option.value === fieldKey);
    return field ? field.label : fieldKey;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Compared Entities</h3>
          <p className="text-sm text-muted-foreground">Define which fields should be compared and validated between data sources</p>
        </div>
        <Button 
          onClick={handleAddEntity} 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Entity
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Sr No.</TableHead>
              <TableHead>Recon_File01.xlsx</TableHead>
              <TableHead>Recon_File02.xlsx</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.map((entity) => (
              <TableRow key={entity.id}>
                <TableCell>{entity.serialNo}</TableCell>
                <TableCell>
                  <Select 
                    value={entity.sourceField1} 
                    onValueChange={(value) => handleChangeField(entity.id, 'sourceField1', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFieldOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={entity.sourceField2}
                    onValueChange={(value) => handleChangeField(entity.id, 'sourceField2', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFieldOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEntity(entity.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md mt-4">
        <p>These mappings will be used to determine which columns should be compared between the two data sources during the validation process. The Intelligence Engine will automatically suggest matches based on column names and data patterns.</p>
      </div>
    </div>
  );
};

export default ValidationEntities;
