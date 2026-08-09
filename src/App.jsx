import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Page imports (auth)
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import OAuthConsent from '@/pages/OAuthConsent';
import ProtectedRoute from '@/components/ProtectedRoute';

// App shell and page imports (TeamGraph)
import AppShell from '@/components/layout/Shell';
import DashboardView from '@/pages/DashboardView';
import NetworkExplorerView from '@/pages/NetworkExplorerView';
import EmployeesView from '@/pages/EmployeesView';
import EmployeeDetailView from '@/pages/EmployeeDetailView';
import ProjectsView from '@/pages/ProjectsView';
import ProjectDetailView from '@/pages/ProjectDetailView';
import TeamsView from '@/pages/TeamsView';
import SkillsView from '@/pages/SkillsView';
import SkillDetailView from '@/pages/SkillDetailView';
import TechnologiesView from '@/pages/TechnologiesView';
import TechnologyDetailView from '@/pages/TechnologyDetailView';
import ClientsView from '@/pages/ClientsView';
import ClientDetailView from '@/pages/ClientDetailView';
import InsightsView from '@/pages/InsightsView';
import SettingsView from '@/pages/SettingsView';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app routes
  return (
    <Routes>
      {/* Public/Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* OAuth Consent Routes */}
      <Route path="/oauth/consent" element={<OAuthConsent />} />
      <Route path="/oauth-consent" element={<OAuthConsent />} />

      {/* Protected Dashboard/App Routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Login />} />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/network" element={<NetworkExplorerView />} />
          <Route path="/employees" element={<EmployeesView />} />
          <Route path="/employees/:employeeId" element={<EmployeeDetailView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/:projectId" element={<ProjectDetailView />} />
          <Route path="/teams" element={<TeamsView />} />
          <Route path="/skills" element={<SkillsView />} />
          <Route path="/skills/:skillId" element={<SkillDetailView />} />
          <Route path="/technologies" element={<TechnologiesView />} />
          <Route path="/technologies/:technologyId" element={<TechnologyDetailView />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/clients/:clientId" element={<ClientDetailView />} />
          <Route path="/insights" element={<InsightsView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
