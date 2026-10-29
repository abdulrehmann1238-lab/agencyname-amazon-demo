import React, { useState } from 'react';
import {
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  LineChart as LineChartIcon,
  Clock,
  ArrowRight,
  User,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { HealthIssue } from '../../types';

export const HealthPage: React.FC = () => {
  const {
    healthIssues,
    generateClaudeDraft,
    requestReviewForHealthIssue,
    runSimulatedHealthChecks,
    selectedBrandId,
    selectedMarketplace,
    showToast,
  } = useApp();

  const [selectedIssue, setSelectedIssue] = useState<HealthIssue | null>(null);
  const [checkingStep, setCheckingStep] = useState<string | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>('Today at 08:30 UTC');
  const [editableDraft, setEditableDraft] = useState<string>('');

  const filteredIssues = healthIssues.filter((h) => {
    if (selectedBrandId !== 'all' && h.brandId !== selectedBrandId) return false;
    if (selectedMarketplace !== 'all' && h.marketplace !== selectedMarketplace) return false;
    return true;
  });

  const suppressedCount = filteredIssues.filter((h) => h.issueType === 'Listing Suppression').length;
  const buyBoxLossCount = filteredIssues.filter((h) => h.issueType === 'Buy Box Loss').length;
  const accountWarnings = filteredIssues.filter((h) => h.issueType === 'Account Health Warning').length;
  const vendorDisputes = filteredIssues.filter((h) => h.issueType.includes('Vendor')).length;

  const handleOpenIssue = (issue: HealthIssue) => {
    setSelectedIssue(issue);
    setEditableDraft(issue.claudeDraft || issue.proposedNextSteps);
  };

  const handleRunChecks = async () => {
    await runSimulatedHealthChecks((step) => {
      setCheckingStep(step);
    });
    setCheckingStep(null);
    setLastCheckTime('Just now');
  };

  const handleClaudeDraft = (issueId: string) => {
    generateClaudeDraft(issueId);
    const updated = healthIssues.find((h) => h.id === issueId);
    if (updated) {
      setSelectedIssue(updated);
      setEditableDraft(updated.claudeDraft || '');
    }
  };

  const handleRequestReview = (issueId: string) => {
    requestReviewForHealthIssue(issueId);
    setSelectedIssue(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Listing & Account Health
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              Last Check: {lastCheckTime}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Proactively surfaces catalog suppressions, Buy Box hijackers and Vendor shortage disputes before revenue is lost.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunChecks}
            disabled={!!checkingStep}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${checkingStep ? 'animate-spin' : ''}`} />
            <span>{checkingStep ? 'Evaluating Checks...' : 'Run Simulated Checks'}</span>
          </button>
        </div>
      </div>

      {/* Progress Simulation Banner if active */}
      {checkingStep && (
        <div className="p-4 bg-sand-light rounded-card border border-sand-dark/40 flex items-center justify-between text-xs text-text-primary animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse" />
            <span className="font-mono">{checkingStep}</span>
          </div>
          <span className="text-text-muted text-[11px]">SP-API + Keepa Diagnostics</span>
        </div>
      )}

      {/* Health Overview KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <KPICard
          label="Catalog Health Score"
          value="94/100"
          subtitle="Overall portfolio score"
          change={2.1}
          badge={<StatusBadge variant="healthy" size="sm" />}
        />
        <KPICard
          label="Listing Suppressions"
          value={suppressedCount}
          subtitle="Immediate revenue impact"
          badge={suppressedCount > 0 ? <span className="w-2 h-2 rounded-full bg-status-errorText" /> : undefined}
        />
        <KPICard
          label="Buy Box Losses"
          value={buyBoxLossCount}
          subtitle="Unauthorized 3P sellers"
          badge={buyBoxLossCount > 0 ? <span className="w-2 h-2 rounded-full bg-status-warningText" /> : undefined}
        />
        <KPICard
          label="Account Warnings"
          value={accountWarnings}
          subtitle="Policy notification cure"
        />
        <KPICard
          label="Vendor Shortages"
          value={vendorDisputes}
          subtitle="EDI shortage deductions"
        />
        <KPICard
          label="Pending Appeals"
          value={filteredIssues.filter((h) => h.status === 'review_requested').length}
          subtitle="In Human Approval Center"
        />
      </div>

      {/* Issue Queue Table */}
      <div className="bg-card rounded-card border border-border shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Active Issue Queue & Recommended Mitigations
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Prioritized operational alerts requiring brand manager review or AI-assisted correction.
            </p>
          </div>
          <span className="text-xs text-text-muted">
            {filteredIssues.length} Monitored Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBFA] border-b border-border text-text-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Issue Type</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">Product & SKU</th>
                <th className="py-3 px-4 font-semibold">Brand / Region</th>
                <th className="py-3 px-4 font-semibold">Evidence Summary</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Assigned</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => handleOpenIssue(issue)}
                  className="hover:bg-sage/20 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-text-primary">
                    {issue.issueType}
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge variant={issue.severity} size="sm" />
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="max-w-[200px]">
                      <span className="font-mono text-primary font-bold mr-1.5">{issue.sku}</span>
                      <p className="text-text-secondary truncate mt-0.5">{issue.productTitle}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-medium text-text-primary">{issue.brandName}</p>
                    <span className="text-[10px] text-text-muted font-mono">{issue.marketplace}</span>
                  </td>

                  <td className="py-3.5 px-4 text-text-secondary max-w-[240px] truncate leading-relaxed">
                    {issue.evidence}
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge variant={issue.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-text-muted text-[11px]">
                    {issue.assignedTo}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="text-xs text-primary font-medium group-hover:underline">
                      Review Issue →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Detail & Claude AI Mitigation Drawer */}
      <Drawer
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        title={selectedIssue?.issueType || 'Issue Review'}
        subtitle={`Product: ${selectedIssue?.productTitle} (${selectedIssue?.sku})`}
        width="lg"
      >
        {selectedIssue && (
          <div className="space-y-6 text-xs">
            {/* Header info */}
            <div className="flex items-center justify-between p-3.5 bg-[#FBFBFA] rounded-btn border border-border">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted">Detected Severity</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <StatusBadge variant={selectedIssue.severity} size="md" />
                  <span className="text-text-muted text-[11px]">{selectedIssue.detectedAt}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted">Marketplace</span>
                <p className="font-mono font-semibold text-text-primary mt-0.5">
                  Amazon {selectedIssue.marketplace} ({selectedIssue.asin})
                </p>
              </div>
            </div>

            {/* Evidence & Business Impact */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Diagnostic Evidence</h4>
                <div className="p-3 bg-card border border-border rounded-btn text-text-secondary leading-relaxed">
                  {selectedIssue.evidence}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-text-primary mb-1">Estimated Business Impact</h4>
                <div className="p-3 bg-sand-light border border-sand-dark/40 rounded-btn text-text-secondary leading-relaxed font-medium">
                  {selectedIssue.businessImpact}
                </div>
              </div>
            </div>

            {/* Keepa Historical Chart (if applicable) */}
            {selectedIssue.keepaHistory && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-text-primary flex items-center gap-1.5">
                    <LineChartIcon className="w-4 h-4 text-primary" />
                    <span>Keepa-Style Pricing & Sales Rank Context</span>
                  </h4>
                  <span className="text-[10px] text-text-muted">Simulated Historical Feed</span>
                </div>

                <div className="h-44 w-full bg-[#FBFBFA] p-2 rounded-btn border border-border">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedIssue.keepaHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6E8E1" vertical={false} />
                      <XAxis dataKey="date" stroke="#929990" fontSize={10} tickLine={false} />
                      <YAxis stroke="#929990" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '8px',
                          borderColor: '#E6E8E1',
                          fontSize: '11px',
                        }}
                      />
                      <Line type="monotone" dataKey="price" name="Buy Box Price (£)" stroke="#345B49" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="buyBoxPrice" name="Winning Offer (£)" stroke="#B87559" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Claude AI Recommended Action & Editor */}
            <div className="p-4 bg-sage-light rounded-btn border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span>Claude AI Recommended Mitigation</span>
                </div>
                <button
                  onClick={() => handleClaudeDraft(selectedIssue.id)}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Regenerate Draft
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1">
                  Editable Mitigation Proposal:
                </label>
                <textarea
                  rows={3}
                  value={editableDraft}
                  onChange={(e) => setEditableDraft(e.target.value)}
                  className="w-full p-2.5 bg-card border border-border rounded-btn text-xs text-text-primary leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-text-muted">
                  *Human signoff required before submission to Amazon
                </span>
                <button
                  onClick={() => handleRequestReview(selectedIssue.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Review in Approval Center</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
