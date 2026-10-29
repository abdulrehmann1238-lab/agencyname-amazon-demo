import React, { useState } from 'react';
import {
  UserPlus,
  Play,
  Truck,
  CheckCircle2,
  Clock,
  Warehouse,
  CreditCard,
  CheckSquare,
  BarChart2,
  Lock,
  ArrowRight,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { OnboardingProject } from '../../types';

export const OnboardingPage: React.FC = () => {
  const { onboardingProjects, simulateStockArrival, showToast } = useApp();

  const [selectedProject, setSelectedProject] = useState<OnboardingProject | null>(null);
  const [simulateModalOpen, setSimulateModalOpen] = useState(false);

  // Simulation form
  const [simBrand, setSimBrand] = useState('Bloom Botanics');
  const [simSkuCount, setSimSkuCount] = useState<number>(6);
  const [sim3PL, setSim3PL] = useState('Pick Pack N Post');

  const activeCount = onboardingProjects.filter((p) => p.overallStatus === 'active').length;
  const lwaPendingCount = onboardingProjects.filter((p) => p.amazonAuthorizationStatus !== 'authorized').length;
  const billingPendingCount = onboardingProjects.filter((p) => p.billingSetupStatus !== 'ready').length;

  const handleSimulateSubmit = () => {
    simulateStockArrival(simBrand, simSkuCount, sim3PL);
    setSimulateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Client Onboarding Pipeline
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              10-Stage Operational Workflow
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Automated handover from 3PL pallet physical receipt through Amazon SP-API consent, Freedcamp boards and billing mandates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSimulateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Simulate 3PL Stock Arrival</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KPICard
          label="Active Onboardings"
          value={activeCount}
          subtitle="In pipeline"
        />
        <KPICard
          label="Awaiting SP-API / LWA"
          value={lwaPendingCount}
          subtitle="Client OAuth consent"
          badge={lwaPendingCount > 0 ? <span className="w-2 h-2 rounded-full bg-status-warningText" /> : undefined}
        />
        <KPICard
          label="Billing Mandate Pending"
          value={billingPendingCount}
          subtitle="GoCardless / Xero"
        />
        <KPICard
          label="Avg Onboarding Velocity"
          value="6.2 Days"
          subtitle="Pallet to live operations"
        />
      </div>

      {/* Onboarding Projects List */}
      <div className="space-y-4">
        {onboardingProjects.map((project) => {
          const completedStages = project.stages.filter((s) => s.status === 'completed').length;
          const currentStage = project.stages.find((s) => s.id === project.currentStageId) || project.stages[0];

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-5 bg-card rounded-card border border-border shadow-soft hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {project.brandName}
                    </h3>
                    <StatusBadge variant={project.overallStatus} size="sm" />
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Category: {project.category} · 3PL: <strong>{project.logisticsProvider}</strong> ({project.initialSkuCount} initial SKUs)
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-primary">
                    Stage {project.currentStageId} of 10: {currentStage.name}
                  </span>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Assigned: {project.assignedAccountManager}
                  </p>
                </div>
              </div>

              {/* 10-Stage Pipeline Bar */}
              <div className="space-y-2">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                  {project.stages.map((stage) => (
                    <div
                      key={stage.id}
                      className={`h-2 rounded-full transition-all ${
                        stage.status === 'completed'
                          ? 'bg-primary'
                          : stage.status === 'in_progress'
                          ? 'bg-terracotta animate-pulse'
                          : 'bg-[#EAECE4]'
                      }`}
                      title={`Stage ${stage.id}: ${stage.name} (${stage.status})`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                  <span>1. 3PL Goods In</span>
                  <span className="hidden sm:inline">4. SP-API Verified</span>
                  <span className="hidden sm:inline">7. Xero / GoCardless</span>
                  <span>10. Live Operations</span>
                </div>
              </div>

              {/* Badges / Systems summary */}
              <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    project.amazonAuthorizationStatus === 'authorized'
                      ? 'bg-status-successBg text-status-successText'
                      : 'bg-status-warningBg text-status-warningText'
                  }`}>
                    SP-API: {project.amazonAuthorizationStatus}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    project.freedcampProjectCreated
                      ? 'bg-sage text-primary'
                      : 'bg-sand text-text-muted'
                  }`}>
                    Freedcamp: Instantiated
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    project.billingSetupStatus === 'ready'
                      ? 'bg-status-successBg text-status-successText'
                      : 'bg-sand-light text-text-secondary'
                  }`}>
                    Billing: {project.billingSetupStatus}
                  </span>
                </div>

                <span className="text-primary font-medium flex items-center gap-1 group-hover:underline">
                  Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulate Stock Arrival Modal */}
      <Modal
        isOpen={simulateModalOpen}
        onClose={() => setSimulateModalOpen(false)}
        title="Simulate 3PL Goods Receipt Trigger"
        subtitle="Operational trigger linking 3PL pallet physical receipt to automated client onboarding"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSimulateModalOpen(false)}
              className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleSimulateSubmit}
              className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
            >
              Confirm 3PL Pallet Receipt
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-sand-light border border-sand-dark/40 rounded-btn text-text-secondary leading-relaxed">
            <p className="font-semibold text-text-primary mb-1">Make.com / Webhook Architecture</p>
            <p>
              In production, when a 3PL scans an inbound ASN shipment, an automated webhook fires into AUREL. This automatically instantiates a brand record, generates Freedcamp tasks, issues an SP-API authorization token link, and schedules Xero billing.
            </p>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Client Brand Name</label>
            <input
              type="text"
              value={simBrand}
              onChange={(e) => setSimBrand(e.target.value)}
              className="w-full p-2 bg-card border border-border rounded-btn font-semibold text-text-primary text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Initial SKU Count</label>
            <input
              type="number"
              value={simSkuCount}
              onChange={(e) => setSimSkuCount(Number(e.target.value))}
              className="w-full p-2 bg-card border border-border rounded-btn font-mono text-text-primary text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Receiving 3PL Logistics Partner</label>
            <select
              value={sim3PL}
              onChange={(e) => setSim3PL(e.target.value)}
              className="w-full p-2 bg-card border border-border rounded-btn text-text-primary text-xs"
            >
              <option>Pick Pack N Post (Northampton)</option>
              <option>Mintsoft 3PL Hub (Coventry)</option>
              <option>Blue30 Fulfillment (Bristol)</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Onboarding Detail Drawer */}
      <Drawer
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.brandName || 'Client Onboarding Workspace'}
        subtitle={`Provider: ${selectedProject?.logisticsProvider} · Account Manager: ${selectedProject?.assignedAccountManager}`}
        width="xl"
      >
        {selectedProject && (
          <div className="space-y-6 text-xs">
            {/* Stage Timeline */}
            <div>
              <h4 className="font-semibold text-text-primary mb-3">10-Stage Milestone Tracker</h4>
              <div className="space-y-2.5">
                {selectedProject.stages.map((stage) => (
                  <div
                    key={stage.id}
                    className={`p-3 rounded-btn border transition-all ${
                      stage.status === 'completed'
                        ? 'bg-[#F4F7F4] border-[#C8DFCA]'
                        : stage.status === 'in_progress'
                        ? 'bg-card border-primary shadow-subtle'
                        : 'bg-[#FBFBFA] border-border opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {stage.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : stage.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-terracotta animate-spin" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[9px] text-text-muted">
                            {stage.id}
                          </span>
                        )}
                        <span className="font-semibold text-text-primary">
                          Stage {stage.id}: {stage.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-muted">Owner: {stage.owner}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 pl-6">
                      {stage.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Handover Integration Triggers */}
            <div className="p-4 bg-sand-light rounded-btn border border-sand-dark/40 space-y-3">
              <h4 className="font-semibold text-text-primary">Operational Handover Actions</h4>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => showToast('Freedcamp board synced', 'Created 14 milestone task tickets.', 'info')}
                  className="p-2.5 bg-card border border-border rounded-btn text-left hover:border-primary transition-colors"
                >
                  <span className="font-semibold text-text-primary block">Freedcamp Project</span>
                  <span className="text-[10px] text-text-muted">Open operational board</span>
                </button>

                <button
                  onClick={() => showToast('Xero retainer invoice prepared', 'Draft monthly retainer generated.', 'info')}
                  className="p-2.5 bg-card border border-border rounded-btn text-left hover:border-primary transition-colors"
                >
                  <span className="font-semibold text-text-primary block">Xero Billing Setup</span>
                  <span className="text-[10px] text-text-muted">Prepare monthly retainer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
