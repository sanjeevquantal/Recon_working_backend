export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Super Admin' | 'Admin View' | 'Report View' | 'Maker' | 'Checker';
  organization: string;
  permissions?: {
    reconSetup: {
      setupNewRecon: boolean;
      setupValidations: boolean;
      setupExceptions: boolean;
      setupRules: boolean;
      viewReports: boolean;
      downloadReports: boolean;
      approvalPermission: boolean;
    };
    runRecon: {
      runRecon: boolean;
      approveRecon: boolean;
      viewReports: boolean;
      downloadReports: boolean;
    };
    adminUser: {
      createRecon: boolean;
      closeExceptions: boolean;
      viewReports: boolean;
      editUsers: boolean;
      viewUsers: boolean;
      downloadReports: boolean;
      viewDashboard: boolean;
      viewAnalytics: boolean;
    };
    reportUser: {
      viewReports: boolean;
      viewDashboard: boolean;
      viewAnalytics: boolean;
      downloadReports: boolean;
    };
  };
}

export interface WorkspaceCard {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  pendingExceptions: number;
  totalRecords: number;
  matchedRecords: number;
  brand: {
    name: string;
    logo?: string;
  };
}

export interface ReconciliationRecord {
  id: string;
  date: string;
  status: 'pending' | 'complete' | 'exception';
  totalRecords: number;
  matchedRecords: number;
  exceptionRecords: number;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'min-max' | 'ratio' | 'equality' | 'presence' | 'custom';
  field1?: string;
  field2?: string;
  condition?: string;
  value?: string | number;
}

export interface ExceptionRecord {
  id: string;
  recordId: string;
  rule: string;
  source1Value: string;
  source2Value: string;
  status: 'open' | 'resolved' | 'in-suspense' | 'closed';
  notes?: string;
}

export interface ValidationResult {
  ruleId: string;
  ruleName: string;
  recordId: string;
  passed: boolean;
  field1?: string;
  field2?: string;
  value1?: string | number;
  value2?: string | number;
  expectedValue?: string | number;
  message?: string;
}
