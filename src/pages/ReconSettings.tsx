
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Check, FileText, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

const ReconSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  const [autoMatchingRules, setAutoMatchingRules] = useState([
    { id: 1, name: 'Date Match', description: 'Match transaction date within 1 day', enabled: true },
    { id: 2, name: 'Amount Match', description: 'Match exact transaction amount', enabled: true },
    { id: 3, name: 'Reference Match', description: 'Match transaction reference number', enabled: true },
    { id: 4, name: 'Fuzzy Match', description: 'Use fuzzy logic for approximate matches', enabled: false },
  ]);

  const [defaultValidationRules, setDefaultValidationRules] = useState([
    { id: 1, name: 'Date Range', description: 'Transaction date must be within last 60 days', enabled: true },
    { id: 2, name: 'Amount Threshold', description: 'Transaction amount must not exceed ₹500,000', enabled: true },
    { id: 3, name: 'Reference Format', description: 'Reference number must follow standard pattern', enabled: true },
  ]);

  const [dataPreprocessing, setDataPreprocessing] = useState([
    { id: 1, name: 'Remove special characters', enabled: true },
    { id: 2, name: 'Standardize date formats', enabled: true },
    { id: 3, name: 'Normalize currency amounts', enabled: true },
    { id: 4, name: 'Convert case to uppercase', enabled: false },
  ]);

  const toggleRule = (ruleType, id) => {
    if (ruleType === 'matching') {
      setAutoMatchingRules(autoMatchingRules.map(rule => 
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      ));
    } else if (ruleType === 'validation') {
      setDefaultValidationRules(defaultValidationRules.map(rule => 
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      ));
    } else if (ruleType === 'preprocessing') {
      setDataPreprocessing(dataPreprocessing.map(rule => 
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      ));
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your reconciliation settings have been updated.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Reconciliation Settings</h1>
          <p className="text-muted-foreground">
            Configure global settings for all reconciliation processes
          </p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="rules">Default Rules</TabsTrigger>
          <TabsTrigger value="preprocessing">Data Preprocessing</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Reconciliation Settings</CardTitle>
              <CardDescription>
                Configure the default settings for all reconciliation processes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Processing</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-matching">Enable Auto-Matching</Label>
                      <Switch id="auto-matching" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-validation">Enable Auto-Validation</Label>
                      <Switch id="auto-validation" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-exception">Auto-Exception Handling</Label>
                      <Switch id="auto-exception" />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6">File Processing</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="max-file-size">Maximum File Size (MB)</Label>
                      <Input id="max-file-size" type="number" defaultValue={10} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="supported-formats">Supported File Formats</Label>
                      <Input id="supported-formats" defaultValue="xlsx, csv, xls" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Thresholds</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="match-threshold">Match Threshold (%)</Label>
                      <Input id="match-threshold" type="number" defaultValue={95} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="date-variance">Date Variance (days)</Label>
                      <Input id="date-variance" type="number" defaultValue={1} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="amount-variance">Amount Variance (%)</Label>
                      <Input id="amount-variance" type="number" defaultValue={0.5} />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6">Processing Schedule</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="processing-frequency">Default Processing Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="processing-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="processing-time">Default Processing Time</Label>
                      <Input id="processing-time" type="time" defaultValue="01:00" />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="gradient-btn mt-6">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Default Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Default Reconciliation Rules</CardTitle>
              <CardDescription>
                Configure the default rules that will be applied to all new reconciliation workspaces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Auto-Matching Rules</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Rule Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px] text-center">Enabled</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {autoMatchingRules.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell>{rule.description}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={rule.enabled}
                              onCheckedChange={() => toggleRule('matching', rule.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Default Validation Rules</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Rule Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px] text-center">Enabled</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {defaultValidationRules.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell>{rule.description}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={rule.enabled}
                              onCheckedChange={() => toggleRule('validation', rule.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Button onClick={handleSaveSettings} className="gradient-btn mt-4">Save Rules</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Preprocessing Tab */}
        <TabsContent value="preprocessing">
          <Card>
            <CardHeader>
              <CardTitle>Data Preprocessing Settings</CardTitle>
              <CardDescription>
                Configure how data is preprocessed before reconciliation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Text Processing Rules</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rule</TableHead>
                        <TableHead className="w-[100px] text-center">Enabled</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataPreprocessing.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell>{rule.name}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={rule.enabled}
                              onCheckedChange={() => toggleRule('preprocessing', rule.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Column Defaults</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="date-format">Default Date Format</Label>
                      <Select defaultValue="iso">
                        <SelectTrigger id="date-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="iso">ISO (YYYY-MM-DD)</SelectItem>
                          <SelectItem value="us">US (MM/DD/YYYY)</SelectItem>
                          <SelectItem value="uk">UK (DD/MM/YYYY)</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="amount-format">Default Amount Format</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="amount-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (1,234.56)</SelectItem>
                          <SelectItem value="european">European (1.234,56)</SelectItem>
                          <SelectItem value="indian">Indian (1,23,456.78)</SelectItem>
                          <SelectItem value="plain">Plain (1234.56)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="column-headers">Header Row Detection</Label>
                      <Select defaultValue="first">
                        <SelectTrigger id="column-headers">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first">First Row</SelectItem>
                          <SelectItem value="second">Second Row</SelectItem>
                          <SelectItem value="auto">Auto-Detect</SelectItem>
                          <SelectItem value="custom">Custom Row</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="gradient-btn mt-6">Save Preprocessing Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Configuration Tab */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Engine Configuration</CardTitle>
              <CardDescription>
                Configure the AI engine settings for intelligent reconciliation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Intelligence Engine Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-enabled">Enable AI Engine</Label>
                      <Switch id="ai-enabled" defaultChecked />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confidence-threshold">Confidence Threshold (%)</Label>
                      <Input id="confidence-threshold" type="number" defaultValue={85} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-learn">Adaptive Learning</Label>
                      <Switch id="auto-learn" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-correct">Auto-Correction</Label>
                      <Switch id="auto-correct" defaultChecked />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6">Data Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pattern-detection">Pattern Detection</Label>
                      <Switch id="pattern-detection" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="anomaly-detection">Anomaly Detection</Label>
                      <Switch id="anomaly-detection" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trend-analysis">Trend Analysis</Label>
                      <Switch id="trend-analysis" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Model Configuration</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="model-selection">AI Model</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="model-selection">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="training-frequency">Training Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger id="training-frequency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6">API Integration</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="api-key">Intelligence Engine API Key</Label>
                      <Input id="api-key" type="password" value="•••••••••••••••••••" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="api-endpoint">API Endpoint</Label>
                      <Input id="api-endpoint" defaultValue="https://api.intelligence-engine.com/v1" />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="gradient-btn mt-6">Save AI Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ReconSettings;
