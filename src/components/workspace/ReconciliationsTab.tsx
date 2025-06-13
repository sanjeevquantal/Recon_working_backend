import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Calendar, AlertTriangle, CheckCircle, Clock, Filter, Zap, Mail } from 'lucide-react';
import { ReconciliationRecord, ExceptionRecord } from '@/types';
import ExceptionDetail from '@/components/ExceptionDetail';
import ScratchPad from '@/components/exception/ScratchPad';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReconciliationsTabProps {
  workspaceId: string;
}

const mockReconciliations: ReconciliationRecord[] = [
  {
    id: '1',
    date: '2023-10-15',
    status: 'exception',
    totalRecords: 450,
    matchedRecords: 445,
    exceptionRecords: 5
  },
  {
    id: '2',
    date: '2023-10-14',
    status: 'complete',
    totalRecords: 423,
    matchedRecords: 423,
    exceptionRecords: 0
  },
  {
    id: '3',
    date: '2023-10-13',
    status: 'complete',
    totalRecords: 435,
    matchedRecords: 435,
    exceptionRecords: 0
  },
  {
    id: '4',
    date: '2023-10-12',
    status: 'exception',
    totalRecords: 442,
    matchedRecords: 439,
    exceptionRecords: 3
  },
  {
    id: '5',
    date: '2023-10-11',
    status: 'pending',
    totalRecords: 465,
    matchedRecords: 0,
    exceptionRecords: 0
  }
];

const mockExceptions: ExceptionRecord[] = [
  {
    id: 'exc-1',
    recordId: 'TX-10031',
    rule: 'Amount must match between sources',
    source1Value: '₹15,000.00',
    source2Value: '₹14,850.00',
    status: 'open'
  },
  {
    id: 'exc-2',
    recordId: 'TX-10054',
    rule: 'Transaction date must be within 24 hours',
    source1Value: '2023-10-15 09:30:00',
    source2Value: '2023-10-16 15:45:00',
    status: 'open'
  },
  {
    id: 'exc-3',
    recordId: 'TX-10078',
    rule: 'Customer ID must match',
    source1Value: 'CUST-789456',
    source2Value: 'CUST-789457',
    status: 'open'
  },
  {
    id: 'exc-4',
    recordId: 'TX-10092',
    rule: 'EMI term months must match',
    source1Value: '12',
    source2Value: '18',
    status: 'in-suspense'
  },
  {
    id: 'exc-5',
    recordId: 'TX-10103',
    rule: 'Interest rate must be equal',
    source1Value: '12.5%',
    source2Value: '12.0%',
    status: 'resolved'
  }
];

const ReconciliationsTab: React.FC<ReconciliationsTabProps> = ({ workspaceId }) => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [selectedRecon, setSelectedRecon] = useState<string | null>(null);
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>(mockExceptions);
  const [isRecommending, setIsRecommending] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileNumber: 1 | 2
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (fileNumber === 1) {
        setFile1(e.target.files[0]);
      } else {
        setFile2(e.target.files[0]);
      }
    }
  };

  const handleNewReconciliation = () => {
    if (!file1 || !file2) {
      toast({
        title: "Missing files",
        description: "Please upload both source files for reconciliation",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing",
      description: "Starting reconciliation process...",
    });

    console.log('Starting reconciliation for workspace:', workspaceId);
    console.log('File 1:', file1);
    console.log('File 2:', file2);

    setFile1(null);
    setFile2(null);
    
    setTimeout(() => {
      toast({
        title: "Reconciliation complete",
        description: "Files have been processed successfully",
      });
    }, 2000);
  };

  const handleCheckEmail = () => {
    setIsCheckingEmail(true);
    toast({
      title: "Checking email",
      description: "Searching for Excel attachments in your inbox...",
    });

    // Simulate API call with a promise
    setTimeout(() => {
      // Simulate finding an Excel file
      const mockFile = new File([""], "latest_reconciliation_data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      
      // Auto-fill the file inputs
      setFile1(mockFile);
      
      toast({
        title: "Excel file found",
        description: "Found 'latest_reconciliation_data.xlsx' from your inbox and loaded it as Source 1",
      });
      
      setIsCheckingEmail(false);
    }, 2000);
  };

  const handleDownloadReconciliation = (reconId: string) => {
    toast({
      title: "Downloading",
      description: `Preparing reconciliation report ${reconId}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Reconciliation report has been downloaded",
      });
    }, 1500);
  };
  
  const handleViewExceptions = (reconId: string) => {
    setSelectedRecon(reconId);
    toast({
      title: "Viewing exceptions",
      description: `Showing exceptions for reconciliation ${reconId}`,
    });
  };

  const handleExceptionClick = (exceptionId: string) => {
    setSelectedExceptionId(exceptionId);
  };

  const handleCloseExceptionDetail = () => {
    setSelectedExceptionId(null);
  };

  const handleResolveException = (id: string, notes: string, status: 'resolved' | 'in-suspense' | 'closed') => {
    setExceptions(prev => 
      prev.map(exception => 
        exception.id === id ? { ...exception, status, notes } : exception
      )
    );
    
    toast({
      title: `Exception ${status === 'resolved' ? 'resolved' : status === 'in-suspense' ? 'marked as in-suspense' : 'closed'}`,
      description: `The exception has been successfully ${status === 'resolved' ? 'resolved' : status === 'in-suspense' ? 'marked as in-suspense' : 'closed'}`,
    });
  };

  const handleAutoRecommendAll = () => {
    setIsRecommending(true);
    toast({
      title: "Processing",
      description: "Generating recommendations for all exceptions...",
    });
    
    // Simulate AI recommendation (would be a real API call in production)
    setTimeout(() => {
      setIsRecommending(false);
      toast({
        title: "Recommendations Ready",
        description: "AI recommendations have been generated for all exceptions",
      });
    }, 2500);
  };

  const filteredExceptions = statusFilter 
    ? exceptions.filter(exception => exception.status === statusFilter)
    : exceptions;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'exception':
        return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">Exception</span>;
      case 'complete':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">Complete</span>;
      case 'pending':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">Pending</span>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exception':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const selectedException = exceptions.find(exc => exc.id === selectedExceptionId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>New Reconciliation</CardTitle>
            <CardDescription>
              Upload files to start a new reconciliation process
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCheckEmail} 
              variant="outline"
              disabled={isCheckingEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isCheckingEmail ? 'Checking Email...' : 'Check Email for Files'}
            </Button>
            <Button onClick={handleNewReconciliation} disabled={!file1 || !file2}>
              <Upload className="h-4 w-4 mr-2" />
              Start Reconciliation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="font-medium">Source 1 File</div>
            <div className="flex items-center space-x-2">
              <Input 
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => handleFileChange(e, 1)}
                className="cursor-pointer"
              />
              {file1 && (
                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {file1.name}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Source 2 File</div>
            <div className="flex items-center space-x-2">
              <Input 
                type="file" 
                accept=".xlsx,.xls,.csv"
                onChange={(e) => handleFileChange(e, 2)}
                className="cursor-pointer"
              />
              {file2 && (
                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {file2.name}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedRecon ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Exceptions for Reconciliation #{selectedRecon}</CardTitle>
              <CardDescription>
                Review and resolve individual exceptions
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter ? `Filter: ${statusFilter}` : 'Filter'} 
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('open')}>
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('in-suspense')}>
                    In-Suspense
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>
                    Resolved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('closed')}>
                    Closed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAutoRecommendAll}
                disabled={isRecommending}
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-Recommend All
              </Button>
              
              <ScratchPad />
              
              <Button variant="ghost" size="sm" onClick={() => setSelectedRecon(null)}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">Record ID</th>
                    <th className="pb-3 text-left font-medium">Rule</th>
                    <th className="pb-3 text-left font-medium">Source 1</th>
                    <th className="pb-3 text-left font-medium">Source 2</th>
                    <th className="pb-3 text-left font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExceptions.map((exception) => (
                    <tr key={exception.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => handleExceptionClick(exception.id)}>
                      <td className="py-3">{exception.recordId}</td>
                      <td className="py-3">{exception.rule}</td>
                      <td className="py-3 font-mono text-sm">{exception.source1Value}</td>
                      <td className="py-3 font-mono text-sm">{exception.source2Value}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          exception.status === 'open'
                            ? 'bg-amber-100 text-amber-800'
                            : exception.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : exception.status === 'in-suspense'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                          {exception.status.charAt(0).toUpperCase() + exception.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          handleExceptionClick(exception.id);
                        }}>
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredExceptions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No exceptions found matching the selected filter
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reconciliations</CardTitle>
            <CardDescription>
              History of reconciliation processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">Date</th>
                    <th className="pb-3 text-left font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Total Records</th>
                    <th className="pb-3 text-right font-medium">Matched</th>
                    <th className="pb-3 text-right font-medium">Exceptions</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReconciliations.map((recon) => (
                    <tr key={recon.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {recon.date}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          {getStatusIcon(recon.status)}
                          <span className="ml-2">{getStatusBadge(recon.status)}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">{recon.totalRecords}</td>
                      <td className="py-3 text-right">{recon.matchedRecords}</td>
                      <td className="py-3 text-right font-medium">
                        <span className={recon.exceptionRecords > 0 ? "text-red-600" : ""}>
                          {recon.exceptionRecords}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDownloadReconciliation(recon.id)}
                          title="Download report"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {recon.status === 'exception' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-amber-600"
                            onClick={() => handleViewExceptions(recon.id)}
                            title="View exceptions"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <ExceptionDetail
        exception={selectedException || null}
        isOpen={!!selectedExceptionId}
        onClose={handleCloseExceptionDetail}
        onResolve={handleResolveException}
      />
    </div>
  );
};

export default ReconciliationsTab;
