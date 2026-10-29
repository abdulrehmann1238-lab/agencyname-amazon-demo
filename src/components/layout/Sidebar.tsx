import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
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
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { pendingApprovalCount, selectedBrand } = useApp();
  const location = useLocation();

  const navItemClass = (isActive: boolean) =>
    `flex items-center justify-between px-3 py-2 rounded-btn text-xs font-medium transition-all ${
      isActive
        ? 'bg-sage text-primary font-semibold shadow-subtle'
        : 'text-text-secondary hover:text-text-primary hover:bg-[#E8EAE3]'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar border-r border-border text-text-primary select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-soft transition-transform group-hover:scale-105">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-text-primary">
                AUREL
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-semibold tracking-wider uppercase bg-sage text-primary rounded">
                OS
              </span>
            </div>
            <p className="text-[11px] text-text-muted">Agency Operations</p>
          </div>
        </NavLink>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-text-muted hover:text-text-primary rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Workspace / Brand Status */}
      <div className="p-3 mx-3 mt-3 rounded-btn bg-[#E6E9E1] border border-border text-xs">
        <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
          <span>Active Workspace</span>
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
        </div>
        <p className="font-semibold text-text-primary truncate">
          {selectedBrand ? selectedBrand.name : 'All Brands (Portfolio)'}
        </p>
        <p className="text-[10px] text-text-muted truncate mt-0.5">
          {selectedBrand ? `${selectedBrand.category} · ${selectedBrand.supportedMarketplaces.join(', ')}` : '24 Managed Accounts · SP-API'}
        </p>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Section 1: Portfolio */}
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            Portfolio
          </p>
          <div className="space-y-0.5">
            <NavLink
              to="/app"
              end
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span>Overview</span>
              </div>
            </NavLink>

            <NavLink
              to="/app/clients"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-primary" />
                <span>Brand Portfolio</span>
              </div>
            </NavLink>

            <NavLink
              to="/app/performance"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <LineChart className="w-4 h-4 text-primary" />
                <span>Performance & Data</span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Section 2: Operations */}
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            Operations
          </p>
          <div className="space-y-0.5">
            <NavLink
              to="/app/inventory"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <Boxes className="w-4 h-4 text-primary" />
                <span>Unified Stock</span>
              </div>
            </NavLink>

            <NavLink
              to="/app/profitability"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <Percent className="w-4 h-4 text-primary" />
                <span>Profit per SKU</span>
              </div>
            </NavLink>

            <NavLink
              to="/app/health"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-primary" />
                <span>Listing & Health</span>
              </div>
            </NavLink>

            <NavLink
              to="/app/expansion"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-4 h-4 text-primary" />
                <span>Marketplace Expansion</span>
              </div>
            </NavLink>

            <NavLink
              to="/app/onboarding"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-primary" />
                <span>Client Onboarding</span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Section 3: Workflow */}
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            Workflow & Approvals
          </p>
          <div className="space-y-0.5">
            <NavLink
              to="/app/approvals"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Approval Center</span>
              </div>
              {pendingApprovalCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-status-warningText text-white">
                  {pendingApprovalCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/app/communications"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Communications & Newsletters</span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Section 4: System */}
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            System
          </p>
          <div className="space-y-0.5">
            <NavLink
              to="/app/integrations"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-primary" />
                <span>Connected Systems</span>
              </div>
            </NavLink>

            <NavLink
              to="/app/settings"
              onClick={onCloseMobile}
              className={({ isActive }) => navItemClass(isActive)}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-primary" />
                <span>Workspace Settings</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Footer / Demo Environment Status */}
      <div className="p-3 border-t border-border bg-[#EAECE4] text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-semibold text-text-primary text-[11px]">
            Demo Environment
          </span>
        </div>
        <p className="text-[10px] text-text-muted leading-tight">
          Simulated Amazon SP-API & agency operational dataset.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 z-30 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-[#202820]/40 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-elevated z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
