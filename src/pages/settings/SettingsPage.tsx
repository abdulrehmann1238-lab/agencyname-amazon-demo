import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Sparkles,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Database,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoScenarioId } from '../../types';

export const SettingsPage: React.FC = () => {
  const {
    activeScenario,
    applyScenario,
    resetAllDemoData,
    showToast,
  } = useApp();

  const [minMargin, setMinMargin] = useState(35);
  const [coverTarget, setCoverTarget] = useState(14);
  const [maxTacos, setMaxTacos] = useState(12);

  const scenarios: { id: DemoScenarioId; name: string; description: string }[] = [
    {
      id: 'healthy',
      name: 'Healthy Multi-Brand Portfolio',
      description: 'All brands operating smoothly above targets with balanced stock levels.',
    },
    {
      id: 'inventory_pressure',
      name: 'Critical Inventory Depletion',
      description: 'Hero SKU Botanical Serum (BOT-001) drops to 5.1 days cover, triggering replenishment.',
    },
    {
      id: 'ad_decline',
      name: 'Advertising Efficiency Spike',
      description: 'ACoS expands across non-brand generic keywords requiring negative match review.',
    },
    {
      id: 'listing_issue',
      name: 'Catalog Suppression Event',
      description: 'Missing UK cosmetic attribute suppresses Vitamin C Moisturizer, queuing Claude patch.',
    },
    {
      id: 'onboarding',
      name: '3PL Pallet Arrival Trigger',
      description: 'Pick Pack N Post confirms inbound stock, triggering automated 10-stage onboarding.',
    },
  ];

  const handleSaveThresholds = () => {
    showToast('Thresholds updated', 'Applied new margin & cover targets across telemetry views.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-3 border-b border-border">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
          Workspace Settings & Operational Controls
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Configure agency thresholds, test simulated operational scenarios and manage demo state.
        </p>
      </div>

      {/* Demo Scenario Switcher Panel */}
      <div className="p-5 bg-card rounded-card border border-border shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <h2 className="text-sm font-semibold text-text-primary">
              Demo Scenario Switcher
            </h2>
          </div>
          <button
            onClick={resetAllDemoData}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Original State
          </button>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Switch between predefined operational states to test how AUREL responds to stockouts, ad spikes, suppressions, and onboarding:
        </p>

        <div className="space-y-2">
          {scenarios.map((scen) => (
            <div
              key={scen.id}
              onClick={() => applyScenario(scen.id)}
              className={`p-3.5 rounded-btn border transition-all cursor-pointer flex items-center justify-between ${
                activeScenario === scen.id
                  ? 'border-primary bg-sage/40 shadow-subtle'
                  : 'border-border bg-[#FBFBFA] hover:border-text-muted'
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-text-primary">{scen.name}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{scen.description}</p>
              </div>

              {activeScenario === scen.id && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Operational Thresholds Form */}
      <div className="p-5 bg-card rounded-card border border-border shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Sliders className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">
            Agency Operational Thresholds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Minimum Target Margin (%)
            </label>
            <input
              type="number"
              value={minMargin}
              onChange={(e) => setMinMargin(Number(e.target.value))}
              className="w-full p-2 bg-[#FBFBFA] border border-border rounded-btn font-mono font-semibold text-text-primary text-xs"
            />
            <p className="text-[10px] text-text-muted mt-1">Triggers suboptimal warning in Profit module</p>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Target FBA Days of Cover (Days)
            </label>
            <input
              type="number"
              value={coverTarget}
              onChange={(e) => setCoverTarget(Number(e.target.value))}
              className="w-full p-2 bg-[#FBFBFA] border border-border rounded-btn font-mono font-semibold text-text-primary text-xs"
            />
            <p className="text-[10px] text-text-muted mt-1">Standard buffer before replenishment drafting</p>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">
              Maximum TACoS Ceiling (%)
            </label>
            <input
              type="number"
              value={maxTacos}
              onChange={(e) => setMaxTacos(Number(e.target.value))}
              className="w-full p-2 bg-[#FBFBFA] border border-border rounded-btn font-mono font-semibold text-text-primary text-xs"
            />
            <p className="text-[10px] text-text-muted mt-1">Triggers ad budget efficiency alert</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveThresholds}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            Save Target Parameters
          </button>
        </div>
      </div>

      {/* Production Infrastructure Cost Estimate (PRD 22.5) */}
      <div className="p-5 bg-card rounded-card border border-border shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <DollarSign className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">
            Production Infrastructure & Operating Cost Overview
          </h2>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          The proposed architecture is engineered to run on lightweight, cost-effective serverless cloud primitives to keep agency overhead predictable:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
            <span className="font-semibold text-text-primary block">Google Cloud BigQuery & Storage</span>
            <p className="text-[11px] text-text-muted mt-0.5">
              Estimated: £40 – £85 / month across 24 brands (Partitioned tables, 90-day active cache).
            </p>
          </div>

          <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
            <span className="font-semibold text-text-primary block">Amazon SP-API & Ads API Quotas</span>
            <p className="text-[11px] text-text-muted mt-0.5">
              Free of charge (included with professional Seller / Vendor accounts).
            </p>
          </div>

          <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
            <span className="font-semibold text-text-primary block">Anthropic Claude 3.5 Sonnet Tokens</span>
            <p className="text-[11px] text-text-muted mt-0.5">
              Estimated: £25 – £45 / month for weekly client briefings & catalog appeals.
            </p>
          </div>

          <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
            <span className="font-semibold text-text-primary block">Twilio WhatsApp Business Gateway</span>
            <p className="text-[11px] text-text-muted mt-0.5">
              Pay-per-conversation: ~£0.038 per approved client alert dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
