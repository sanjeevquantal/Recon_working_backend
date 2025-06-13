
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusCircle, AlertCircle, CheckCircle2, BarChart,
  Factory, Percent, 
} from 'lucide-react';
import { WorkspaceCard } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useExceptionHandler } from '@/hooks/use-exception-handler';

/* ------------------------------------------------------------------ */
/*  1. TYPES & MOCK DATA                                              */
/* ------------------------------------------------------------------ */

interface ActiveWorkspace extends WorkspaceCard {
  id: string;
  active: boolean;
}

const processFile = (file: File) => ({
  headers: [
    'item_date', 'purchase_date', 'order_reference',
    'invoice_number', 'amount', 'emi',
  ],
  rowCount: Math.floor(Math.random() * 1000) + 200,
  detectFormat: file.name.endsWith('.csv') ? 'CSV' : 'Excel',
  sampleData: [
    { item_date: '2023-04-15', amount: '₹24,500', order_reference: 'ORD-12345' },
    { item_date: '2023-04-16', amount: '₹32,100', order_reference: 'ORD-12346' },
  ],
});

const initialWorkspaces: WorkspaceCard[] = [
  { id: '1', name: 'Samsung Brand EMI Program', description: 'Daily reconciliation for Samsung Brand EMI transactions', lastUpdated: '2023-10-15', pendingExceptions: 5, totalRecords: 1250, matchedRecords: 1245, brand: { name: 'Samsung', logo: '/placeholder.svg' } },
  { id: '2', name: 'Godrej Appliances Recon', description: 'Payment reconciliation for Godrej appliance program', lastUpdated: '2023-10-14', pendingExceptions: 0, totalRecords: 832, matchedRecords: 832, brand: { name: 'Godrej', logo: '/placeholder.svg' } },
  { id: '3', name: 'HP India EMI', description: 'HP laptop and computer EMI program reconciliation', lastUpdated: '2023-10-12', pendingExceptions: 12, totalRecords: 428, matchedRecords: 416, brand: { name: 'HP', logo: '/placeholder.svg' } },
  { id: '4', name: 'Vivo Mobile Payments', description: 'Mobile payment reconciliation for Vivo partnership', lastUpdated: '2023-10-10', pendingExceptions: 3, totalRecords: 725, matchedRecords: 722, brand: { name: 'Vivo', logo: '/placeholder.svg' } },
];

/* ------------------------------------------------------------------ */
/*  2. COMPONENT                                                      */
/* ------------------------------------------------------------------ */

const Dashboard = () => {
  /* ── state ──────────────────────────────────────────────────────── */
  const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>(initialWorkspaces);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { withErrorHandling } = useExceptionHandler();

  // Load workspaces from localStorage on component mount
  useEffect(() => {
    const storedWorkspaces = localStorage.getItem('workspaces');
    if (storedWorkspaces) {
      const parsed = JSON.parse(storedWorkspaces);
      setWorkspaces(parsed.length > 0 ? parsed : initialWorkspaces);
    }
  }, []);

  const getMatchPercentage = (w: WorkspaceCard) => Math.round((w.matchedRecords / w.totalRecords) * 100);
  const getProgressBarColor = (p: number) => (p === 100 ? 'progress-success' : p >= 95 ? 'progress-warning' : 'progress-alert');

  const handleCreateNewRecon = () => {
    navigate('/create-recon');
  };

  const handleWorkspaceClick = withErrorHandling(async (id: string): Promise<void> => {
    navigate(`/workspace/${id}`);
    return Promise.resolve();
  });

  /* ── derived values ─────────────────────────────────────────────── */
  const totalGMV = '₹143.8M';
  const totalWorkspaces = workspaces.length;
  const avgMatch = Math.round(workspaces.reduce((s, w) => s + getMatchPercentage(w), 0) / workspaces.length);

  /* ------------------------------------------------------------------ */
  /*  3. RENDER                                                         */
  /* ------------------------------------------------------------------ */
  return (
    <ErrorBoundary>
      <Layout>
        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Reconciliation Dashboard</h1>
            <p className="text-muted-foreground">Manage and monitor your reconciliation recons</p>
          </div>

          <Button onClick={handleCreateNewRecon} className="gradient-btn flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>New Recon</span>
          </Button>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="kpi-tile">
            <BarChart className="h-6 w-6 text-warning mb-2" />
            <div className="kpi-tile-value text-warning">{totalGMV}</div>
            <div className="kpi-tile-label">YTD&nbsp;GMV</div>
          </div>
          <div className="kpi-tile">
            <Factory className="h-6 w-6 text-cyan-blue mb-2" />
            <div className="kpi-tile-value text-cyan-blue">{totalWorkspaces}</div>
            <div className="kpi-tile-label">Recons</div>
          </div>
          <div className="kpi-tile">
            <Percent className="h-6 w-6 mb-2" style={{ color: avgMatch === 100 ? '#10F17E' : avgMatch >= 95 ? '#F97316' : '#D946EF' }} />
            <div className="kpi-tile-value" style={{ color: avgMatch === 100 ? '#10F17E' : avgMatch >= 95 ? '#F97316' : '#D946EF' }}>
              {avgMatch}%
            </div>
            <div className="kpi-tile-label">Avg&nbsp;Match&nbsp;%</div>
          </div>
        </div>

        {/* recon cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((w) => (
            <Card key={w.id} className="glass-card card-hover cursor-pointer" onClick={() => handleWorkspaceClick(w.id)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center overflow-hidden">
                    <img
                      src={w.brand.logo}
                      alt={w.brand.name}
                      className="w-6 h-6"
                      onError={(e) => ((e.target as HTMLImageElement).src = '/placeholder.svg')}
                    />
                  </div>
                  <CardTitle className="text-lg">{w.brand.name}</CardTitle>
                </div>
                {w.pendingExceptions > 0 ? (
                  <div className="flex items-center text-alert">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{w.pendingExceptions}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-success">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{w.name}</div>
                <p className="text-xs text-muted-foreground mt-1">{w.description}</p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <div className="flex justify-between w-full text-xs text-muted-foreground">
                  <div>Last updated: {w.lastUpdated}</div>
                  <div className="font-medium">
                    <span className={getMatchPercentage(w) === 100 ? 'text-success' : getMatchPercentage(w) >= 95 ? 'text-warning' : 'text-alert'}>
                      {getMatchPercentage(w)}%
                    </span>{' '}
                    matched
                  </div>
                </div>
                <div className="progress-bar">
                  <div className={`progress-value ${getProgressBarColor(getMatchPercentage(w))}`} style={{ width: `${getMatchPercentage(w)}%` }} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default Dashboard;
