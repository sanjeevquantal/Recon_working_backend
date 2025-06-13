
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import WorkspaceSettings from '@/components/WorkspaceSettings';
import ReconciliationsTab from '@/components/workspace/ReconciliationsTab';
import ValidationTab from '@/components/workspace/ValidationTab';

const mockBrand = {
  name: 'Samsung',
  description: 'Samsung Brand EMI Program',
  logo: '/placeholder.svg'
};

const WorkspaceDetail = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [activeTab, setActiveTab] = useState('reconciliations');
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
            <img src={mockBrand.logo} alt={mockBrand.name} className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{mockBrand.name}</h1>
            <p className="text-muted-foreground">{mockBrand.description}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="reconciliations">Reconciliations</TabsTrigger>
          <TabsTrigger value="validation">Validation Rules</TabsTrigger>
          <TabsTrigger value="settings">Recon Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reconciliations">
          <ReconciliationsTab workspaceId={workspaceId || ''} />
        </TabsContent>

        <TabsContent value="validation">
          <ValidationTab workspaceId={workspaceId || ''} />
        </TabsContent>

        <TabsContent value="settings">
          <WorkspaceSettings workspaceId={workspaceId || ''} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default WorkspaceDetail;
