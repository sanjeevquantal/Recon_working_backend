
import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Plus,
  FileUp,
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ValidationRule } from '@/types';
import ValidationRuleForm from './ValidationRuleForm';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

interface ValidationRulesListProps {
  rules: ValidationRule[];
  onRuleAdd: (rule: ValidationRule) => void;
  onRuleUpdate: (rule: ValidationRule) => void;
  onRuleDelete: (ruleId: string) => void;
}

const ValidationRulesList: React.FC<ValidationRulesListProps> = ({
  rules,
  onRuleAdd,
  onRuleUpdate,
  onRuleDelete
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ValidationRule | null>(null);
  const { toast } = useToast();

  const handleAddRule = (rule: ValidationRule) => {
    onRuleAdd(rule);
    setIsAddDialogOpen(false);
    toast({
      title: "Rule added",
      description: `Validation rule "${rule.name}" has been added.`,
    });
  };

  const handleUpdateRule = (rule: ValidationRule) => {
    onRuleUpdate(rule);
    setEditingRule(null);
    toast({
      title: "Rule updated",
      description: `Validation rule "${rule.name}" has been updated.`,
    });
  };

  const handleDeleteRule = (ruleId: string, ruleName: string) => {
    onRuleDelete(ruleId);
    toast({
      title: "Rule deleted",
      description: `Validation rule "${ruleName}" has been deleted.`,
    });
  };

  const getRuleTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      'min-max': 'bg-blue-100 text-blue-800',
      'ratio': 'bg-amber-100 text-amber-800',
      'equality': 'bg-green-100 text-green-800',
      'presence': 'bg-purple-100 text-purple-800',
      'custom': 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge variant="outline" className={`${typeColors[type] || ''} rounded-md font-normal`}>
        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
      </Badge>
    );
  };

  const handleImportRules = () => {
    toast({
      title: "Import initiated",
      description: "The system will now scan uploaded documents to extract validation rules.",
    });
    // In a real system, this would trigger the Intelligence Engine to process PDFs
  };

  const handleExportRules = () => {
    toast({
      title: "Rules exported",
      description: "Validation rules have been exported.",
    });
    // In a real system, this would download a file with the rules
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Validation Rules</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportRules}
            className="flex items-center gap-1"
          >
            <FileUp className="h-4 w-4" />
            <span className="hidden sm:inline">Import Rules</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportRules}
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">Export Rules</span>
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Rule</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Validation Rule</DialogTitle>
              </DialogHeader>
              <ValidationRuleForm 
                onSubmit={handleAddRule} 
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {rules.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No validation rules defined yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add rules to validate and reconcile your data.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>{getRuleTypeBadge(rule.type)}</TableCell>
                <TableCell className="text-muted-foreground truncate max-w-[400px]">
                  {rule.description}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={() => setEditingRule(rule)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Validation Rule</DialogTitle>
                          </DialogHeader>
                          {editingRule && (
                            <ValidationRuleForm
                              initialData={editingRule}
                              onSubmit={handleUpdateRule}
                              onCancel={() => setEditingRule(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <DropdownMenuItem onSelect={() => handleDeleteRule(rule.id, rule.name)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ValidationRulesList;
