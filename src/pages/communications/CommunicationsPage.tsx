import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  FileSpreadsheet,
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  BarChart2,
  Share2,
  Download,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { NewsletterDraft } from '../../types';

export const CommunicationsPage: React.FC = () => {
  const {
    newsletters,
    brands,
    updateNewsletterDraft,
    generateClaudeNewsletter,
    submitNewsletterForApproval,
    showToast,
  } = useApp();

  const [activeBrandId, setActiveBrandId] = useState<string>('b-alder');
  const [activeChannel, setActiveChannel] = useState<'email' | 'whatsapp' | 'excel'>('email');
  const [activeDraftId, setActiveDraftId] = useState<string>('nws-01');
  const [isDraftingAI, setIsDraftingAI] = useState<boolean>(false);
  const [alternativeIndex, setAlternativeIndex] = useState<number>(0);

  const selectedBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
  const currentDraft = newsletters.find((n) => n.id === activeDraftId) || newsletters[0];

  const handleChannelSwitch = (channel: 'email' | 'whatsapp' | 'excel') => {
    setActiveChannel(channel);
    // select appropriate draft if available
    const match = newsletters.find((n) => n.brandId === activeBrandId && n.channel === channel);
    if (match) {
      setActiveDraftId(match.id);
    } else {
      updateNewsletterDraft(currentDraft.id, currentDraft.content, channel);
    }
  };

  const handleBrandSwitch = (brandId: string) => {
    setActiveBrandId(brandId);
    const match = newsletters.find((n) => n.brandId === brandId);
    if (match) {
      setActiveDraftId(match.id);
      setActiveChannel(match.channel);
    }
  };

  const handleClaudeGenerate = () => {
    setIsDraftingAI(true);
    setTimeout(() => {
      setIsDraftingAI(false);
      setAlternativeIndex((prev) => prev + 1);
      generateClaudeNewsletter(currentDraft.id, alternativeIndex + 1);
    }, 700);
  };

  const handleSubmitForApproval = () => {
    submitNewsletterForApproval(currentDraft.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Client Communications & Executive Reporting
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              AI Drafting with Human Review
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Transform raw operational telemetry into polished client briefings across Email, WhatsApp and Excel sheets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSubmitForApproval}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit to Approval Center</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KPICard
          label="Briefings Prepared"
          value="18"
          subtitle="This monthly cycle"
        />
        <KPICard
          label="Pending Client Signoff"
          value="3"
          subtitle="In Approval Center"
          badge={<span className="w-2 h-2 rounded-full bg-status-warningText" />}
        />
        <KPICard
          label="Approved in Demo"
          value="15"
          subtitle="Dispatch verified"
        />
        <KPICard
          label="Primary Communication Mode"
          value="Multi-Channel"
          subtitle="Email + WhatsApp + Sheets"
        />
      </div>

      {/* Main Two-Panel Newsletter Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Configuration & Editor (5 Cols) */}
        <div className="lg:col-span-5 bg-card rounded-card border border-border p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">
              Briefing Parameters
            </h2>
            <StatusBadge variant={currentDraft.status} size="sm" />
          </div>

          {/* Brand Switcher */}
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
              Target Client Brand
            </label>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleBrandSwitch(b.id)}
                  className={`p-2.5 rounded-btn border text-left text-xs transition-all flex items-center gap-2 ${
                    activeBrandId === b.id
                      ? 'border-primary bg-sage/40 font-semibold text-text-primary'
                      : 'border-border text-text-secondary hover:border-text-muted'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] text-white flex-shrink-0"
                    style={{ backgroundColor: b.accentColor }}
                  >
                    {b.logoText}
                  </span>
                  <span className="truncate">{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Communication Channel Tabs */}
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
              Dispatch Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleChannelSwitch('email')}
                className={`p-2 rounded-btn border text-xs flex items-center justify-center gap-1.5 transition-all ${
                  activeChannel === 'email'
                    ? 'border-primary bg-sage text-primary font-semibold'
                    : 'border-border text-text-secondary hover:bg-sage-light'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Briefing</span>
              </button>

              <button
                onClick={() => handleChannelSwitch('whatsapp')}
                className={`p-2 rounded-btn border text-xs flex items-center justify-center gap-1.5 transition-all ${
                  activeChannel === 'whatsapp'
                    ? 'border-primary bg-sage text-primary font-semibold'
                    : 'border-border text-text-secondary hover:bg-sage-light'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Alert</span>
              </button>

              <button
                onClick={() => handleChannelSwitch('excel')}
                className={`p-2 rounded-btn border text-xs flex items-center justify-center gap-1.5 transition-all ${
                  activeChannel === 'excel'
                    ? 'border-primary bg-sage text-primary font-semibold'
                    : 'border-border text-text-secondary hover:bg-sage-light'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel Report</span>
              </button>
            </div>
          </div>

          {/* Subject / Headline */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Message Subject / Header
            </label>
            <input
              type="text"
              value={currentDraft.subject}
              onChange={(e) =>
                updateNewsletterDraft(currentDraft.id, currentDraft.content, activeChannel)
              }
              className="w-full p-2 bg-[#FBFBFA] border border-border rounded-btn text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Body Content (Markdown Supported)
              </label>
              <button
                onClick={handleClaudeGenerate}
                disabled={isDraftingAI}
                className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isDraftingAI ? 'animate-spin' : ''}`} />
                <span>{isDraftingAI ? 'Claude is Drafting...' : 'Draft with Claude'}</span>
              </button>
            </div>
            <textarea
              rows={10}
              value={currentDraft.content}
              onChange={(e) =>
                updateNewsletterDraft(currentDraft.id, e.target.value, activeChannel)
              }
              className="w-full p-3 bg-card border border-border rounded-btn text-xs text-text-primary font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Footer controls */}
          <div className="pt-2 flex items-center justify-between border-t border-border text-xs">
            <span className="text-[11px] text-text-muted">
              Auto-saved locally
            </span>
            <button
              onClick={() => showToast('Draft saved locally', undefined, 'info')}
              className="px-3 py-1.5 font-medium text-text-secondary hover:text-text-primary rounded-btn hover:bg-sage transition-colors"
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* Right Panel: Live Dynamic Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-card rounded-card border border-border p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedBrand.accentColor }}
              />
              <h3 className="text-sm font-semibold text-text-primary">
                Live Client Preview · {selectedBrand.name}
              </h3>
            </div>

            <span className="text-xs text-text-muted font-mono uppercase">
              {activeChannel} Rendering
            </span>
          </div>

          {/* Dynamic Channel Previews */}
          {activeChannel === 'email' && (
            <div className="p-6 bg-[#FDFDFB] rounded-card border border-border shadow-subtle space-y-4 font-sans text-xs text-text-primary">
              {/* Email header with brand accent */}
              <div
                className="p-4 rounded-btn text-white flex items-center justify-between"
                style={{ backgroundColor: selectedBrand.accentColor }}
              >
                <div>
                  <h4 className="text-sm font-bold tracking-tight">{selectedBrand.name}</h4>
                  <p className="text-[10px] opacity-80">Amazon Operations Briefing · {currentDraft.period}</p>
                </div>
                <span className="text-xs font-mono font-semibold opacity-90">AUREL</span>
              </div>

              {/* Key KPI Strip */}
              <div className="grid grid-cols-4 gap-2 p-3 bg-card rounded-btn border border-border text-center">
                <div>
                  <span className="text-[10px] text-text-muted uppercase">Revenue</span>
                  <p className="text-xs font-bold font-mono text-text-primary mt-0.5">
                    {currentDraft.keyMetrics.revenue}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase">Ad Spend</span>
                  <p className="text-xs font-bold font-mono text-text-primary mt-0.5">
                    {currentDraft.keyMetrics.spend}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase">TACoS</span>
                  <p className="text-xs font-bold font-mono text-primary mt-0.5">
                    {currentDraft.keyMetrics.tacos}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase">Volume</span>
                  <p className="text-xs font-bold font-mono text-text-primary mt-0.5">
                    {currentDraft.keyMetrics.units}
                  </p>
                </div>
              </div>

              {/* Rendered content */}
              <div className="p-4 bg-white rounded-btn border border-border leading-relaxed whitespace-pre-wrap font-sans text-text-secondary">
                {currentDraft.content}
              </div>

              <div className="p-3 bg-sage-light rounded-btn text-[11px] text-text-muted text-center border border-border">
                Dispatched securely via agency gateway (reports@aurel-agency.co.uk) upon human approval.
              </div>
            </div>
          )}

          {activeChannel === 'whatsapp' && (
            <div className="p-6 bg-[#E5DDD5] rounded-card border border-[#D5CDC5] flex justify-center">
              <div className="max-w-md w-full bg-white p-4 rounded-2xl shadow-elevated text-xs space-y-2 border border-black/5">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ backgroundColor: selectedBrand.accentColor }}
                    >
                      {selectedBrand.logoText}
                    </span>
                    <span className="font-semibold text-text-primary">{selectedBrand.name} VIP</span>
                  </div>
                  <span className="text-[10px] text-text-muted">Twilio HSM</span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed text-text-secondary pt-1 font-sans">
                  {currentDraft.content}
                </div>

                <div className="text-right pt-1 text-[10px] text-text-muted">
                  09:42 · Sent via Twilio WhatsApp Gateway ✓✓
                </div>
              </div>
            </div>
          )}

          {activeChannel === 'excel' && (
            <div className="p-4 bg-[#F5F8F5] rounded-card border border-border font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-bold text-text-primary">
                  {selectedBrand.name} — Automated Financial & Vendor Reconciliation
                </span>
                <span className="text-[11px] text-primary font-semibold">.XLSX Format</span>
              </div>
              <div className="bg-white p-3 rounded border border-border text-[11px] leading-relaxed whitespace-pre-wrap text-text-secondary overflow-x-auto">
                {currentDraft.content}
              </div>
            </div>
          )}

          {/* Looker Studio Style Dashboard Preview Embed */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-text-primary text-xs">
                <BarChart2 className="w-4 h-4 text-primary" />
                <span>Embedded Looker Studio Reporting View (Brand: {selectedBrand.name})</span>
              </div>
              <span className="text-[10px] text-text-muted">BigQuery Direct Cache</span>
            </div>

            <div className="p-4 bg-[#FBFBFA] rounded-card border border-border grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-card rounded border border-border">
                <span className="text-[10px] text-text-muted">Monthly Target (£145k)</span>
                <p className="text-sm font-bold font-mono text-primary mt-0.5">82% Achieved</p>
              </div>
              <div className="p-2 bg-card rounded border border-border">
                <span className="text-[10px] text-text-muted">Organic vs Ad Ratio</span>
                <p className="text-sm font-bold font-mono text-text-primary mt-0.5">64% : 36%</p>
              </div>
              <div className="p-2 bg-card rounded border border-border">
                <span className="text-[10px] text-text-muted">Avg Customer Review</span>
                <p className="text-sm font-bold font-mono text-text-primary mt-0.5">4.6 ★ (1.4k)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
