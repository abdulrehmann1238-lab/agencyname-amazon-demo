import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  ArrowLeft,
  Mail,
  Boxes,
  Percent,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { brands, products, inventory, costs, healthIssues, approvals, newsletters, setSelectedBrandId, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'profitability' | 'health' | 'approvals' | 'briefings'>('inventory');

  const brand = brands.find((b) => b.id === id) || brands[0];
  const brandProducts = products.filter((p) => p.brandId === brand.id);
  const brandInventory = inventory.filter((i) => i.brandId === brand.id);
  const brandCosts = costs.filter((c) => c.brandId === brand.id);
  const brandIssues = healthIssues.filter((h) => h.brandId === brand.id);
  const brandApprovals = approvals.filter((a) => a.brandId === brand.id);
  const brandNewsletter = newsletters.find((n) => n.brandId === brand.id);

  const handleSetGlobal = () => {
    setSelectedBrandId(brand.id);
    showToast(`Global filter set to ${brand.name}`, 'All dashboard modules updated.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Back and Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/clients')}
            className="p-2 text-text-secondary hover:text-text-primary rounded-btn hover:bg-sage transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-soft flex-shrink-0"
              style={{ backgroundColor: brand.accentColor }}
            >
              {brand.logoText}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  {brand.name}
                </h1>
                <StatusBadge variant="healthy" size="sm" label={`Score: ${brand.healthScore}/100`} />
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {brand.category} · Contact: {brand.contactName} ({brand.contactEmail})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSetGlobal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Set as Global Workspace Filter</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KPICard
          label="Monthly Target"
          value={`£${brand.monthlySalesTarget.toLocaleString()}`}
          subtitle="Annualized pacing"
        />
        <KPICard
          label="Active SKUs"
          value={brandProducts.length}
          subtitle={`Across ${brand.supportedMarketplaces.join(', ')}`}
        />
        <KPICard
          label="Catalog Health Score"
          value={`${brand.healthScore}/100`}
          subtitle="SP-API catalog rating"
          badge={<StatusBadge variant="healthy" size="sm" />}
        />
        <KPICard
          label="Pending Approvals"
          value={brandApprovals.filter((a) => a.status === 'needs_review').length}
          subtitle="Human signoff required"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border text-xs">
        {[
          { id: 'inventory', label: `Stock & Replenishment (${brandInventory.length})` },
          { id: 'profitability', label: `Profitability (${brandCosts.length})` },
          { id: 'health', label: `Listing Health (${brandIssues.length})` },
          { id: 'approvals', label: `Approvals Queue (${brandApprovals.length})` },
          { id: 'briefings', label: 'Latest Briefing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'inventory' && (
        <div className="bg-card rounded-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">Brand SKU Inventory Balances</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBFA] border-b border-border text-text-muted uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">SKU / Product</th>
                <th className="py-2.5 px-4 font-semibold text-right">FBA Stock</th>
                <th className="py-2.5 px-4 font-semibold text-right">3PL Warehouse</th>
                <th className="py-2.5 px-4 font-semibold text-right">Total Avail.</th>
                <th className="py-2.5 px-4 font-semibold text-right">Days of Cover</th>
                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {brandInventory.map((item) => (
                <tr key={item.id} className="hover:bg-sage/20">
                  <td className="py-3 px-4 font-medium text-text-primary">
                    <span className="font-mono text-primary mr-1.5">{item.sku}</span>
                    {item.productTitle}
                  </td>
                  <td className="py-3 px-4 font-mono text-right">{item.fbaStock}</td>
                  <td className="py-3 px-4 font-mono text-right">{item.thirdPartyStock}</td>
                  <td className="py-3 px-4 font-mono text-right font-bold">{item.totalStock}</td>
                  <td className="py-3 px-4 font-mono text-right font-semibold">
                    {item.daysOfCover} days
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge variant={item.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'profitability' && (
        <div className="bg-card rounded-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">SKU Financial Contribution</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBFA] border-b border-border text-text-muted uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">SKU</th>
                <th className="py-2.5 px-4 font-semibold text-right">Net Sales</th>
                <th className="py-2.5 px-4 font-semibold text-right">COGS</th>
                <th className="py-2.5 px-4 font-semibold text-right">Amazon Fees</th>
                <th className="py-2.5 px-4 font-semibold text-right">Ad Spend</th>
                <th className="py-2.5 px-4 font-semibold text-right">Net Profit</th>
                <th className="py-2.5 px-4 font-semibold text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {brandCosts.map((c) => (
                <tr key={c.id} className="hover:bg-sage/20">
                  <td className="py-3 px-4 font-mono text-primary font-semibold">{c.sku}</td>
                  <td className="py-3 px-4 font-mono text-right">£{c.netSales.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-right">£{c.costOfGoods.toFixed(2)}</td>
                  <td className="py-3 px-4 font-mono text-right">£{c.amazonFees.toFixed(2)}</td>
                  <td className="py-3 px-4 font-mono text-right">£{c.adSpendPerUnit.toFixed(2)}</td>
                  <td className="py-3 px-4 font-mono text-right font-bold text-text-primary">
                    £{c.netContribution.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-bold text-status-successText">
                    {c.contributionMarginPercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="space-y-3">
          {brandIssues.map((issue) => (
            <div key={issue.id} className="p-4 bg-card rounded-card border border-border shadow-soft">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold text-sm text-text-primary">{issue.issueType}</span>
                <StatusBadge variant={issue.severity} size="sm" />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-2">{issue.evidence}</p>
              <div className="p-3 bg-sand-light rounded-btn border border-sand-dark/40 text-xs text-text-secondary">
                <strong>Mitigation: </strong>{issue.proposedNextSteps}
              </div>
            </div>
          ))}

          {brandIssues.length === 0 && (
            <div className="p-8 text-center bg-card rounded-card border border-border text-xs text-text-muted">
              No active health issues detected for this brand.
            </div>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="space-y-3">
          {brandApprovals.map((appr) => (
            <div key={appr.id} className="p-4 bg-card rounded-card border border-border shadow-soft flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider">{appr.typeLabel}</span>
                <h4 className="font-semibold text-xs text-text-primary mt-0.5">{appr.title}</h4>
                <p className="text-[11px] text-text-muted mt-0.5">{appr.requestedAt}</p>
              </div>
              <StatusBadge variant={appr.status} size="sm" />
            </div>
          ))}

          {brandApprovals.length === 0 && (
            <div className="p-8 text-center bg-card rounded-card border border-border text-xs text-text-muted">
              No pending approvals for this brand.
            </div>
          )}
        </div>
      )}

      {activeTab === 'briefings' && brandNewsletter && (
        <div className="p-5 bg-card rounded-card border border-border shadow-soft space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">{brandNewsletter.subject}</h4>
              <p className="text-xs text-text-muted">{brandNewsletter.period}</p>
            </div>
            <StatusBadge variant={brandNewsletter.status} size="sm" />
          </div>
          <pre className="p-4 bg-[#FBFBFA] rounded-btn border border-border text-xs font-mono leading-relaxed whitespace-pre-wrap text-text-secondary">
            {brandNewsletter.content}
          </pre>
        </div>
      )}
    </div>
  );
};
