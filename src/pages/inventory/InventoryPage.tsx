import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  Download,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Warehouse,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';
import { ExportModal } from '../../components/common/ExportModal';
import { InventoryItem } from '../../types';

export const InventoryPage: React.FC = () => {
  const {
    inventory,
    selectedBrandId,
    selectedBrand,
    selectedMarketplace,
    draftReplenishmentTask,
    showToast,
  } = useApp();

  const navigate = useNavigate();
  const [selectedSkuItem, setSelectedSkuItem] = useState<InventoryItem | null>(null);
  const [distributionMode, setDistributionMode] = useState<'units' | 'percent'>('units');
  const [replenishmentQuantity, setReplenishmentQuantity] = useState<number>(500);
  const [selected3PL, setSelected3PL] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Filter inventory items by brand & marketplace
  const filteredInventory = inventory.filter((item) => {
    if (selectedBrandId !== 'all' && item.brandId !== selectedBrandId) return false;
    if (selectedMarketplace !== 'all' && item.marketplace !== selectedMarketplace) return false;
    return true;
  });

  // Aggregated KPI calculations
  const totalFbaUnits = filteredInventory.reduce((acc, i) => acc + i.fbaStock, 0);
  const totalVendorUnits = filteredInventory.reduce((acc, i) => acc + i.vendorStock, 0);
  const total3PLUnits = filteredInventory.reduce((acc, i) => acc + i.thirdPartyStock, 0);
  const totalAvailable = totalFbaUnits + totalVendorUnits + total3PLUnits;

  const criticalSkus = filteredInventory.filter((i) => i.daysOfCover < 7);
  const atRiskSkus = filteredInventory.filter((i) => i.daysOfCover >= 7 && i.daysOfCover < 14);
  const pendingReplenishments = filteredInventory.filter((i) => i.replenishmentPending).length;

  // Stock distribution chart data
  const distributionData = filteredInventory.map((item) => {
    const total = item.fbaStock + item.vendorStock + item.thirdPartyStock;
    if (distributionMode === 'percent' && total > 0) {
      return {
        sku: item.sku,
        fba: Math.round((item.fbaStock / total) * 100),
        vendor: Math.round((item.vendorStock / total) * 100),
        thirdParty: Math.round((item.thirdPartyStock / total) * 100),
      };
    }
    return {
      sku: item.sku,
      fba: item.fbaStock,
      vendor: item.vendorStock,
      thirdParty: item.thirdPartyStock,
    };
  });

  const handleDraftTask = (item: InventoryItem) => {
    draftReplenishmentTask(item.sku, replenishmentQuantity);
    setSelectedSkuItem(null);
  };

  const thirdPartyProviders = [
    { name: 'Pick Pack N Post', location: 'Northampton (UK)', stockHeld: '1,130 units', status: 'Connected (Simulated)', sync: '15 mins ago', partnerBrand: 'Alder & Moss' },
    { name: 'Mintsoft 3PL Hub', location: 'Coventry (UK)', stockHeld: '530 units', status: 'Connected (Simulated)', sync: '30 mins ago', partnerBrand: 'Hearthwell' },
    { name: 'Blue30 Fulfillment', location: 'Bristol (UK)', stockHeld: '850 units', status: 'Connected (Simulated)', sync: '08:00 UTC', partnerBrand: 'Wellnest Labs' },
    { name: 'Linnworks Central', location: 'Leicester (UK)', stockHeld: '410 units', status: 'Connected (Simulated)', sync: '07:30 UTC', partnerBrand: 'Northfield Living' },
    { name: 'Unleashed Software', location: 'Multi-warehouse', stockHeld: 'Catalog synced', status: 'Planned', sync: 'Scheduled', partnerBrand: 'General' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Unified Stock & Replenishment
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              Real-time 3PL & FBA Aggregation
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Consolidates FBA warehouses, Vendor direct stock and 3PL fulfillment centers into unified days of cover.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Stock Status</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <KPICard
          label="Total Usable Stock"
          value={totalAvailable.toLocaleString()}
          subtitle="FBA + 3PL + Vendor"
          change={2.4}
        />
        <KPICard
          label="FBA Inventory"
          value={totalFbaUnits.toLocaleString()}
          subtitle={`${Math.round((totalFbaUnits / (totalAvailable || 1)) * 100)}% of total stock`}
        />
        <KPICard
          label="3PL Warehouse Stock"
          value={total3PLUnits.toLocaleString()}
          subtitle="Staged for replenishment"
        />
        <KPICard
          label="Critical Cover (<7d)"
          value={criticalSkus.length}
          subtitle="Stockout risk immediate"
          badge={
            criticalSkus.length > 0 ? (
              <span className="w-2 h-2 rounded-full bg-status-errorText" />
            ) : undefined
          }
        />
        <KPICard
          label="At Risk (7-14d)"
          value={atRiskSkus.length}
          subtitle="Re-order window open"
          badge={
            atRiskSkus.length > 0 ? (
              <span className="w-2 h-2 rounded-full bg-status-warningText" />
            ) : undefined
          }
        />
        <KPICard
          label="Pending Replenishments"
          value={pendingReplenishments}
          subtitle="Awaiting human approval"
          onClick={() => navigate('/app/approvals')}
        />
      </div>

      {/* Stock Distribution Visualization */}
      <div className="bg-card rounded-card border border-border p-5 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary tracking-tight">
              Inventory Distribution by SKU & Warehouse Location
            </h2>
            <p className="text-xs text-text-secondary">
              Cross-system visibility into where product units are physically held.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F2F3ED] p-0.5 rounded-btn border border-border text-xs">
            <button
              onClick={() => setDistributionMode('units')}
              className={`px-2.5 py-1 font-medium rounded-[7px] transition-all ${
                distributionMode === 'units'
                  ? 'bg-card text-text-primary shadow-subtle font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Units Count
            </button>
            <button
              onClick={() => setDistributionMode('percent')}
              className={`px-2.5 py-1 font-medium rounded-[7px] transition-all ${
                distributionMode === 'percent'
                  ? 'bg-card text-text-primary shadow-subtle font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              % Share
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E8E1" vertical={false} />
              <XAxis dataKey="sku" stroke="#929990" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#929990"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => (distributionMode === 'percent' ? `${val}%` : val.toString())}
              />
              <Tooltip
                formatter={(val: number) => [
                  distributionMode === 'percent' ? `${val}%` : `${val} units`,
                  '',
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  borderColor: '#E6E8E1',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />
              <Bar dataKey="fba" name="Amazon FBA FC" stackId="a" fill="#345B49" radius={[0, 0, 0, 0]} />
              <Bar dataKey="thirdParty" name="3PL Partner Stock" stackId="a" fill="#DDE5D6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="vendor" name="Vendor Central Direct" stackId="a" fill="#B87559" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-text-muted gap-2">
          <span>Days of Cover Formula: <strong>Usable FBA Stock ÷ 30-day Average Daily Demand</strong></span>
          <span className="text-primary font-medium">Configurable safety buffer: 14 days minimum</span>
        </div>
      </div>

      {/* Main Unified Stock Table */}
      <div className="bg-card rounded-card border border-border shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Unified Stock & Replenishment Queue
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Live inventory balances across Amazon FCs and verified 3PL warehouses.
            </p>
          </div>
          <span className="text-xs text-text-muted">
            {filteredInventory.length} Managed SKUs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBFA] border-b border-border text-text-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Product & SKU</th>
                <th className="py-3 px-4 font-semibold">Brand</th>
                <th className="py-3 px-4 font-semibold text-right">FBA Stock</th>
                <th className="py-3 px-4 font-semibold text-right">3PL Warehouse</th>
                <th className="py-3 px-4 font-semibold text-right">Total Avail.</th>
                <th className="py-3 px-4 font-semibold text-right">Daily Demand</th>
                <th className="py-3 px-4 font-semibold text-right">Days of Cover</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedSkuItem(item)}
                  className="hover:bg-sage/20 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="max-w-[280px]">
                      <span className="font-mono font-semibold text-primary mr-2">
                        {item.sku}
                      </span>
                      <p className="font-medium text-text-primary truncate mt-0.5">
                        {item.productTitle}
                      </p>
                      <p className="text-[10px] text-text-muted">3PL: {item.thirdPartyPartner}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-text-secondary">
                    {item.brandName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right font-medium text-text-primary">
                    {item.fbaStock.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right text-text-secondary">
                    {item.thirdPartyStock.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right font-bold text-text-primary">
                    {item.totalStock.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right text-text-muted">
                    {item.averageDailySales}/day
                  </td>

                  <td className="py-3.5 px-4 font-mono text-right">
                    <span
                      className={`font-bold ${
                        item.daysOfCover < 7
                          ? 'text-status-errorText'
                          : item.daysOfCover < 14
                          ? 'text-status-warningText'
                          : 'text-status-successText'
                      }`}
                    >
                      {item.daysOfCover} days
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge variant={item.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSkuItem(item);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:underline"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3PL Logistics Connectors Grid */}
      <div className="bg-card rounded-card border border-border p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Connected 3PL Logistics Centers
            </h2>
            <p className="text-xs text-text-secondary">
              Physical inventory reconciliation points across agency warehouse network.
            </p>
          </div>
          <span className="text-xs text-primary font-mono bg-sage px-2 py-0.5 rounded">
            4 Active Feeds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {thirdPartyProviders.map((prov, idx) => (
            <div
              key={idx}
              className="p-4 rounded-btn bg-[#FBFBFA] border border-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
                    <Warehouse className="w-3.5 h-3.5 text-primary" />
                    {prov.name}
                  </span>
                  <StatusBadge variant={prov.status} size="sm" />
                </div>
                <p className="text-[11px] text-text-muted">{prov.location}</p>
                <div className="mt-2 text-xs flex justify-between text-text-secondary">
                  <span>Stock Held:</span>
                  <strong className="font-mono text-text-primary">{prov.stockHeld}</strong>
                </div>
                <div className="text-[11px] flex justify-between text-text-muted mt-0.5">
                  <span>Client Brand:</span>
                  <span>{prov.partnerBrand}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Sync: {prov.sync}</span>
                <button
                  onClick={() => setSelected3PL(prov.name)}
                  className="text-primary font-medium hover:underline"
                >
                  Configure →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SKU Detail Drawer */}
      <Drawer
        isOpen={!!selectedSkuItem}
        onClose={() => setSelectedSkuItem(null)}
        title={selectedSkuItem?.productTitle || 'SKU Details'}
        subtitle={`SKU: ${selectedSkuItem?.sku} · Brand: ${selectedSkuItem?.brandName}`}
        width="lg"
      >
        {selectedSkuItem && (
          <div className="space-y-6 text-xs">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted text-[10px] uppercase font-semibold">FBA Stock</span>
                <p className="text-lg font-bold font-mono text-text-primary mt-1">
                  {selectedSkuItem.fbaStock} units
                </p>
                <span className="text-[10px] text-text-muted">{selectedSkuItem.daysOfCover} days cover</span>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted text-[10px] uppercase font-semibold">3PL Stock</span>
                <p className="text-lg font-bold font-mono text-text-primary mt-1">
                  {selectedSkuItem.thirdPartyStock} units
                </p>
                <span className="text-[10px] text-text-muted">Available at warehouse</span>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted text-[10px] uppercase font-semibold">Daily Sales</span>
                <p className="text-lg font-bold font-mono text-primary mt-1">
                  {selectedSkuItem.averageDailySales} units/d
                </p>
                <span className="text-[10px] text-text-muted">30-day run rate</span>
              </div>
            </div>

            {/* 30-Day Stock Movement Chart */}
            <div>
              <h4 className="font-semibold text-text-primary mb-2">30-Day Stock Depletion Trend</h4>
              <div className="h-44 w-full bg-[#FBFBFA] p-2 rounded-btn border border-border">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedSkuItem.stockHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
                    <Area type="monotone" dataKey="fba" name="FBA Stock" stroke="#345B49" fill="#E8EFE8" strokeWidth={2} />
                    <Area type="monotone" dataKey="thirdParty" name="3PL Stock" stroke="#B87559" fill="#F5ECE8" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Suggested Replenishment Action */}
            <div className="p-4 bg-sand-light rounded-btn border border-sand-dark/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                  <span>Proposed FBA Inbound Plan</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-sand-dark/30">
                  Recommended: 500 units
                </span>
              </div>

              <p className="text-text-secondary leading-relaxed">
                Transferring 500 units from <strong>{selectedSkuItem.thirdPartyPartner}</strong> will restore FBA cover to <strong>22.9 days</strong>, safeguarding Buy Box featured offer status through anticipated holiday velocity.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <label className="text-text-muted text-xs">Quantity:</label>
                <input
                  type="number"
                  value={replenishmentQuantity}
                  onChange={(e) => setReplenishmentQuantity(Number(e.target.value))}
                  className="w-24 p-1.5 bg-card border border-border rounded-btn font-mono text-center font-bold text-text-primary text-xs"
                />
                <button
                  onClick={() => handleDraftTask(selectedSkuItem)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Draft Replenishment Task</span>
                </button>
              </div>

              <p className="text-[10px] text-text-muted text-center">
                *Creates a pending review item in Human Approval Center. Does not call 3PL API directly.
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Mock 3PL Config Modal */}
      <Modal
        isOpen={!!selected3PL}
        onClose={() => setSelected3PL(null)}
        title={`Configure ${selected3PL}`}
        subtitle="3PL warehouse REST webhook and ASN dispatch rules"
        maxWidth="md"
        footer={
          <button
            onClick={() => {
              showToast('Warehouse configuration saved', 'Updated sync interval for demo.', 'success');
              setSelected3PL(null);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn transition-colors"
          >
            Save Parameters
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-sage-light border border-border rounded-btn text-text-secondary">
            <p className="font-semibold text-text-primary mb-1">Architecture Integration Note</p>
            <p>
              In production, AUREL interfaces with {selected3PL} via standardized inventory balance webhooks. When stock levels drop below buffer limits, replenishment tasks are automatically drafted for human authorization.
            </p>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Webhook Endpoint URL</label>
            <input
              type="text"
              readOnly
              value={`https://api.aurel-agency.co.uk/v1/webhooks/3pl/${selected3PL?.toLowerCase().replace(/\s+/g, '-')}`}
              className="w-full p-2 bg-[#F2F3ED] border border-border rounded-btn font-mono text-text-muted"
            />
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Default Inbound Carrier</label>
            <select className="w-full p-2 bg-card border border-border rounded-btn text-text-primary">
              <option>Palletline UK Priority</option>
              <option>Amazon Partnered Carrier (UPS Freight)</option>
              <option>DHL Parcel Direct</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        reportName="Unified Inventory Status"
        dataSummary="FBA, Vendor and 3PL stock positions with daily demand velocity and days of cover."
      />
    </div>
  );
};
