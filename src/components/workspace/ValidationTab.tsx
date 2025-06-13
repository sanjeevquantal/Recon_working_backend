
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { FileText } from 'lucide-react';
import { ValidationRule } from '@/types';
import ValidationRulesList from '@/components/ValidationRulesList';
import ValidationEntities from '@/components/workspace/ValidationEntities';

interface ValidationTabProps {
  workspaceId: string;
}

const mockValidationRules: ValidationRule[] = [
  {
    id: '1',
    name: 'Interest Rate Range',
    description: 'Validates that interest rates fall within acceptable range of 5-25%',
    type: 'min-max',
    field1: 'interest_rate',
    condition: 'between',
    value: '5-25'
  },
  {
    id: '2',
    name: 'Subvention Ratio Check',
    description: 'Ensures subvention amount is always 25% of the total loan amount',
    type: 'ratio',
    field1: 'subvention_amount',
    field2: 'loan_amount',
    value: '0.25'
  },
  {
    id: '3',
    name: 'Customer ID Presence',
    description: 'Verifies that customer ID is present in both data sources',
    type: 'presence',
    field1: 'customer_id'
  }
];

const ValidationTab: React.FC<ValidationTabProps> = ({ workspaceId }) => {
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(mockValidationRules);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleExtractRules = () => {
    if (!pdfFile) {
      toast({
        title: "Missing file",
        description: "Please upload a PDF with validation rules",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing PDF",
      description: "Extracting validation rules from document...",
    });

    setTimeout(() => {
      const newRule: ValidationRule = {
        id: crypto.randomUUID(),
        name: "Extracted Rule - EMI Calculation",
        description: "Validates EMI calculation matches the formula: P*R*(1+R)^N/((1+R)^N-1)",
        type: "custom",
        field1: "emi_amount,principal,rate,tenure",
        condition: "EMI calculation formula verification"
      };
      
      setValidationRules([...validationRules, newRule]);
      
      toast({
        title: "Extraction complete",
        description: "Successfully extracted 1 validation rule",
      });
      
      setPdfFile(null);
    }, 2000);
  };

  const handleAddRule = (rule: ValidationRule) => {
    setValidationRules([...validationRules, rule]);
  };

  const handleUpdateRule = (updatedRule: ValidationRule) => {
    setValidationRules(
      validationRules.map(rule => 
        rule.id === updatedRule.id ? updatedRule : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setValidationRules(
      validationRules.filter(rule => rule.id !== ruleId)
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Rule Extraction</CardTitle>
          <CardDescription>
            Upload PDF documents with validation rules for automatic extraction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="space-y-2">
                <div className="font-medium">Upload Document</div>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="cursor-pointer"
                  />
                  {pdfFile && (
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {pdfFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleExtractRules} 
                disabled={!pdfFile}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Extract Rules
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
            <p>The Intelligence Engine can automatically extract validation rules from PDF documents containing predefined rule sets. Upload standard rule documents to have them automatically processed and added to your workspace.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Validation Entities</CardTitle>
          <CardDescription>
            Define column mapping for validation between different data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValidationEntities workspaceId={workspaceId} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <ValidationRulesList 
            rules={validationRules}
            onRuleAdd={handleAddRule}
            onRuleUpdate={handleUpdateRule}
            onRuleDelete={handleDeleteRule}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationTab;
