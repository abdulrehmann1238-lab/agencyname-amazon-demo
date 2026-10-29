import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Calendar,
  Sparkles,
  ChevronDown,
  Filter,
  Check,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DateRangeOption, DemoScenarioId } from '../../types';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const {
    dateRange,
    setDateRange,
    selectedBrandId,
    setSelectedBrandId,
    brands,
    unreadNotificationCount,
    setIsNotificationDrawerOpen,
    setIsCommandPaletteOpen,
    setIsTourOpen,
    activeScenario,
    applyScenario,
    resetAllDemoData,
  } = useApp();

  const location = useLocation();
  const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);

  // Compute breadcrumb label
  const pathParts = location.pathname.split('/').filter(Boolean);
  let breadcrumbTitle = 'Executive Overview';
  if (pathParts[1] === 'performance') breadcrumbTitle = 'Performance & Advertising';
  else if (pathParts[1] === 'inventory') breadcrumbTitle = 'Unified Inventory & Stock';
  else if (pathParts[1] === 'profitability') breadcrumbTitle = 'Profit per SKU Analysis';
  else if (pathParts[1] === 'health') breadcrumbTitle = 'Listing & Account Health';
  else if (pathParts[1] === 'expansion') breadcrumbTitle = 'Marketplace Expansion';
  else if (pathParts[1] === 'onboarding') breadcrumbTitle = 'Client Onboarding Pipeline';
  else if (pathParts[1] === 'approvals') breadcrumbTitle = 'Human Approval Center';
  else if (pathParts[1] === 'communications') breadcrumbTitle = 'Communications & Newsletters';
  else if (pathParts[1] === 'integrations') breadcrumbTitle = 'Connected Systems Hub';
  else if (pathParts[1] === 'clients') breadcrumbTitle = 'Brand Portfolio';
  else if (pathParts[1] === 'settings') breadcrumbTitle = 'Workspace Settings';

  const dateOptions: { label: string; value: DateRangeOption }[] = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: 'YTD', value: 'ytd' },
  ];

  const scenarios: { id: DemoScenarioId; label: string; desc: string }[] = [
    { id: 'healthy', label: 'Healthy Portfolio', desc: 'All brands operating stably above target' },
    { id: 'inventory_pressure', label: 'Inventory Pressure', desc: 'Core SKU at 5 days cover requiring FBA order' },
    { id: 'ad_decline', label: 'Ad Efficiency Spike', desc: 'ACoS expansion flagged on non-brand terms' },
    { id: 'listing_issue', label: 'Listing Suppression', desc: 'Catalog attribute patch draft ready' },
    { id: 'onboarding', label: 'New Client Arrival', desc: '3PL pallet check-in trigger' },
  ];

  return (
    <header className="h-16 bg-card border-b border-border sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-btn hover:bg-sage"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link to="/app" className="hover:text-text-primary transition-colors">
              AUREL
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">{breadcrumbTitle}</span>
          </div>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-xs md:max-w-md mx-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-text-muted bg-[#F2F3ED] hover:bg-[#E8EAE3] border border-border rounded-btn transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-text-muted" />
            <span className="truncate">Search brands, SKUs, approvals...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-text-muted bg-card border border-border rounded shadow-subtle">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Brand Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setBrandMenuOpen(!brandMenuOpen);
              setScenarioMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary bg-[#F2F3ED] hover:bg-[#E8EAE3] border border-border rounded-btn transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-primary" />
            <span className="max-w-[90px] sm:max-w-[120px] truncate">
              {selectedBrandId === 'all'
                ? 'All Brands'
                : brands.find((b) => b.id === selectedBrandId)?.name}
            </span>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>

          {brandMenuOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-card rounded-btn border border-border shadow-elevated py-1.5 z-40">
              <button
                onClick={() => {
                  setSelectedBrandId('all');
                  setBrandMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-sage/50 ${
                  selectedBrandId === 'all' ? 'font-semibold text-primary' : 'text-text-primary'
                }`}
              >
                <span>All Brands (24 Portfolio)</span>
                {selectedBrandId === 'all' && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
              <div className="my-1 border-t border-border" />
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrandId(brand.id);
                    setBrandMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-sage/50 ${
                    selectedBrandId === brand.id
                      ? 'font-semibold text-primary'
                      : 'text-text-primary'
                  }`}
                >
                  <div className="truncate">
                    <p className="truncate">{brand.name}</p>
                    <p className="text-[10px] text-text-muted">{brand.category}</p>
                  </div>
                  {selectedBrandId === brand.id && (
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="hidden lg:flex items-center bg-[#F2F3ED] p-0.5 rounded-btn border border-border text-xs">
          {dateOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateRange(opt.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-[7px] transition-all ${
                dateRange === opt.value
                  ? 'bg-card text-text-primary shadow-subtle font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Demo Scenario Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setScenarioMenuOpen(!scenarioMenuOpen);
              setBrandMenuOpen(false);
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary bg-sand-light hover:bg-sand border border-sand-dark/40 rounded-btn transition-colors"
            title="Demo Scenario Switcher"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span className="hidden xl:inline">Scenario:</span>
            <span className="font-semibold text-text-primary capitalize">
              {activeScenario.replace('_', ' ')}
            </span>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>

          {scenarioMenuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-card rounded-btn border border-border shadow-elevated p-2 z-40">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-border">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Simulated Scenarios
                </span>
                <button
                  onClick={() => {
                    resetAllDemoData();
                    setScenarioMenuOpen(false);
                  }}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
              <div className="space-y-1">
                {scenarios.map((scen) => (
                  <button
                    key={scen.id}
                    onClick={() => {
                      applyScenario(scen.id);
                      setScenarioMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-btn text-xs transition-colors ${
                      activeScenario === scen.id
                        ? 'bg-sage text-primary font-medium'
                        : 'hover:bg-sand-light text-text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{scen.label}</span>
                      {activeScenario === scen.id && (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                      {scen.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guided Tour Trigger */}
        <button
          onClick={() => setIsTourOpen(true)}
          className="p-2 text-text-secondary hover:text-text-primary rounded-btn hover:bg-sage transition-colors"
          title="Interactive Guided Tour"
          aria-label="Interactive Tour"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative p-2 text-text-secondary hover:text-text-primary rounded-btn hover:bg-sage transition-colors"
          title="Notifications & Alerts"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-warningText ring-2 ring-card" />
          )}
        </button>

        {/* Marketing / Landing Page Link */}
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary px-2.5 py-1.5 rounded-btn hover:bg-sage transition-colors"
          title="Exit to Public Product Concept"
        >
          <span>Landing</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </header>
  );
};
