
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, CheckCircle2, PlusCircle, Search, Settings, Upload } from 'lucide-react';

const ReportingSettings = () => {
  const [activeTab, setActiveTab] = useState('email');
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    dailySummary: true,
    exceptionAlerts: true,
    weeklyDigest: false,
    recipientEmail: 'admin@example.com',
    ccEmail: 'team@example.com'
  });
  const [pdfSettings, setPdfSettings] = useState({
    enabled: true,
    includeCharts: true,
    includeRawData: false,
    detailedExceptions: true,
    format: 'a4',
    orientation: 'portrait'
  });
  const [apiSettings, setApiSettings] = useState({
    enabled: false,
    endpointUrl: 'https://api.example.com/webhook',
    authToken: 'sk_test_abcdef123456',
    sendInterval: 'daily',
    dataFormat: 'json'
  });
  const [dashboardSettings, setDashboardSettings] = useState({
    refreshInterval: '30',
    showKpis: true,
    showCharts: true,
    defaultView: 'summary'
  });
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Daily Exception Report',
      type: 'email',
      lastModified: '2023-04-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Weekly Summary PDF',
      type: 'pdf',
      lastModified: '2023-04-10',
      status: 'active'
    },
    {
      id: '3',
      name: 'Monthly Analytics',
      type: 'dashboard',
      lastModified: '2023-03-22',
      status: 'inactive'
    },
    {
      id: '4',
      name: 'API Response Template',
      type: 'api',
      lastModified: '2023-04-01',
      status: 'active'
    }
  ]);

  const handleSaveSettings = (type: string) => {
    toast({
      title: "Settings saved",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} settings have been updated.`
    });
  };

  const handleToggleTemplate = (id: string) => {
    setTemplates(templates.map(template => 
      template.id === id 
        ? { 
            ...template, 
            status: template.status === 'active' ? 'inactive' : 'active' 
          } 
        : template
    ));
    
    toast({
      title: "Template updated",
      description: "Template status has been toggled."
    });
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Reporting Settings</h1>
          <p className="text-muted-foreground">
            Configure how reconciliation results are reported and distributed
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="email">Email Reports</TabsTrigger>
              <TabsTrigger value="pdf">PDF Reports</TabsTrigger>
              <TabsTrigger value="api">API Integration</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="templates">Report Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Email Reporting</h3>
                  <p className="text-sm text-muted-foreground">Configure automated email reports and alerts</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={emailSettings.enabled} 
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enabled: checked})}
                  />
                  <Label htmlFor="email-enabled">Enabled</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Primary Recipient</Label>
                    <Input 
                      id="recipient-email" 
                      value={emailSettings.recipientEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, recipientEmail: e.target.value})}
                      placeholder="Email address" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cc-email">CC Recipients</Label>
                    <Input 
                      id="cc-email" 
                      value={emailSettings.ccEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, ccEmail: e.target.value})}
                      placeholder="Separate multiple emails with commas" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="daily-summary" 
                      checked={emailSettings.dailySummary}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, dailySummary: !!checked})}
                    />
                    <label 
                      htmlFor="daily-summary" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Daily Summary Report
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exception-alerts" 
                      checked={emailSettings.exceptionAlerts}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, exceptionAlerts: !!checked})}
                    />
                    <label 
                      htmlFor="exception-alerts" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Real-time Exception Alerts
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="weekly-digest" 
                      checked={emailSettings.weeklyDigest}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, weeklyDigest: !!checked})}
                    />
                    <label 
                      htmlFor="weekly-digest" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Weekly Digest
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('email')}>Save Email Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">PDF Reports</h3>
                  <p className="text-sm text-muted-foreground">Configure PDF report generation settings</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={pdfSettings.enabled} 
                    onCheckedChange={(checked) => setPdfSettings({...pdfSettings, enabled: checked})}
                  />
                  <Label htmlFor="pdf-enabled">Enabled</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdf-format">PDF Format</Label>
                    <Select 
                      value={pdfSettings.format}
                      onValueChange={(value) => setPdfSettings({...pdfSettings, format: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pdf-orientation">Orientation</Label>
                    <Select 
                      value={pdfSettings.orientation}
                      onValueChange={(value) => setPdfSettings({...pdfSettings, orientation: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-charts" 
                      checked={pdfSettings.includeCharts}
                      onCheckedChange={(checked) => setPdfSettings({...pdfSettings, includeCharts: !!checked})}
                    />
                    <label 
                      htmlFor="include-charts" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include Charts and Graphs
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-raw-data" 
                      checked={pdfSettings.includeRawData}
                      onCheckedChange={(checked) => setPdfSettings({...pdfSettings, includeRawData: !!checked})}
                    />
                    <label 
                      htmlFor="include-raw-data" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include Raw Data Tables
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="detailed-exceptions" 
                      checked={pdfSettings.detailedExceptions}
                      onCheckedChange={(checked) => setPdfSettings({...pdfSettings, detailedExceptions: !!checked})}
                    />
                    <label 
                      htmlFor="detailed-exceptions" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Detailed Exception Reports
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('pdf')}>Save PDF Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">API Integration</h3>
                  <p className="text-sm text-muted-foreground">Configure API webhooks to send reconciliation data</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={apiSettings.enabled} 
                    onCheckedChange={(checked) => setApiSettings({...apiSettings, enabled: checked})}
                  />
                  <Label htmlFor="api-enabled">Enabled</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint-url">Webhook Endpoint URL</Label>
                  <Input 
                    id="endpoint-url" 
                    value={apiSettings.endpointUrl}
                    onChange={(e) => setApiSettings({...apiSettings, endpointUrl: e.target.value})}
                    placeholder="https://" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="auth-token">Authentication Token</Label>
                  <Input 
                    id="auth-token" 
                    value={apiSettings.authToken}
                    onChange={(e) => setApiSettings({...apiSettings, authToken: e.target.value})}
                    placeholder="Auth token" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="send-interval">Send Interval</Label>
                    <Select 
                      value={apiSettings.sendInterval}
                      onValueChange={(value) => setApiSettings({...apiSettings, sendInterval: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-format">Data Format</Label>
                    <Select 
                      value={apiSettings.dataFormat}
                      onValueChange={(value) => setApiSettings({...apiSettings, dataFormat: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('api')}>Save API Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Dashboard Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure dashboard appearance and behavior</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Auto-refresh Interval (minutes)</Label>
                    <Input 
                      id="refresh-interval" 
                      type="number"
                      value={dashboardSettings.refreshInterval}
                      onChange={(e) => setDashboardSettings({...dashboardSettings, refreshInterval: e.target.value})}
                      placeholder="30" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-view">Default View</Label>
                    <Select 
                      value={dashboardSettings.defaultView}
                      onValueChange={(value) => setDashboardSettings({...dashboardSettings, defaultView: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select default view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="exceptions">Exceptions</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-kpis" 
                      checked={dashboardSettings.showKpis}
                      onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, showKpis: !!checked})}
                    />
                    <label 
                      htmlFor="show-kpis" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show KPI Metrics
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-charts" 
                      checked={dashboardSettings.showCharts}
                      onCheckedChange={(checked) => setDashboardSettings({...dashboardSettings, showCharts: !!checked})}
                    />
                    <label 
                      htmlFor="show-charts" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show Charts and Graphs
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('dashboard')}>Save Dashboard Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Report Templates</h3>
                  <p className="text-sm text-muted-foreground">Manage report templates and layouts</p>
                </div>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        {template.type === 'email' && 'Email Report'}
                        {template.type === 'pdf' && 'PDF Report'}
                        {template.type === 'api' && 'API Response'}
                        {template.type === 'dashboard' && 'Dashboard Widget'}
                      </TableCell>
                      <TableCell>{template.lastModified}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          template.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleToggleTemplate(template.id)}
                        >
                          {template.status === 'active' ? 'Disable' : 'Enable'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2 text-xs"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ReportingSettings;
