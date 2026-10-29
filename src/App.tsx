import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/landing/LandingPage';
import { OverviewPage } from './pages/overview/OverviewPage';
import { PerformancePage } from './pages/performance/PerformancePage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { ProfitabilityPage } from './pages/profitability/ProfitabilityPage';
import { HealthPage } from './pages/health/HealthPage';
import { ExpansionPage } from './pages/expansion/ExpansionPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { ApprovalsPage } from './pages/approvals/ApprovalsPage';
import { CommunicationsPage } from './pages/communications/CommunicationsPage';
import { IntegrationsPage } from './pages/integrations/IntegrationsPage';
import { ClientsPage } from './pages/clients/ClientsPage';
import { ClientDetailPage } from './pages/clients/ClientDetailPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Marketing Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main Interactive Application Shell */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="profitability" element={<ProfitabilityPage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="expansion" element={<ExpansionPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="communications" element={<CommunicationsPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/:id" element={<ClientDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
