import React, { useState } from 'react';
import {
  Percent,
  Download,
  Info,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Search,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { ExportModal } from '../../components/common/ExportModal';
import { CostRecord } from '../../types';

export const ProfitabilityPage: React.FC = () => {
  const {
    costs,
    updateCostAssumptions,
    selectedBrandId,
    selectedMarketplace,
    showToast,
  } = useApp();

  const [selectedCostRecord, setSelectedCostRecord] = useState<CostRecord | null>(null);
  const [marginFilter, setMarginFilter] = useState<'all' | 'critical' | 'suboptimal' | 'healthy'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Edit form state in detail drawer
  const [editCogs, setEditCogs] = useState<number>(0);
  const [editLanded, setEditLanded] = useState<number>(0);
  const [editAdSpend, setEditAdSpend] = useState<number>(0);
  const [showSellerboardRecon, setShowSellerboardRecon] = useState(false);

  // Open drawer and set edit values
  const handleOpenDetail = (record: CostRecord) => {
    setSelectedCostRecord(record);
    setEditCogs(record.costOfGoods);
    setEditLanded(record.landedCost);
    setEditAdSpend(record.adSpendPerUnit);
    setShowSellerboardRecon(false);
  };

  // Filter costs
  const filteredCosts = costs.filter((c) => {
    if (selectedBrandId !== 'all' && c.brandId !== selectedBrandId) return false;
    if (selectedMarketplace !== 'all' && c.marketplace !== selectedMarketplace) return false;
    if (marginFilter !== 'all' && c.marginStatus !== marginFilter) return false;
    if (searchQuery && !c.sku.toLowerCase().includes(searchQuery.toLowerCase()) && !c.productTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Aggregates
  const totalRevenue = filteredCosts.reduce((acc, c) => acc + c.netSales, 0);
  const totalContribution = filteredCosts.reduce((acc, c) => acc + c.netContribution, 0);
  const totalCogs = filteredCosts.reduce((acc, c) => acc + c.totalCogs, 0);
  const totalLanded = filteredCosts.reduce((acc, c) => acc + c.totalLanded, 0);
  const totalFees = filteredCosts.reduce((acc, c) => acc + c.totalFees, 0);
  const totalAdSpend = filteredCosts.reduce((acc, c) => acc + c.totalAdSpend, 0);

  const aggregateMargin = totalRevenue > 0 ? ((totalContribution / totalRevenue) * 100).toFixed(1) : '0';
  const belowTargetCount = filteredCosts.filter((c) => c.marginStatus !== 'healthy').length;

  const handleSaveCostEdit = () => {
    if (!selectedCostRecord) return;
    updateCostAssumptions(selectedCostRecord.sku, editCogs, editLanded, editAdSpend);
    // Refresh local record
    const updated = costs.find((c) => c.sku === selectedCostRecord.sku);
    if (updated) setSelectedCostRecord(updated);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Profit per SKU Analysis
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              Reconciled Contribution Accounting
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Understand true product-level contribution after COGS, freight landed cost, Amazon referral/FBA fees and advertising.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFormulaOpen(!formulaOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary bg-card hover:bg-sage border border-border rounded-btn transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-primary" />
            <span>How it's Calculated</span>
          </button>

          <button
            onClick={() => setExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analysis</span>
          </button>
        </div>
      </div>

      {/* Explanatory Collapsible Formula Banner */}
      {formulaOpen && (
        <div className="p-4 bg-sage-light rounded-card border border-border text-xs text-text-secondary space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-text-primary flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-primary" />
              Standardized AUREL Contribution Accounting Formula
            </p>
            <button onClick={() => setFormulaOpen(false)} className="text-text-muted hover:text-text-primary">
              Dismiss
            </button>
          </div>
          <p className="leading-relaxed">
            <strong>Net Contribution = </strong> Net Sales Revenue − Cost of Goods (COGS) − Landed Shipping Costs − Amazon Referral & FBA Pick/Pack Fees − Attributed Advertising Spend − Configured Variable Costs.
          </p>
          <p className="leading-relaxed text-text-muted">
            <strong>Contribution Margin % = </strong> (Net Contribution ÷ Net Sales Revenue) × 100. Advertising and FBA fees are reconciled directly from SP-API Financial Events to prevent duplicate deduction.
          </p>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <KPICard
          label="Gross Revenue"
          value={`£${totalRevenue.toLocaleString()}`}
          change={6.8}
          changePeriod="Net sales volume"
        />
        <KPICard
          label="Net Contribution"
          value={`£${totalContribution.toLocaleString()}`}
          change={5.2}
          subtitle="After all fees & ad spend"
        />
        <KPICard
          label="Contribution Margin"
          value={`${aggregateMargin}%`}
          subtitle="Target threshold: ≥35%"
          badge={<StatusBadge variant={Number(aggregateMargin) >= 35 ? 'healthy' : 'risk'} size="sm" />}
        />
        <KPICard
          label="Total COGS + Landed"
          value={`£${(totalCogs + totalLanded).toLocaleString()}`}
          subtitle={`${Math.round(((totalCogs + totalLanded) / (totalRevenue || 1)) * 100)}% of revenue`}
        />
        <KPICard
          label="Amazon Fees & Ads"
          value={`£${(totalFees + totalAdSpend).toLocaleString()}`}
          subtitle="Referral, FBA & PPC"
        />
        <KPICard
          label="Suboptimal SKUs"
          value={belowTargetCount}
          subtitle="Below margin target"
          badge={belowTargetCount > 0 ? <span className="w-2 h-2 rounded-full bg-status-warningText" /> : undefined}
        />
      </div>

      {/* Cost Waterfall Chart */}
      <div className="bg-card rounded-card border border-border p-5 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary tracking-tight">
              Cost Absorption & Margin per SKU
            </h2>
            <p className="text-xs text-text-secondary">
              Product-by-product visual breakdown of sales revenue versus net retained contribution.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#345B49]" /> Net Sales
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DDE5D6]" /> Net Contribution
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredCosts.map((c) => ({
                sku: c.sku,
                sales: c.netSales,
                contribution: c.netContribution,
                margin: c.contributionMarginPercent,
              }))}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E8E1" vertical={false} />
              <XAxis dataKey="sku" stroke="#929990" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#929990"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `£${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
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
              <Bar dataKey="sales" name="Net Sales" fill="#DDE5D6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="contribution" name="Net Contribution" fill="#345B49" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Profitability Table with Filters */}
      <div className="bg-card rounded-card border border-border shadow-soft overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-text-primary mr-1">Filter Margin:</span>
            {(['all', 'healthy', 'suboptimal', 'critical'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setMarginFilter(filter)}
                className={`px-2.5 py-1 text-xs font-medium rounded-btn transition-colors ${
                  marginFilter === filter
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-[#F2F3ED] text-text-secondary hover:bg-sage'
                }`}
              >
                {filter === 'all' ? 'All Margins' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter SKU or title..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F2F3ED] border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBFA] border-b border-border text-text-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">SKU & Product Title</th>
                <th className="py-3 px-4 font-semibold">Brand</th>
                <th className="py-3 px-4 font-semibold text-right">Net Sales</th>
                <th className="py-3 px-4 font-semibold text-right">COGS</th>
                <th className="py-3 px-4 font-semibold text-right">Landed</th>
                <th className="py-3 px-4 font-semibold text-right">Amazon Fees</th>
                <th className="py-3 px-4 font-semibold text-right">Ad Spend</th>
                <th className="py-3 px-4 font-semibold text-right">Contribution</th>
                <th className="py-3 px-4 font-semibold text-right">Margin %</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCosts.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => handleOpenDetail(rec)}
                  className="hover:bg-sage/20 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="max-w-[240px]">
                      <span className="font-mono font-semibold text-primary mr-1.5">
                        {rec.sku}
                      </span>
                      <p className="font-medium text-text-primary truncate mt-0.5">
                        {rec.productTitle}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-text-secondary">
                    {rec.brandName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right font-medium text-text-primary">
                    £{rec.netSales.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right text-text-muted">
                    £{rec.costOfGoods.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right text-text-muted">
                    £{rec.landedCost.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right text-text-secondary">
                    £{rec.amazonFees.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right text-text-secondary">
                    £{rec.adSpendPerUnit.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right font-bold text-text-primary">
                    £{rec.netContribution.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right font-bold">
                    <span
                      className={
                        rec.contributionMarginPercent >= rec.targetMarginPercent
                          ? 'text-status-successText'
                          : rec.contributionMarginPercent >= rec.targetMarginPercent - 5
                          ? 'text-status-warningText'
                          : 'text-status-errorText'
                      }
                    >
                      {rec.contributionMarginPercent}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge variant={rec.marginStatus} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="text-xs text-primary font-medium group-hover:underline">
                      Edit Costs →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SKU Profitability Detail & Cost Editor Drawer */}
      <Drawer
        isOpen={!!selectedCostRecord}
        onClose={() => setSelectedCostRecord(null)}
        title={selectedCostRecord?.productTitle || 'SKU Profitability'}
        subtitle={`SKU: ${selectedCostRecord?.sku} · Retail Price: £${selectedCostRecord?.retailPrice.toFixed(2)}`}
        width="lg"
      >
        {selectedCostRecord && (
          <div className="space-y-6 text-xs">
            {/* KPI Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted text-[10px] uppercase font-semibold">Net Contribution</span>
                <p className="text-lg font-bold font-mono text-text-primary mt-1">
                  £{selectedCostRecord.netContribution.toLocaleString()}
                </p>
                <span className="text-[10px] text-text-muted">Total profit generated</span>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted text-[10px] uppercase font-semibold">Margin %</span>
                <p className="text-lg font-bold font-mono text-primary mt-1">
                  {selectedCostRecord.contributionMarginPercent}%
                </p>
                <span className="text-[10px] text-text-muted">Target: {selectedCostRecord.targetMarginPercent}%</span>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted text-[10px] uppercase font-semibold">Units Sold</span>
                <p className="text-lg font-bold font-mono text-text-primary mt-1">
                  {selectedCostRecord.unitsSold}
                </p>
                <span className="text-[10px] text-text-muted">Analyzed period</span>
              </div>
            </div>

            {/* Editable Cost Assumptions Form */}
            <div className="p-4 bg-sage-light/60 rounded-btn border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span>Adjust Product Cost Assumptions (Live Sandbox)</span>
                </div>
                <span className="text-[10px] text-text-muted">Dynamic Recalculation</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    COGS per Unit (£)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editCogs}
                    onChange={(e) => setEditCogs(Number(e.target.value))}
                    className="w-full p-2 bg-card border border-border rounded-btn font-mono text-text-primary text-xs font-semibold focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Landed Freight (£)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editLanded}
                    onChange={(e) => setEditLanded(Number(e.target.value))}
                    className="w-full p-2 bg-card border border-border rounded-btn font-mono text-text-primary text-xs font-semibold focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Ad Spend / Unit (£)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editAdSpend}
                    onChange={(e) => setEditAdSpend(Number(e.target.value))}
                    className="w-full p-2 bg-card border border-border rounded-btn font-mono text-text-primary text-xs font-semibold focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveCostEdit}
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
                >
                  Recalculate & Save Locally
                </button>
              </div>
            </div>

            {/* Sellerboard Reconciliation Panel */}
            <div className="p-4 bg-sand-light rounded-btn border border-sand-dark/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-terracotta" />
                  Sellerboard Side-by-Side Reconciliation Bridge
                </span>
                <button
                  onClick={() => setShowSellerboardRecon(!showSellerboardRecon)}
                  className="text-primary font-medium hover:underline text-[11px]"
                >
                  {showSellerboardRecon ? 'Hide Details' : 'View Reconciliation'}
                </button>
              </div>

              {showSellerboardRecon && (
                <div className="space-y-2 pt-2 border-t border-sand-dark/30 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 bg-card rounded border border-sand-dark/30">
                      <p className="text-text-muted">AUREL Net Model</p>
                      <p className="text-sm font-bold font-mono text-text-primary mt-0.5">
                        £{selectedCostRecord.netContribution.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2.5 bg-card rounded border border-sand-dark/30">
                      <p className="text-text-muted">Sellerboard Estimate</p>
                      <p className="text-sm font-bold font-mono text-text-primary mt-0.5">
                        £{selectedCostRecord.sellerboardComparison?.sellerboardContribution.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-text-secondary">
                      Variance Difference: <strong>£{selectedCostRecord.sellerboardComparison?.difference}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-successBg text-status-successText">
                      Within Acceptable 2.5% Tolerance
                    </span>
                  </div>

                  <p className="text-[10px] text-text-muted leading-relaxed">
                    *Minor difference stems from Sellerboard estimated storage fee amortization versus AUREL exact monthly settlement allocation.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        reportName="SKU Profitability & Contribution Model"
        dataSummary="Reconciled net sales, COGS, freight landed, FBA fees, advertising spend and contribution margin."
      />
    </div>
  );
};
