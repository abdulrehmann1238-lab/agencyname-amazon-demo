import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  TrendingUp,
  Percent,
  Boxes,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ClientsPage: React.FC = () => {
  const { brands, costs, inventory, approvals, setSelectedBrandId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Client Brand Portfolio
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              Multi-Brand Agency Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Directory of consumer brands managed across European and North American Amazon marketplaces.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand or category..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-card border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary shadow-subtle"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBrands.map((brand) => {
          const brandCosts = costs.filter((c) => c.brandId === brand.id);
          const brandInv = inventory.filter((i) => i.brandId === brand.id);
          const brandAppr = approvals.filter((a) => a.brandId === brand.id && a.status === 'needs_review');

          const sales = brandCosts.reduce((acc, c) => acc + c.netSales, 0) || brand.monthlySalesTarget * 0.85;
          const adSpend = brandCosts.reduce((acc, c) => acc + c.totalAdSpend, 0);
          const tacos = sales > 0 ? ((adSpend / sales) * 100).toFixed(1) : '11.2';
          const targetPercent = Math.min(100, Math.round((sales / brand.monthlySalesTarget) * 100));
          const criticalStock = brandInv.filter((i) => i.daysOfCover < 7).length;

          return (
            <div
              key={brand.id}
              onClick={() => navigate(`/app/clients/${brand.id}`)}
              className="p-5 bg-card rounded-card border border-border shadow-soft hover:shadow-card hover:border-primary transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Brand Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-soft flex-shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: brand.accentColor }}
                    >
                      {brand.logoText}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-xs text-text-muted">{brand.category}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sage text-primary">
                    Health: {brand.healthScore}/100
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-4">
                  {brand.description}
                </p>

                {/* Target Progress Bar */}
                <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-text-muted">Monthly Target Progress</span>
                    <span className="font-mono font-semibold text-text-primary">
                      £{sales.toLocaleString()} / £{brand.monthlySalesTarget.toLocaleString()} ({targetPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EAECE4] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${targetPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-sage-light rounded border border-border">
                    <span className="text-[10px] text-text-muted uppercase block">TACoS</span>
                    <strong className="font-mono text-primary text-sm">{tacos}%</strong>
                  </div>
                  <div className="p-2 bg-sand-light rounded border border-sand-dark/30">
                    <span className="text-[10px] text-text-muted uppercase block">Stock Risks</span>
                    <strong className={`font-mono text-sm ${criticalStock > 0 ? 'text-status-errorText' : 'text-text-primary'}`}>
                      {criticalStock} critical
                    </strong>
                  </div>
                  <div className="p-2 bg-[#FBFBFA] rounded border border-border">
                    <span className="text-[10px] text-text-muted uppercase block">Approvals</span>
                    <strong className="font-mono text-sm text-text-primary">
                      {brandAppr.length} pending
                    </strong>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {brand.supportedMarketplaces.map((m) => (
                    <span key={m} className="px-1.5 py-0.5 rounded bg-[#F2F3ED] text-[10px] font-mono text-text-secondary">
                      {m}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBrandId(brand.id);
                      navigate('/app');
                    }}
                    className="text-xs text-text-muted hover:text-text-primary"
                  >
                    Set as Global
                  </button>
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:underline">
                    Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
