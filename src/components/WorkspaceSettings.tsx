
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from '@/components/FileUpload';

interface WorkspaceSettingsProps {
  workspaceId: string;
}

const WorkspaceSettings = ({ workspaceId }: WorkspaceSettingsProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [mappingTemplate, setMappingTemplate] = useState<File | null>(null);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      workspaceName: 'Samsung Brand EMI Program',
      description: 'Daily reconciliation for Samsung Brand EMI transactions',
      frequency: 'daily',
      autoProcess: true,
      notifyExceptions: true,
      notifyEmails: 'admin@example.com, analyst@example.com',
      primaryKey: 'loan_id',
      dateFormat: 'MM/DD/YYYY',
      threshold: '95',
      timeZone: 'Asia/Kolkata',
    }
  });

  const handleSaveSettings = (values: any) => {
    console.log('Saving settings:', values);
    toast({
      title: "Settings saved",
      description: "Your workspace settings have been updated successfully.",
    });
  };

  const handleColumnMappingSave = () => {
    toast({
      title: "Column mappings saved",
      description: "Your column mapping configuration has been updated.",
    });
  };

  const handleUploadTemplate = () => {
    if (!mappingTemplate) {
      toast({
        title: "Missing template file",
        description: "Please select a mapping template file to upload",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template uploaded",
      description: "Your mapping template has been uploaded successfully.",
    });
  };

  const columnMappings = [
    { sourceColumn: 'customer_id', targetColumn: 'Customer ID', status: 'matched' },
    { sourceColumn: 'loan_id', targetColumn: 'Loan Number', status: 'matched' },
    { sourceColumn: 'loan_amount', targetColumn: 'Principal Amount', status: 'matched' },
    { sourceColumn: 'tenure', targetColumn: 'Tenure (Months)', status: 'matched' },
    { sourceColumn: 'rate', targetColumn: 'Interest Rate', status: 'matched' },
    { sourceColumn: 'emi', targetColumn: 'EMI Amount', status: 'unmatched' },
    { sourceColumn: 'processing_fee', targetColumn: '', status: 'missing' },
    { sourceColumn: '', targetColumn: 'Dealer Code', status: 'missing' },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-black/30 border border-white/10">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="columns">Column Mapping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>
                Basic information about your reconciliation workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveSettings)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="workspaceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workspace Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-black/30 border-white/20" />
                          </FormControl>
                          <FormDescription>The name of your reconciliation workspace</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-black/30 border-white/20" />
                          </FormControl>
                          <FormDescription>Brief description of the reconciliation purpose</FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reconciliation Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-black/30 border-white/20">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>How often reconciliation should occur</FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="primaryKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Key Field</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-black/30 border-white/20" />
                          </FormControl>
                          <FormDescription>Field used to match records between sources</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="autoProcess"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-black/20 border-white/10">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Automatic Processing</FormLabel>
                            <FormDescription>
                              Automatically process uploaded files when both sources are available
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Match Threshold (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="100" {...field} className="bg-black/30 border-white/20" />
                          </FormControl>
                          <FormDescription>Minimum percentage for successful reconciliation</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Format</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-black/30 border-white/20">
                                <SelectValue placeholder="Select date format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                              <SelectItem value="DD-MMM-YYYY">DD-MMM-YYYY</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Format for date fields in your data sources</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Zone</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-black/30 border-white/20">
                                <SelectValue placeholder="Select time zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                              <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                              <SelectItem value="America/New_York">America/New_York (GMT-4)</SelectItem>
                              <SelectItem value="Europe/London">Europe/London (GMT+1)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Time zone for reporting and scheduling</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="gradient-btn">Save Settings</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Column Mapping */}
        <TabsContent value="columns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Column Mapping Configuration</CardTitle>
              <CardDescription>
                Define how columns from different sources should be mapped for reconciliation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-3 text-left font-medium">Source 1 Column</th>
                        <th className="pb-3 text-left font-medium">Source 2 Column</th>
                        <th className="pb-3 text-left font-medium">Status</th>
                        <th className="pb-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {columnMappings.map((mapping, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-muted/20">
                          <td className="py-3">
                            <Input 
                              value={mapping.sourceColumn} 
                              className="bg-black/30 border-white/20"
                            />
                          </td>
                          <td className="py-3">
                            <Input 
                              value={mapping.targetColumn} 
                              className="bg-black/30 border-white/20"
                            />
                          </td>
                          <td className="py-3">
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
                              mapping.status === 'matched' ? 'bg-green-100 text-green-800' :
                              mapping.status === 'unmatched' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {mapping.status === 'matched' ? 'Matched' :
                               mapping.status === 'unmatched' ? 'Unmatched' : 'Missing'}
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between">
                  <div>
                    <Button variant="outline" className="border-white/20">
                      <span>Add Column Mapping</span>
                    </Button>
                  </div>
                  <div>
                    <Button onClick={handleColumnMappingSave} className="gradient-btn">
                      Save Mappings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample File Analysis</CardTitle>
              <CardDescription>
                Upload a sample file to automatically detect columns and create mappings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FileUpload 
                  label="Sample Data File"
                  onFileChange={(file) => setSampleFile(file)}
                  accept=".xlsx,.xls,.csv"
                />

                <div className="flex justify-end">
                  <Button 
                    className="gradient-btn"
                    disabled={!sampleFile}
                  >
                    Analyze Structure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure when and how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notifyExceptions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-black/20 border-white/10">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Exception Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications when reconciliation exceptions are detected
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notifyEmails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Recipients</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-black/30 border-white/20" />
                          </FormControl>
                          <FormDescription>Comma-separated email addresses to receive notifications</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'reconciliation_complete', label: 'Reconciliation Complete' },
                        { id: 'exceptions_detected', label: 'Exceptions Detected' },
                        { id: 'rules_violation', label: 'Validation Rules Violation' },
                        { id: 'file_upload', label: 'File Upload Confirmation' }
                      ].map((event) => (
                        <div key={event.id} className="flex items-center space-x-2">
                          <Checkbox id={event.id} defaultChecked={event.id !== 'file_upload'} />
                          <label
                            htmlFor={event.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {event.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="gradient-btn">Save Notification Settings</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mapping Templates</CardTitle>
              <CardDescription>
                Save and manage column mapping templates for reuse across workspaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-black/20 border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Samsung EMI Template</CardTitle>
                      <CardDescription className="text-xs">Last modified: 2023-10-12</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">
                        12 column mappings defined
                      </p>
                    </CardContent>
                    <div className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" className="text-xs border-white/20">Apply</Button>
                      <Button variant="ghost" size="sm" className="text-xs">Export</Button>
                    </div>
                  </Card>

                  <Card className="bg-black/20 border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Default Consumer Loans</CardTitle>
                      <CardDescription className="text-xs">Last modified: 2023-09-28</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">
                        8 column mappings defined
                      </p>
                    </CardContent>
                    <div className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" className="text-xs border-white/20">Apply</Button>
                      <Button variant="ghost" size="sm" className="text-xs">Export</Button>
                    </div>
                  </Card>

                  <Card className="border-dashed border-2 bg-transparent border-white/20 flex flex-col justify-center items-center py-6">
                    <div className="text-center space-y-2">
                      <div className="rounded-full bg-black/30 w-10 h-10 mx-auto flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.5 0.875C7.5 0.875 7.5 0.875 7.5 0.875C7.22386 0.875 7 1.09886 7 1.375V7H1.375C1.375 7 1.375 7 1.375 7C1.09886 7 0.875 7.22386 0.875 7.5C0.875 7.77614 1.09886 8 1.375 8H7V13.625C7 13.625 7 13.625 7 13.625C7 13.9011 7.22386 14.125 7.5 14.125C7.77614 14.125 8 13.9011 8 13.625V8H13.625C13.625 8 13.625 8 13.625 8C13.9011 8 14.125 7.77614 14.125 7.5C14.125 7.22386 13.9011 7 13.625 7H8V1.375C8 1.375 8 1.375 8 1.375C8 1.09886 7.77614 0.875 7.5 0.875Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Create New Template</p>
                        <p className="text-xs text-muted-foreground">
                          Save current mappings as template
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Import Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <FileUpload 
                        label="Upload Template File"
                        onFileChange={(file) => setMappingTemplate(file)}
                        accept=".json,.xml,.csv"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={handleUploadTemplate}
                        disabled={!mappingTemplate}
                        className="w-full gradient-btn"
                      >
                        Import Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspaceSettings;
