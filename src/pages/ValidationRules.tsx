
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InlineValidationRules, { ValidationRule } from '@/components/InlineValidationRules';

const ValidationRules = () => {
  const [reconData, setReconData] = useState<any>(null);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [primaryKey, setPrimaryKey] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedData = sessionStorage.getItem('reconData');
    if (!storedData) {
      toast({
        title: "No recon data found",
        description: "Please start from the beginning",
        variant: "destructive",
      });
      navigate('/create-recon');
      return;
    }
    setReconData(JSON.parse(storedData));
  }, [navigate, toast]);

  const handleValidationRulesChange = (rules: ValidationRule[]) => {
    setValidationRules(rules);
  };

  const handleCreateRecon = async () => {
    if (!reconData) return;

    setIsCreating(true);
    toast({ title: 'Creating recon', description: 'Processing files and setting up reconciliation…' });

    // Simulate API call
    setTimeout(() => {
      const total = Math.floor(Math.random() * 1000) + 200;
      const matched = Math.floor(total * ((Math.random() * 15 + 85) / 100));
      const pending = total - matched;

      const newWorkspace = {
        id: crypto.randomUUID(),
        name: reconData.newWorkspaceName,
        description: `Reconciliation recon for ${reconData.newWorkspaceName}`,
        lastUpdated: new Date().toISOString().split('T')[0],
        pendingExceptions: pending,
        totalRecords: total,
        matchedRecords: matched,
        brand: { name: reconData.newWorkspaceName.split(' ')[0], logo: reconData.brandLogo },
      };

      // Store the new workspace for the dashboard
      const existingWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
      existingWorkspaces.unshift(newWorkspace);
      localStorage.setItem('workspaces', JSON.stringify(existingWorkspaces));

      // Clear session storage
      sessionStorage.removeItem('reconData');

      toast({ 
        title: 'Recon created successfully', 
        description: `"${reconData.newWorkspaceName}" has been created with ${validationRules.length} validation rules and primary key: ${primaryKey || 'None'}`
      });

      navigate('/dashboard');
    }, 2500);
  };

  if (!reconData) {
    return null;
  }

  const availableFields = reconData.matchedFields?.map((field: any) => field.field1) || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/create-recon')} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Recon</h1>
            <p className="text-muted-foreground">Step 2: Validation Rules - {reconData.newWorkspaceName}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Primary Key Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="primary-key">Primary Key</Label>
              <Select value={primaryKey} onValueChange={setPrimaryKey}>
                <SelectTrigger id="primary-key">
                  <SelectValue placeholder="Select a primary key field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field: string) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                The primary key will be used as the unique identifier for matching records between sources.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <InlineValidationRules 
              matchedFields={reconData.matchedFields}
              onValidationRulesChange={handleValidationRulesChange}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate('/create-recon')}
          >
            Back to Field Mapping
          </Button>
          <Button 
            onClick={handleCreateRecon}
            className="gradient-btn"
            disabled={isCreating}
          >
            {isCreating ? 'Creating Recon…' : 'Create Recon'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ValidationRules;
