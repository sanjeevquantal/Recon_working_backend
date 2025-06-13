
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import UserManagement from "./pages/UserManagement";
import Analytics from "./pages/Analytics";
import ReconSettings from "./pages/ReconSettings";
import ReportingSettings from "./pages/ReportingSettings";
import CreateRecon from "./pages/CreateRecon";
import ValidationRules from "./pages/ValidationRules";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Index route for authentication check */}
            <Route path="/" element={<Index />} />
            
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create-recon" element={
              <ProtectedRoute>
                <CreateRecon />
              </ProtectedRoute>
            } />
            <Route path="/create-recon/validation" element={
              <ProtectedRoute>
                <ValidationRules />
              </ProtectedRoute>
            } />
            <Route path="/workspace/:workspaceId" element={
              <ProtectedRoute>
                <WorkspaceDetail />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <ReconSettings />
              </ProtectedRoute>
            } />
            <Route path="/reporting" element={
              <ProtectedRoute>
                <ReportingSettings />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
