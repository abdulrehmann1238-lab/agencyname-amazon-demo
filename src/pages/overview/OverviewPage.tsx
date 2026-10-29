import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Boxes,
  Percent,
  ShieldAlert,
  ArrowRight,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ExportModal } from '../../components/common/ExportModal';
import { PERFORMANCE_HISTORY } from '../../data/mockData';

export const OverviewPage: React.FC = () => {
  const {
    brands,
    inventory,
    costs,
    approvals,
    pendingApprovalCount,
    healthIssues,
    dateRange,
    selectedBrandId,
    selectedBrand,
    showToast,
  } = useApp();

  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Filtered performance dataset according to selected dateRange
  const historyData = PERFORMANCE_HISTORY[dateRange] || PERFORMANCE_HISTORY['30d'];

  // Calculate live dynamic metrics from context
  const totalSales = costs.reduce((acc, c) => acc + c.netSales, 0);
  const totalAdSpend = costs.reduce((acc, c) => acc + c.totalAdSpend, 0);
  const totalContribution = costs.reduce((acc, c) => acc + c.netContribution, 0);
  const averageMargin = totalSales > 0 ? ((totalContribution / totalSales) * 100).toFixed(1) : '33.3';
  const tacosPercent = totalSales > 0 ? ((totalAdSpend / totalSales) * 100).toFixed(1) : '11.0';
  const criticalStockCount = inventory.filter((i) => i.daysOfCover < 7).length;
  const criticalIssuesCount = healthIssues.filter((h) => h.status !== 'resolved').length;

  const handleSimulatedRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Simulated Data Refreshed', 'Reconciled latest mock SP-API orders and 3PL stock receipts.', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Executive Overview
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              Simulated Data · 08:42 UTC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Consolidated operational health across Seller Central, Vendor Central and Amazon Ads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSimulatedRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-card hover:bg-sage border border-border rounded-btn transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          <button
            onClick={() => setExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <KPICard
          label="Total Portfolio Sales"
          value={`£${(totalSales * 2.2).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`}
          change={8.4}
          changePeriod="vs prior period"
          subtitle="All channels combined"
        />
        <KPICard
          label="Ad Spend (TACoS)"
          value={`£${(totalAdSpend * 2.1).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`}
          subtitle={`TACoS: ${tacosPercent}% (Target <12%)`}
          change={-1.2}
          changePeriod="ACoS efficiency"
        />
        <KPICard
          label="Net Contribution"
          value={`£${(totalContribution * 2.2).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`}
          subtitle={`Net Margin: ${averageMargin}%`}
          change={4.8}
        />
        <KPICard
          label="Ordered Units"
          value="8,462"
          subtitle="1,280 tracked SKUs"
          change={9.1}
        />
        <KPICard
          label="Pending Approvals"
          value={pendingApprovalCount}
          subtitle="Human review required"
          badge={
            pendingApprovalCount > 0 ? (
              <span className="w-2 h-2 rounded-full bg-status-warningText" />
            ) : undefined
          }
          onClick={() => navigate('/app/approvals')}
        />
        <KPICard
          label="Stockout Exposure"
          value={criticalStockCount}
          subtitle="SKUs below 7 days cover"
          badge={
            criticalStockCount > 0 ? (
              <span className="w-2 h-2 rounded-full bg-status-errorText" />
            ) : undefined
          }
          onClick={() => navigate('/app/inventory')}
        />
      </div>

      {/* Main Charts & Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Time-Series Performance Chart */}
        <div className="lg:col-span-2 bg-card rounded-card border border-border p-5 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary tracking-tight">
                Sales & Advertising Attribution
              </h2>
              <p className="text-xs text-text-secondary">
                Daily reconciliation of Total Sales, Ad-Attributed Sales and Organic Baseline.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#345B49]" /> Total
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B87559]" /> Ad Sales
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DDE5D6]" /> Organic
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#345B49" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#345B49" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B87559" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B87559" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E8E1" vertical={false} />
                <XAxis dataKey="date" stroke="#929990" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#929990"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `£${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(val: number) => [`£${val.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    borderColor: '#E6E8E1',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  name="Total Sales"
                  stroke="#345B49"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="adSales"
                  name="Ad-Attributed Sales"
                  stroke="#B87559"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAd)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Organic Sales Share: <strong>64.2%</strong></span>
            <span>Rolling 14-day attribution reconciled with SP-API Settlement</span>
          </div>
        </div>

        {/* Right 1 Col: Urgent Operational Queue */}
        <div className="bg-card rounded-card border border-border p-5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">
                Awaiting Human Action
              </h2>
              <Link
                to="/app/approvals"
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                View all ({pendingApprovalCount})
              </Link>
            </div>

            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Consequential operational changes drafted by Claude and telemetry rules waiting for human signoff.
            </p>

            <div className="space-y-3">
              {approvals
                .filter((a) => a.status === 'needs_review')
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate('/app/approvals')}
                    className="p-3 rounded-btn border border-border hover:border-primary hover:bg-sage/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {item.typeLabel}
                      </span>
                      <StatusBadge variant={item.priority} size="sm" />
                    </div>
                    <p className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-text-muted mt-1 line-clamp-1">
                      {item.brandName} · {item.marketplace}
                    </p>
                  </div>
                ))}

              {pendingApprovalCount === 0 && (
                <div className="p-6 text-center text-xs text-text-muted bg-sage-light rounded-btn border border-border">
                  <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-1" />
                  All approvals clear. No pending items.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <Link
              to="/app/approvals"
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-primary bg-sage hover:bg-sage-dark rounded-btn transition-colors"
            >
              <span>Open Approval Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Brand Portfolio Matrix Table */}
      <div className="bg-card rounded-card border border-border shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Client Brand Portfolio Matrix
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Live status across managed Seller Central and Vendor Central client workspaces.
            </p>
          </div>

          <Link
            to="/app/clients"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>Full Brand Roster</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBFA] border-b border-border text-text-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Brand & Category</th>
                <th className="py-3 px-4 font-semibold">Channels</th>
                <th className="py-3 px-4 font-semibold">Marketplaces</th>
                <th className="py-3 px-4 font-semibold">Monthly Sales Target</th>
                <th className="py-3 px-4 font-semibold text-right">Estimated Sales</th>
                <th className="py-3 px-4 font-semibold text-right">TACoS</th>
                <th className="py-3 px-4 font-semibold text-right">Net Margin</th>
                <th className="py-3 px-4 font-semibold text-center">Health</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {brands.map((brand) => {
                const brandCosts = costs.filter((c) => c.brandId === brand.id);
                const bSales = brandCosts.reduce((acc, c) => acc + c.netSales, 0) || brand.monthlySalesTarget * 0.85;
                const targetPercent = Math.min(100, Math.round((bSales / brand.monthlySalesTarget) * 100));

                return (
                  <tr
                    key={brand.id}
                    className="hover:bg-[#F9FAF8] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-soft flex-shrink-0"
                          style={{ backgroundColor: brand.accentColor }}
                        >
                          {brand.logoText}
                        </span>
                        <div>
                          <p className="font-semibold text-text-primary text-xs">
                            {brand.name}
                          </p>
                          <p className="text-[10px] text-text-muted">{brand.category}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {brand.channels.map((ch) => (
                          <span
                            key={ch}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                              ch === 'vendor'
                                ? 'bg-olive text-[#3F4832] border border-[#CCD8BF]'
                                : 'bg-sage text-primary border border-[#D5E2D5]'
                            }`}
                          >
                            {ch === 'vendor' ? 'Vendor' : 'Seller'}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {brand.supportedMarketplaces.map((m) => (
                          <span
                            key={m}
                            className="px-1.5 py-0.5 rounded bg-[#F2F3ED] text-[10px] font-mono text-text-secondary"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-mono text-text-primary">
                            £{bSales.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-text-muted">{targetPercent}%</span>
                        </div>
                        <div className="w-full bg-[#E6E8E1] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${targetPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-right text-text-primary">
                      £{bSales.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-right text-text-secondary">
                      11.2%
                    </td>

                    <td className="py-3.5 px-4 font-mono text-right text-status-successText font-medium">
                      36.4%
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-sage px-2 py-0.5 rounded-full">
                        {brand.healthScore}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/app/clients/${brand.id}`)}
                        className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Operational Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/app/inventory')}
          className="p-4 bg-card rounded-card border border-border hover:border-primary hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <Boxes className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-semibold text-text-muted">Module 2</span>
          </div>
          <h3 className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
            Unified Stock & 3PLs
          </h3>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            Consolidates FBA, Pick Pack N Post and Mintsoft inventory into days of cover.
          </p>
        </div>

        <div
          onClick={() => navigate('/app/profitability')}
          className="p-4 bg-card rounded-card border border-border hover:border-primary hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <Percent className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-semibold text-text-muted">Module 3</span>
          </div>
          <h3 className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
            Profit per SKU
          </h3>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            Real net contribution subtracting COGS, landed freight, Amazon fees and ad spend.
          </p>
        </div>

        <div
          onClick={() => navigate('/app/expansion')}
          className="p-4 bg-card rounded-card border border-border hover:border-primary hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-semibold text-text-muted">Module 5</span>
          </div>
          <h3 className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
            Marketplace Expansion
          </h3>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            Multi-step launch wizard with AI translations, readiness checks & approval gate.
          </p>
        </div>

        <div
          onClick={() => navigate('/app/communications')}
          className="p-4 bg-card rounded-card border border-border hover:border-primary hover:shadow-card transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-semibold text-text-muted">Module 7</span>
          </div>
          <h3 className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
            Client Briefings
          </h3>
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            Email & WhatsApp newsletter builder with client branding and Claude drafting.
          </p>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        reportName="Portfolio Executive Summary"
        dataSummary="Consolidated sales, advertising attribution, and SKU profitability for all managed accounts."
      />
    </div>
  );
};
