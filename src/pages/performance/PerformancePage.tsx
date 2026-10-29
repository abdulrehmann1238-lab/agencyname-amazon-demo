import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Filter,
  Layers,
  ShoppingBag,
  Building2,
  Target,
  ExternalLink,
  Search,
  ChevronRight,
  Database,
  Lock,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { Modal } from '../../components/common/Modal';
import { ExportModal } from '../../components/common/ExportModal';
import {
  AD_CAMPAIGNS,
  SEARCH_TERMS,
  PERFORMANCE_HISTORY,
} from '../../data/mockData';
import { AdCampaign, MarketplaceRegion } from '../../types';

export const PerformancePage: React.FC = () => {
  const {
    selectedBrandId,
    selectedBrand,
    selectedMarketplace,
    setSelectedMarketplace,
    selectedChannel,
    setSelectedChannel,
    dateRange,
    marketplaces,
    showToast,
  } = useApp();

  const [activeAdTab, setActiveAdTab] = useState<'all' | 'Sponsored Products' | 'Sponsored Brands' | 'Sponsored Display'>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [authModalSource, setAuthModalSource] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [searchTermQuery, setSearchTermQuery] = useState('');

  // Currency helper based on active marketplace
  const currentMkt = marketplaces.find((m) => m.id === selectedMarketplace) || marketplaces[0];
  const curSymbol = currentMkt.currencySymbol;

  // Channel multiplier for simulated numbers
  const channelMultiplier = selectedChannel === 'vendor' ? 0.38 : selectedChannel === 'seller' ? 0.62 : 1.0;

  // Filter campaigns
  const filteredCampaigns = AD_CAMPAIGNS.filter((c) => {
    if (selectedBrandId !== 'all' && c.brandId !== selectedBrandId) return false;
    if (activeAdTab !== 'all' && c.type !== activeAdTab) return false;
    return true;
  });

  // Filter search terms
  const filteredSearchTerms = SEARCH_TERMS.filter((st) =>
    st.searchTerm.toLowerCase().includes(searchTermQuery.toLowerCase()) ||
    st.campaignName.toLowerCase().includes(searchTermQuery.toLowerCase())
  );

  // Time-series mock data scaled by channel multiplier
  const rawHistory = PERFORMANCE_HISTORY[dateRange] || PERFORMANCE_HISTORY['30d'];
  const chartData = rawHistory.map((pt) => ({
    ...pt,
    totalSales: Math.round(pt.totalSales * channelMultiplier),
    adSales: Math.round(pt.adSales * channelMultiplier),
    organicSales: Math.round(pt.organicSales * channelMultiplier),
    adSpend: Math.round(pt.adSpend * channelMultiplier),
  }));

  const baseSales = Math.round(284650 * channelMultiplier);
  const baseAdSpend = Math.round(31420 * channelMultiplier);
  const baseUnits = Math.round(8462 * channelMultiplier);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Performance & Advertising
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              Demo Data · Simulated Refresh: 08:42 UTC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Reconciled sales, traffic and advertising telemetry across brands, channels and regional endpoints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Channel Switcher */}
          <div className="flex items-center bg-[#EAECE4] p-0.5 rounded-btn border border-border text-xs">
            <button
              onClick={() => setSelectedChannel('all')}
              className={`px-2.5 py-1 font-medium rounded-[7px] transition-all ${
                selectedChannel === 'all'
                  ? 'bg-card text-text-primary shadow-subtle font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All Channels
            </button>
            <button
              onClick={() => setSelectedChannel('seller')}
              className={`px-2.5 py-1 font-medium rounded-[7px] transition-all ${
                selectedChannel === 'seller'
                  ? 'bg-card text-text-primary shadow-subtle font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Seller Central
            </button>
            <button
              onClick={() => setSelectedChannel('vendor')}
              className={`px-2.5 py-1 font-medium rounded-[7px] transition-all ${
                selectedChannel === 'vendor'
                  ? 'bg-card text-text-primary shadow-subtle font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Vendor Central
            </button>
          </div>

          {/* Regional Marketplace Selector */}
          <div className="relative">
            <select
              value={selectedMarketplace}
              onChange={(e) => setSelectedMarketplace(e.target.value)}
              className="bg-card text-xs font-medium text-text-primary border border-border rounded-btn px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary shadow-subtle"
            >
              <option value="all">🌍 All Regions</option>
              {marketplaces.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.flag} {m.name} ({m.currency})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <KPICard
          label="Total Revenue"
          value={`${curSymbol}${baseSales.toLocaleString()}`}
          change={8.4}
          changePeriod="vs prior period"
          subtitle={selectedChannel === 'vendor' ? 'Shipped Revenue' : 'Gross Sales'}
        />
        <KPICard
          label="Advertising Spend"
          value={`${curSymbol}${baseAdSpend.toLocaleString()}`}
          change={-2.1}
          changePeriod="Budget efficiency"
          subtitle={`Avg CPC: ${curSymbol}1.16`}
        />
        <KPICard
          label="TACoS"
          value="11.0%"
          change={-0.8}
          changePeriod="Target <12%"
          subtitle="Total ad / gross sales"
        />
        <KPICard
          label="Ordered Units"
          value={baseUnits.toLocaleString()}
          change={9.2}
          subtitle="Across active catalog"
        />
        <KPICard
          label="Unit Session %"
          value="12.8%"
          change={0.6}
          subtitle="Conversion rate"
        />
        <KPICard
          label="Organic Share"
          value="64.2%"
          change={1.4}
          subtitle="Non-paid velocity"
        />
      </div>

      {/* Main Attribution Chart */}
      <div className="bg-card rounded-card border border-border p-5 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary tracking-tight">
              Revenue & Attribution Breakdown
            </h2>
            <p className="text-xs text-text-secondary">
              Deterministic separation of Paid Ad Sales and Organic Baseline to prevent financial double counting.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#345B49]" /> Total Sales
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B87559]" /> Ad Attributed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8B5A2]" /> Organic
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#345B49" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#345B49" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="adGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B87559" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#B87559" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E8E1" vertical={false} />
              <XAxis dataKey="date" stroke="#929990" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#929990"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${curSymbol}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip
                formatter={(val: number) => [`${curSymbol}${val.toLocaleString()}`, '']}
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
                fill="url(#totalGrad)"
              />
              <Area
                type="monotone"
                dataKey="adSales"
                name="Ad-Attributed Sales"
                stroke="#B87559"
                strokeWidth={2}
                fill="url(#adGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs text-text-muted gap-2">
          <span>
            {selectedChannel === 'vendor' ? 'Vendor Central: Invoiced PO revenue verified against EDI receipt logs' : 'Seller Central: Gross merchandise value (GMV) reconciled with SP-API Settlement reports'}
          </span>
          <span className="font-mono text-text-primary">
            Attribution Model: 14-day Last Touch Click
          </span>
        </div>
      </div>

      {/* Advertising Analytics Section */}
      <div className="bg-card rounded-card border border-border p-5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Advertising Engine & Campaign Intelligence
            </h2>
            <p className="text-xs text-text-secondary">
              Sponsored Products, Sponsored Brands and Sponsored Display campaign performance.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F2F3ED] p-0.5 rounded-btn border border-border text-xs">
            {(['all', 'Sponsored Products', 'Sponsored Brands', 'Sponsored Display'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveAdTab(tab)}
                className={`px-2.5 py-1 font-medium rounded-[7px] transition-all ${
                  activeAdTab === tab
                    ? 'bg-card text-text-primary shadow-subtle font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab === 'all' ? 'All Types' : tab.replace('Sponsored ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBFA] border-b border-border text-text-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Campaign Name</th>
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Daily Budget</th>
                <th className="py-2.5 px-3 font-semibold text-right">Spend</th>
                <th className="py-2.5 px-3 font-semibold text-right">Sales</th>
                <th className="py-2.5 px-3 font-semibold text-right">ACoS</th>
                <th className="py-2.5 px-3 font-semibold text-right">ROAS</th>
                <th className="py-2.5 px-3 font-semibold text-right">CPC</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCampaigns.map((camp) => (
                <tr
                  key={camp.id}
                  onClick={() => setSelectedCampaign(camp)}
                  className="hover:bg-sage/20 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-medium text-text-primary group-hover:text-primary transition-colors">
                    {camp.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#EAECE4] text-text-secondary font-mono">
                      {camp.type.replace('Sponsored ', '')}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge variant={camp.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-secondary">
                    {curSymbol}{camp.dailyBudget.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-primary font-medium">
                    {curSymbol}{camp.spend.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-primary font-semibold">
                    {curSymbol}{camp.sales.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-right">
                    <span
                      className={`font-semibold ${
                        camp.acos < 25
                          ? 'text-status-successText'
                          : camp.acos > 32
                          ? 'text-status-warningText'
                          : 'text-text-primary'
                      }`}
                    >
                      {camp.acos}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-medium text-primary">
                    {camp.roas.toFixed(2)}x
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-muted">
                    {curSymbol}{camp.cpc.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-xs text-primary font-medium group-hover:underline">
                      Inspect →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search Term Intelligence Table */}
      <div className="bg-card rounded-card border border-border p-5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Harvested Search Term Performance
            </h2>
            <p className="text-xs text-text-secondary">
              Customer queries extracted from Amazon Ads Reports API for keyword harvesting and negative bidding.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchTermQuery}
              onChange={(e) => setSearchTermQuery(e.target.value)}
              placeholder="Filter customer queries..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F2F3ED] border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBFA] border-b border-border text-text-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Customer Search Term</th>
                <th className="py-2.5 px-3 font-semibold">Matched Campaign</th>
                <th className="py-2.5 px-3 font-semibold">Match Type</th>
                <th className="py-2.5 px-3 font-semibold text-right">Impressions</th>
                <th className="py-2.5 px-3 font-semibold text-right">Clicks</th>
                <th className="py-2.5 px-3 font-semibold text-right">Spend</th>
                <th className="py-2.5 px-3 font-semibold text-right">Sales</th>
                <th className="py-2.5 px-3 font-semibold text-right">ACoS</th>
                <th className="py-2.5 px-3 font-semibold text-right">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredSearchTerms.map((st) => (
                <tr key={st.id} className="hover:bg-sand-light/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-text-primary">
                    "{st.searchTerm}"
                  </td>
                  <td className="py-3 px-3 text-text-secondary truncate max-w-[200px]">
                    {st.campaignName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sage text-primary font-medium">
                      {st.matchType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-muted">
                    {st.impressions.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-secondary">
                    {st.clicks.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-primary font-medium">
                    {curSymbol}{st.spend.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-primary font-semibold">
                    {curSymbol}{st.attributedSales.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono text-right">
                    <span className={st.acos < 25 ? 'text-status-successText font-bold' : 'text-text-primary font-medium'}>
                      {st.acos}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-text-secondary">
                    {st.conversionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connected Data Sources Panel */}
      <div className="bg-card rounded-card border border-border p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Data Ingestion Telemetry & Endpoints
            </h2>
            <p className="text-xs text-text-secondary">
              Active connectors feeding the AUREL data lake and BigQuery normalization layer.
            </p>
          </div>
          <span className="text-xs text-primary font-mono bg-sage px-2 py-0.5 rounded">
            5 Connectors Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            { name: 'Amazon Seller Central SP-API', type: 'OAuth 2.0 LWA', status: 'Connected (Simulated)', sync: '15 mins ago', endpoint: 'api.amazon.co.uk' },
            { name: 'Amazon Vendor Central', type: 'Vendor EDI & Analytics', status: 'Connected (Simulated)', sync: '03:15 UTC', endpoint: 'vendorretail.amazon.eu' },
            { name: 'Amazon Advertising API', type: 'LWA Profile Consent', status: 'Connected (Simulated)', sync: 'Hourly', endpoint: 'advertising-api-eu.amazon.com' },
            { name: 'Sellerboard Bridge', type: 'Webhook API', status: 'Connected (Simulated)', sync: '01:12 UTC', endpoint: 'app.sellerboard.com' },
            { name: 'Keepa Historical Intelligence', type: 'Token Subscription', status: 'Connected (Simulated)', sync: '07:00 UTC', endpoint: 'api.keepa.com' },
          ].map((src, i) => (
            <div key={i} className="p-3.5 rounded-btn bg-[#FBFBFA] border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-text-primary">{src.name}</span>
                  <StatusBadge variant="healthy" size="sm" label="Active" />
                </div>
                <p className="text-[11px] font-mono text-text-muted">{src.endpoint}</p>
                <p className="text-[11px] text-text-secondary mt-1">Auth: {src.type}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Sync: {src.sync}</span>
                <button
                  onClick={() => setAuthModalSource(src.name)}
                  className="text-primary font-medium hover:underline"
                >
                  Configure →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Detail Drawer */}
      <Drawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        title={selectedCampaign?.name || 'Campaign Inspection'}
        subtitle={`ID: ${selectedCampaign?.id} · Type: ${selectedCampaign?.type}`}
        width="lg"
      >
        {selectedCampaign && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted uppercase text-[10px] font-semibold">Spend</span>
                <p className="text-lg font-bold font-mono text-text-primary mt-1">
                  {curSymbol}{selectedCampaign.spend.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted uppercase text-[10px] font-semibold">Attributed Sales</span>
                <p className="text-lg font-bold font-mono text-text-primary mt-1">
                  {curSymbol}{selectedCampaign.sales.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted uppercase text-[10px] font-semibold">ACoS / ROAS</span>
                <p className="text-lg font-bold font-mono text-primary mt-1">
                  {selectedCampaign.acos}% / {selectedCampaign.roas}x
                </p>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted uppercase text-[10px] font-semibold">Conversions</span>
                <p className="text-lg font-bold font-mono text-text-primary mt-1">
                  {selectedCampaign.conversions} orders
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-2">Operational Context & Strategy</h4>
              <p className="text-text-secondary leading-relaxed bg-sand-light p-3 rounded-btn border border-sand-dark/40">
                This campaign focuses on defending top-of-search brand keywords against competitors. Bids are calibrated using daily conversion velocity and reconciled against TACoS targets.
              </p>
            </div>

            <div className="p-4 bg-sage-light rounded-btn border border-border text-text-secondary space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Sparkles className="w-4 h-4" />
                <span>Claude Optimization Note</span>
              </div>
              <p className="leading-relaxed">
                ROAS is healthy at {selectedCampaign.roas}x. Recommend maintaining current £{selectedCampaign.dailyBudget} daily budget while harvesting top converting exact-match terms into isolated single-keyword ad groups.
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Simulated Integration Config Modal */}
      <Modal
        isOpen={!!authModalSource}
        onClose={() => setAuthModalSource(null)}
        title={`Configure ${authModalSource}`}
        subtitle="Simulated authorization and endpoint parameters"
        maxWidth="md"
        footer={
          <button
            onClick={() => {
              showToast('Parameters saved in demo', 'Updated simulated ingestion timing.', 'success');
              setAuthModalSource(null);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn transition-colors"
          >
            Done
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-sand-light border border-sand-dark/40 rounded-btn text-text-secondary">
            <p className="font-semibold text-text-primary mb-1">Demo Safety Policy</p>
            <p>
              This is an interactive architectural prototype. No live Amazon OAuth or API keys are requested or transmitted. Production implementation requires AWS IAM STS credentials and Amazon LWA application registration.
            </p>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Ingestion Frequency</label>
            <select className="w-full p-2 bg-card border border-border rounded-btn text-text-primary">
              <option>15 Minutes (Orders & Critical Inventory)</option>
              <option>Hourly (Advertising Clicks & Spend)</option>
              <option>Daily 03:00 UTC (Settlement & Vendor POs)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Target Regional Endpoint</label>
            <input
              type="text"
              readOnly
              value="https://sellingpartnerapi-eu.amazon.com"
              className="w-full p-2 bg-[#F2F3ED] border border-border rounded-btn font-mono text-text-muted"
            />
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        reportName="Amazon Performance & Advertising Report"
        dataSummary="Includes sales, advertising attribution, campaign breakdown, and harvested search terms."
      />
    </div>
  );
};
