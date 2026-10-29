import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  LineChart,
  Boxes,
  Percent,
  ShieldAlert,
  Globe2,
  UserPlus,
  CheckCircle,
  MessageSquare,
  Cpu,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, brands, products, approvals } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const routes = [
    { name: 'Executive Overview', path: '/app', icon: LayoutDashboard, category: 'Navigation' },
    { name: 'Performance & Advertising', path: '/app/performance', icon: LineChart, category: 'Navigation' },
    { name: 'Unified Inventory & Stock', path: '/app/inventory', icon: Boxes, category: 'Navigation' },
    { name: 'Profit per SKU Analysis', path: '/app/profitability', icon: Percent, category: 'Navigation' },
    { name: 'Listing & Account Health', path: '/app/health', icon: ShieldAlert, category: 'Navigation' },
    { name: 'Marketplace Expansion', path: '/app/expansion', icon: Globe2, category: 'Navigation' },
    { name: 'Client Onboarding Pipeline', path: '/app/onboarding', icon: UserPlus, category: 'Navigation' },
    { name: 'Human Approval Center', path: '/app/approvals', icon: CheckCircle, category: 'Navigation' },
    { name: 'Communications & Newsletters', path: '/app/communications', icon: MessageSquare, category: 'Navigation' },
    { name: 'Connected Systems Hub', path: '/app/integrations', icon: Cpu, category: 'Navigation' },
    { name: 'Workspace Settings', path: '/app/settings', icon: Settings, category: 'Navigation' },
  ];

  const filteredRoutes = routes.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.sku.toLowerCase().includes(query.toLowerCase()) ||
      p.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredApprovals = approvals.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.brandName.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectRoute = (path: string) => {
    navigate(path);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#202820]/40 backdrop-blur-sm"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl bg-card rounded-modal border border-border shadow-elevated overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-[#FBFBFA]">
          <Search className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a page, brand name, SKU or pending approval..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-sand border border-border rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-border/60">
          {/* Navigation Section */}
          {filteredRoutes.length > 0 && (
            <div className="py-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Modules & Pages
              </p>
              {filteredRoutes.slice(0, 5).map((route) => {
                const Icon = route.icon;
                return (
                  <button
                    key={route.path}
                    onClick={() => handleSelectRoute(route.path)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-primary hover:bg-sage/50 rounded-btn transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-primary" />
                      <span>{route.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Brands Section */}
          {filteredBrands.length > 0 && (
            <div className="py-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Managed Brands
              </p>
              {filteredBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleSelectRoute(`/app/clients/${brand.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-primary hover:bg-sage/50 rounded-btn transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0"
                      style={{ backgroundColor: brand.accentColor }}
                    >
                      {brand.logoText}
                    </span>
                    <div>
                      <p className="font-medium text-left">{brand.name}</p>
                      <p className="text-[10px] text-text-muted text-left">{brand.category}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-text-muted">View Workspace →</span>
                </button>
              ))}
            </div>
          )}

          {/* SKUs Section */}
          {filteredProducts.length > 0 && (
            <div className="py-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Products & SKUs
              </p>
              {filteredProducts.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectRoute('/app/inventory')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-primary hover:bg-sage/50 rounded-btn transition-colors"
                >
                  <div>
                    <span className="font-mono font-semibold text-primary mr-2">
                      {p.sku}
                    </span>
                    <span className="text-text-secondary">{p.title}</span>
                  </div>
                  <span className="text-[11px] text-text-muted">{p.marketplace}</span>
                </button>
              ))}
            </div>
          )}

          {/* Approvals Section */}
          {filteredApprovals.length > 0 && (
            <div className="py-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Pending Approvals
              </p>
              {filteredApprovals.slice(0, 3).map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleSelectRoute('/app/approvals')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-primary hover:bg-sage/50 rounded-btn transition-colors"
                >
                  <div className="truncate mr-2">
                    <p className="font-medium truncate text-left">{a.title}</p>
                    <p className="text-[10px] text-text-muted text-left">{a.brandName} · {a.typeLabel}</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-status-warningBg text-status-warningText flex-shrink-0">
                    {a.priority}
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredRoutes.length === 0 &&
            filteredBrands.length === 0 &&
            filteredProducts.length === 0 && (
              <div className="py-8 text-center text-xs text-text-muted">
                No matching results for "{query}".
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#FBFBFA] border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span>Search agency catalog & operational state</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
