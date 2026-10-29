import React, { useState } from 'react';
import {
  CheckCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  MessageSquare,
  ShieldCheck,
  Filter,
  FileText,
  Boxes,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ApprovalItem } from '../../types';

export const ApprovalsPage: React.FC = () => {
  const {
    approvals,
    approveItem,
    rejectItem,
    requestChangesItem,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'needs_review' | 'high' | 'approved' | 'rejected' | 'changes_requested'>('needs_review');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Changes requested modal
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [changesComment, setChangesComment] = useState('');

  // Filtered queue
  const filteredQueue = approvals.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'needs_review') return item.status === 'needs_review';
    if (activeTab === 'approved') return item.status === 'approved';
    if (activeTab === 'rejected') return item.status === 'rejected';
    if (activeTab === 'changes_requested') return item.status === 'changes_requested';
    if (activeTab === 'high') return item.priority === 'urgent' || item.priority === 'high';
    return true;
  });

  const awaitingCount = approvals.filter((a) => a.status === 'needs_review').length;
  const highPriorityCount = approvals.filter(
    (a) => a.status === 'needs_review' && (a.priority === 'urgent' || a.priority === 'high')
  ).length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const changesCount = approvals.filter((a) => a.status === 'changes_requested').length;

  const handleApprove = (item: ApprovalItem) => {
    approveItem(item.id);
    if (selectedItem?.id === item.id) {
      setSelectedItem({ ...item, status: 'approved' });
    }
  };

  const handleOpenReject = (item: ApprovalItem) => {
    setSelectedItem(item);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedItem) return;
    rejectItem(selectedItem.id, rejectReason || 'Declined during operational review.');
    setRejectModalOpen(false);
  };

  const handleOpenChanges = (item: ApprovalItem) => {
    setSelectedItem(item);
    setChangesComment('');
    setChangesModalOpen(true);
  };

  const handleConfirmChanges = () => {
    if (!selectedItem) return;
    requestChangesItem(selectedItem.id, changesComment || 'Please adjust parameters before re-submission.');
    setChangesModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Human Approval Center
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              Zero Autonomous API Dispatches
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            The agency operational control gate: review recommendations, client communications, and SP-API catalog feeds before execution.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-text-muted flex items-center gap-1.5 bg-[#EAECE4] px-3 py-1.5 rounded-btn">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Multi-Brand Accountability</span>
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KPICard
          label="Awaiting Human Review"
          value={awaitingCount}
          subtitle="Action required"
          badge={awaitingCount > 0 ? <span className="w-2 h-2 rounded-full bg-status-warningText" /> : undefined}
        />
        <KPICard
          label="Urgent Priority"
          value={highPriorityCount}
          subtitle="Immediate impact"
          badge={highPriorityCount > 0 ? <span className="w-2 h-2 rounded-full bg-status-errorText" /> : undefined}
        />
        <KPICard
          label="Approved in Demo"
          value={approvedCount}
          subtitle="Local state updated"
        />
        <KPICard
          label="Changes Requested"
          value={changesCount}
          subtitle="Awaiting revision"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
        {[
          { id: 'needs_review', label: `Needs Review (${awaitingCount})` },
          { id: 'high', label: `High Priority (${highPriorityCount})` },
          { id: 'all', label: `All Queue (${approvals.length})` },
          { id: 'approved', label: `Approved (${approvedCount})` },
          { id: 'changes_requested', label: `Changes Requested (${changesCount})` },
          { id: 'rejected', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-btn transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-sage'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Split Review Workspace: List on left (4 cols), Inspection on right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Queue Items (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredQueue.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-card border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-sage/30 shadow-card'
                    : 'border-border bg-card hover:border-[#D5DCD0]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {item.typeLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge variant={item.priority} size="sm" />
                    <StatusBadge variant={item.status} size="sm" />
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-text-primary line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-text-muted">
                  <span>{item.brandName} · {item.marketplace}</span>
                  <span>{item.requestedAt}</span>
                </div>
              </div>
            );
          })}

          {filteredQueue.length === 0 && (
            <div className="p-8 text-center bg-card rounded-card border border-border border-dashed text-xs text-text-muted">
              No items in this filter view.
            </div>
          )}
        </div>

        {/* Right Side: Detailed Review Workspace (7 cols) */}
        <div className="lg:col-span-7 bg-card rounded-card border border-border p-6 shadow-soft space-y-5">
          {selectedItem ? (
            <>
              {/* Workspace Header */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-sage px-2 py-0.5 rounded">
                      {selectedItem.typeLabel}
                    </span>
                    <StatusBadge variant={selectedItem.status} size="sm" />
                  </div>
                  <h2 className="text-base font-bold text-text-primary tracking-tight">
                    {selectedItem.title}
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    Requested by <strong>{selectedItem.requestedBy}</strong> · {selectedItem.requestedAt}
                  </p>
                </div>
              </div>

              {/* Supporting Evidence */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Supporting Evidence & Diagnostic Telemetry
                </h4>
                <div className="p-3.5 bg-sand-light rounded-btn border border-sand-dark/40 text-xs text-text-secondary leading-relaxed">
                  {selectedItem.evidence}
                </div>
              </div>

              {/* Proposed Action */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Proposed Action to be Authorized
                </h4>
                <div className="p-3.5 bg-[#FBFBFA] rounded-btn border border-border text-xs text-text-primary leading-relaxed font-medium">
                  {selectedItem.proposedAction}
                </div>
              </div>

              {/* Draft Payload (JSON or text) */}
              {selectedItem.draftContent && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Prepared Content / API Payload (Editable Preview)
                  </h4>
                  <pre className="p-3.5 bg-[#202820] text-[#E8EFE8] rounded-btn text-[11px] font-mono leading-relaxed overflow-x-auto">
                    {selectedItem.draftContent}
                  </pre>
                </div>
              )}

              {/* Review History / Comments */}
              {selectedItem.reviewerComment && (
                <div className="p-3 bg-sage-light rounded-btn border border-border text-xs text-text-secondary">
                  <strong>Reviewer Comment: </strong>
                  {selectedItem.reviewerComment}
                </div>
              )}

              {/* Decision Footer Buttons */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-text-muted">
                  Status: <strong>{selectedItem.status.replace('_', ' ')}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReject(selectedItem)}
                    className="px-3 py-1.5 text-xs font-medium text-status-errorText hover:bg-status-errorBg border border-[#EFCAC2] rounded-btn transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleOpenChanges(selectedItem)}
                    className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-sand border border-border rounded-btn transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    onClick={() => handleApprove(selectedItem)}
                    disabled={selectedItem.status === 'approved'}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedItem.status === 'approved' ? 'Approved in Demo' : 'Approve Execution'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-text-muted">
              <CheckCheck className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
              Select an item from the queue to review supporting evidence and authorize proposed execution.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Proposed Action"
        subtitle="Please specify operational reason for rejection"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-status-errorText rounded-btn transition-colors"
            >
              Confirm Rejection
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-text-secondary">
            Declining this proposal will record the rejection in local telemetry and prevent any further automated draft staging for this cycle.
          </p>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Price point too low, or catalog attribute needs supplier verification..."
            className="w-full p-2.5 bg-card border border-border rounded-btn text-xs text-text-primary leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </Modal>

      {/* Request Changes Modal */}
      <Modal
        isOpen={changesModalOpen}
        onClose={() => setChangesModalOpen(false)}
        title="Request Revisions"
        subtitle="Add instructions for Claude or Account Manager"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setChangesModalOpen(false)}
              className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmChanges}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-primary rounded-btn transition-colors"
            >
              Submit Change Request
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <textarea
            rows={3}
            value={changesComment}
            onChange={(e) => setChangesComment(e.target.value)}
            placeholder="Specify what wording or parameters need adjustment..."
            className="w-full p-2.5 bg-card border border-border rounded-btn text-xs text-text-primary leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </Modal>
    </div>
  );
};
