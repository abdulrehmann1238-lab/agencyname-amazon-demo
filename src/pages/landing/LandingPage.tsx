import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Boxes,
  Percent,
  LineChart,
  Globe2,
  UserPlus,
  MessageSquare,
  Sparkles,
  Layers,
  Cpu,
  Lock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Building2,
  ShoppingBag,
  Clock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Initial loading sequence state
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'line' | 'done'>('initial');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'portfolio' | 'inventory' | 'approvals'>('portfolio');

  useEffect(() => {
    // Phase 1 to Phase 2: 400ms
    const t1 = setTimeout(() => {
      setLoadingPhase('line');
    }, 350);

    // Phase 2 to Phase 3: 950ms total
    const t2 = setTimeout(() => {
      setLoadingPhase('done');
    }, 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const workflowSteps = [
    {
      num: '01',
      title: 'Detect',
      subtitle: 'Continuous Telemetry Scan',
      summary: 'Scheduled SP-API reports, 3PL inventory syncs and Keepa price checks reveal an operational signal.',
      details: 'Example: Daily inventory run rate reveals Botanical Face Serum FBA stock has dropped to 5.1 days of cover in Northampton FC.',
    },
    {
      num: '02',
      title: 'Interpret',
      subtitle: 'Cross-System Context',
      summary: 'Business logic correlates sales velocity, active campaigns, and available 3PL warehouse units.',
      details: 'Evaluates Pick Pack N Post stock (680 units available) and flags that transferring 500 units will protect Buy Box status.',
    },
    {
      num: '03',
      title: 'Draft',
      subtitle: 'Claude AI Preparation',
      summary: 'Claude drafts a complete, structured operational proposal with supporting diagnostic evidence.',
      details: 'Prepares Inbound Shipping Plan parameters (carrier, pallet allocation, FC destination) and drafts client briefing note.',
    },
    {
      num: '04',
      title: 'Review',
      subtitle: 'Human Governance Gate',
      summary: 'Authorized Account Lead or Ops Lead inspects the proposed action in the Human Approval Center.',
      details: 'Reviewer verifies carrier rates, warehouse readiness, and checks that stock allocation aligns with client budget.',
    },
    {
      num: '05',
      title: 'Approve',
      subtitle: 'Explicit Authorization',
      summary: 'The human signs off, requests edits, or rejects the proposal with recorded operational notes.',
      details: 'Approval decision is permanently logged in the audit trail with simulated timestamp and reviewer credentials.',
    },
    {
      num: '06',
      title: 'Execute',
      subtitle: 'Integration Dispatch',
      summary: 'In production, the approved action is idempotently submitted to the destination API.',
      details: 'Simulated in this demo: SP-API FBA Inbound plan is confirmed and internal inventory days-of-cover is restored.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-sage selection:text-primary-dark font-sans relative overflow-x-hidden">
      {/* 4. Ultra-Premium Initial Loading Experience */}
      {loadingPhase !== 'done' && (
        <div className="fixed inset-0 z-50 bg-[#F7F7F3] flex flex-col items-center justify-center transition-opacity duration-500 opacity-100">
          <div className="flex flex-col items-center max-w-sm text-center px-4 animate-in fade-in duration-300">
            {/* Wordmark */}
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-elevated mb-4">
              A
            </div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              AUREL
            </h1>
            <p className="text-xs text-text-secondary mt-1 font-medium">
              The operating system for Amazon growth.
            </p>

            {/* Drawing Line Animation */}
            <div className="w-48 h-0.5 bg-[#E6E8E1] rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-primary animate-draw-line" />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-text-muted">
              <span>Initializing multi-brand workspace</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#F7F7F3]/90 backdrop-blur-md border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shadow-soft transition-transform group-hover:scale-105">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-text-primary">
                  AUREL
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-sage text-primary rounded">
                  Concept
                </span>
              </div>
              <p className="text-[10px] text-text-muted">Agency Operations</p>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-text-secondary">
            <a href="#platform" className="hover:text-text-primary transition-colors">
              Platform
            </a>
            <a href="#capabilities" className="hover:text-text-primary transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-text-primary transition-colors">
              Operational Flow
            </a>
            <a href="#integrations" className="hover:text-text-primary transition-colors">
              Integrations
            </a>
            <a href="#architecture" className="hover:text-text-primary transition-colors">
              Architecture
            </a>
          </div>

          {/* Right: CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="hidden sm:inline-flex text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-btn hover:bg-sage transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-all hover:scale-[1.02]"
            >
              <span>Explore the Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card p-4 space-y-3 text-xs">
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-text-secondary hover:text-text-primary"
            >
              Platform Overview
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-text-secondary hover:text-text-primary"
            >
              Seven Capabilities
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-text-secondary hover:text-text-primary"
            >
              Operational Workflow
            </a>
            <a
              href="#integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-text-secondary hover:text-text-primary"
            >
              Integrations
            </a>
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="block pt-2 border-t border-border font-semibold text-primary"
            >
              Enter Live Application →
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden ambient-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 6 Cols: Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage border border-[#D5E2D5] text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                The Operating Layer for Amazon Agencies
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
                Every brand. Every marketplace.{' '}
                <span className="text-primary italic font-serif">One clear view.</span>
              </h1>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                Bring Amazon sales, advertising, stock, profitability, account health and agency operations together. Give your team the clarity to act without losing human control.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/app"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-elevated transition-all hover:scale-[1.02]"
                >
                  <span>Explore the Live Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#workflow"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary bg-card border border-border rounded-btn transition-colors hover:bg-sage/40"
                >
                  <span>See How it Works</span>
                </a>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Multi-Brand Architecture
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Human-Approved Automation
                </span>
              </div>
            </div>

            {/* Right 6 Cols: Live Interactive Product Preview */}
            <div className="lg:col-span-6">
              <div
                onClick={() => navigate('/app')}
                className="bg-card rounded-hero border border-border shadow-elevated p-4 sm:p-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer group relative overflow-hidden"
                title="Click to enter interactive application"
              >
                {/* Top preview bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E67E66]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5BA6A]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#68A37E]" />
                    <span className="text-[11px] font-mono text-text-muted ml-2">
                      aurel-os.agency/app/overview
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-primary bg-sage px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Simulated Telemetry
                  </span>
                </div>

                {/* Mini Preview UI */}
                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  <div className="p-2.5 bg-[#FBFBFA] rounded-card border border-border">
                    <span className="text-[10px] uppercase font-bold text-text-muted">Total Sales</span>
                    <p className="text-sm font-bold font-mono text-text-primary mt-0.5">£284,650</p>
                    <span className="text-[9px] text-status-successText">+8.4% vs 30d</span>
                  </div>

                  <div className="p-2.5 bg-[#FBFBFA] rounded-card border border-border">
                    <span className="text-[10px] uppercase font-bold text-text-muted">Ad Spend / TACoS</span>
                    <p className="text-sm font-bold font-mono text-text-primary mt-0.5">£31,420</p>
                    <span className="text-[9px] text-primary">11.0% TACoS</span>
                  </div>

                  <div className="p-2.5 bg-sand-light rounded-card border border-sand-dark/40">
                    <span className="text-[10px] uppercase font-bold text-terracotta">Pending Approvals</span>
                    <p className="text-sm font-bold font-mono text-text-primary mt-0.5">3 Actions</p>
                    <span className="text-[9px] text-text-muted">Requires Signoff</span>
                  </div>
                </div>

                {/* Simulated Mini Chart & Warning Row */}
                <div className="p-3 bg-[#FBFBFA] rounded-card border border-border space-y-2 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-text-primary">Attributed Sales Velocity</span>
                    <span className="text-text-muted font-mono">64% Organic Share</span>
                  </div>
                  {/* Subtle CSS Sparkline */}
                  <div className="h-10 w-full flex items-end gap-1.5 pt-2">
                    {[35, 42, 48, 40, 56, 62, 58, 70, 78, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/25 rounded-t group-hover:bg-primary transition-all duration-300"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Alert item */}
                <div className="p-2.5 bg-[#FFF9F6] rounded-card border border-[#F3D5C8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                    <span className="font-medium text-text-primary text-[11px]">
                      Botanical Serum (BOT-001): 5.1 days FBA cover remaining
                    </span>
                  </div>
                  <span className="text-primary font-bold text-[11px]">Review →</span>
                </div>

                {/* Hover overlay hint */}
                <div className="mt-3 pt-2 text-center text-[11px] text-primary font-medium flex items-center justify-center gap-1 group-hover:underline">
                  <span>Click to interact with full operating platform</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Performance Ticker (PRD 5.4) */}
      <section className="bg-card border-y border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="pt-2 md:pt-0">
              <span className="text-xl sm:text-2xl font-bold font-mono text-text-primary">24</span>
              <p className="text-xs text-text-muted mt-0.5">Brands in Portfolio</p>
            </div>
            <div className="pt-2 md:pt-0">
              <span className="text-xl sm:text-2xl font-bold font-mono text-text-primary">1,280</span>
              <p className="text-xs text-text-muted mt-0.5">Tracked Active SKUs</p>
            </div>
            <div className="pt-2 md:pt-0">
              <span className="text-xl sm:text-2xl font-bold font-mono text-text-primary">6</span>
              <p className="text-xs text-text-muted mt-0.5">Marketplace Regions (UK & EU)</p>
            </div>
            <div className="pt-2 md:pt-0">
              <span className="text-xl sm:text-2xl font-bold font-mono text-primary">18</span>
              <p className="text-xs text-text-muted mt-0.5">Reviewed Decisions This Cycle</p>
            </div>
          </div>
          <p className="text-[10px] text-text-muted text-center mt-3">
            Illustrative portfolio data for this demonstration.
          </p>
        </div>
      </section>

      {/* Operational Problem Section (PRD 5.5) */}
      <section id="platform" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Too many tools. Too many blind spots.
            </h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Agency teams shouldn't have to reconstruct performance from disconnected reports, inventory systems and message threads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-card border border-border shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sage flex items-center justify-center text-primary">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                Disconnected Data
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Amazon sales, advertising, stock, and costs often sit in different systems. Teams waste hours reconciling Sellerboard, Keepa and spreadsheets before finding answers.
              </p>
            </div>

            <div className="p-6 bg-card rounded-card border border-border shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center text-terracotta">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                Reactive Operations
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Listing suppressions, Buy Box losses, and stockout risks are discovered days late between routine checks. Revenue drops before an account manager notices.
              </p>
            </div>

            <div className="p-6 bg-card rounded-card border border-border shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-olive flex items-center justify-center text-[#3F4832]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                Manual Coordination
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Approvals, client onboarding, weekly newsletters, and Freedcamp tasks consume valuable hours that senior agency directors should spend on growth strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Capabilities Section (PRD 5.6) */}
      <section id="capabilities" className="py-16 md:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              Integrated Modular Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              One operational layer. Seven connected capabilities.
            </h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Every requested agency module built into a unified system with consistent state, shared brands, and human approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[
              {
                title: 'Amazon Data Layer',
                desc: 'Unified ingestion across Seller Central, Vendor Central and Amazon Ads with organic baseline separation.',
                route: '/app/performance',
                icon: LineChart,
                badge: 'Module 1',
              },
              {
                title: 'Unified Stock & 3PLs',
                desc: 'Consolidates FBA warehouses and 3PLs (Mintsoft, Pick Pack N Post) into actionable days of cover.',
                route: '/app/inventory',
                icon: Boxes,
                badge: 'Module 2',
              },
              {
                title: 'Profit per SKU',
                desc: 'Real net contribution formula subtracting COGS, landed shipping, FBA fees, and PPC advertising spend.',
                route: '/app/profitability',
                icon: Percent,
                badge: 'Module 3',
              },
              {
                title: 'Listing & Account Health',
                desc: 'Detects suppressions, Buy Box hijackers, and vendor shortage disputes with Keepa charts and Claude drafts.',
                route: '/app/health',
                icon: ShieldCheck,
                badge: 'Module 4',
              },
              {
                title: 'Marketplace Expansion',
                desc: 'Structured 8-step launch wizard with localized catalog translations, compliance checks, and approval gate.',
                route: '/app/expansion',
                icon: Globe2,
                badge: 'Module 5',
              },
              {
                title: 'Client Onboarding',
                desc: 'Automates workflow triggers from 3PL goods arrival to Freedcamp milestones, SP-API tokens, and Xero billing.',
                route: '/app/onboarding',
                icon: UserPlus,
                badge: 'Module 6',
              },
              {
                title: 'Reporting & Newsletters',
                desc: 'Dynamic client briefings for Email, WhatsApp, and Excel with client-brand palettes and Claude drafting.',
                route: '/app/communications',
                icon: MessageSquare,
                badge: 'Module 7',
              },
              {
                title: 'Human Approval Center',
                desc: 'The central operational gate ensuring no consequential action or API dispatch occurs without signoff.',
                route: '/app/approvals',
                icon: CheckCircle2,
                badge: 'Central Gate',
              },
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  onClick={() => navigate(cap.route)}
                  className="p-5 bg-background rounded-card border border-border shadow-soft hover:border-primary hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-card border border-border text-primary group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        {cap.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed mt-1.5">
                      {cap.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-primary font-medium group-hover:underline">
                      Explore capability →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Operational Flow (PRD 5.7) */}
      <section id="workflow" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              From signal to action, with a human in control.
            </h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Click through the 6 operational stages to see how telemetry converts into authorized agency outcomes.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {workflowSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-3 rounded-card border text-left transition-all ${
                  activeWorkflowStep === idx
                    ? 'border-primary bg-card shadow-card font-semibold'
                    : 'border-border bg-[#FBFBFA] text-text-secondary hover:bg-sage/40'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-primary block">
                  {step.num}
                </span>
                <span className="text-xs text-text-primary block mt-0.5">{step.title}</span>
                <span className="text-[10px] text-text-muted truncate block">{step.subtitle}</span>
              </button>
            ))}
          </div>

          {/* Active Step Explanatory Panel */}
          <div className="p-6 bg-card rounded-hero border border-border shadow-soft grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="text-xs font-bold font-mono text-primary uppercase">
                Stage {workflowSteps[activeWorkflowStep].num} · {workflowSteps[activeWorkflowStep].subtitle}
              </span>
              <h3 className="text-xl font-bold text-text-primary">
                {workflowSteps[activeWorkflowStep].title}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {workflowSteps[activeWorkflowStep].summary}
              </p>
              <div className="pt-2">
                <Link
                  to="/app/approvals"
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                >
                  <span>See Approval Center in action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-5 bg-sand-light rounded-card border border-sand-dark/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-terracotta">
                Simulated Operational Scenario
              </span>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                {workflowSteps[activeWorkflowStep].details}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Integrations Grid (PRD 5.9) */}
      <section id="integrations" className="py-16 md:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Connect the tools your team already uses.
            </h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Standardized connectors covering all 21 requested agency systems across inventory, analytics, AI, and billing.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            {[
              { name: 'Seller Central SP-API', cat: 'Amazon', status: 'Demo configured' },
              { name: 'Vendor Central', cat: 'Amazon', status: 'Demo configured' },
              { name: 'Amazon Ads API', cat: 'Advertising', status: 'Demo configured' },
              { name: 'Sellerboard', cat: 'Analytics', status: 'Demo configured' },
              { name: 'Keepa API', cat: 'Analytics', status: 'Demo configured' },
              { name: 'Google BigQuery', cat: 'Data Warehouse', status: 'Demo configured' },
              { name: 'Google Sheets', cat: 'Workspace', status: 'Planned' },
              { name: 'Looker Studio', cat: 'Reporting', status: 'Demo configured' },
              { name: 'Claude 3.5 Sonnet', cat: 'AI Drafting', status: 'Demo configured' },
              { name: 'Make.com', cat: 'Workflow', status: 'Demo configured' },
              { name: 'Freedcamp', cat: 'PM', status: 'Demo configured' },
              { name: 'Twilio WhatsApp', cat: 'Messaging', status: 'Demo configured' },
              { name: 'Xero Accounting', cat: 'Billing', status: 'Demo configured' },
              { name: 'GoCardless', cat: 'Direct Debit', status: 'Demo configured' },
              { name: 'Pick Pack N Post', cat: '3PL Logistics', status: 'Demo configured' },
              { name: 'Mintsoft 3PL', cat: '3PL Logistics', status: 'Demo configured' },
              { name: 'Blue30', cat: '3PL Logistics', status: 'Requires auth' },
              { name: 'Linnworks', cat: 'Inventory', status: 'Planned' },
            ].map((tool, i) => (
              <div
                key={i}
                className="p-3 bg-[#FBFBFA] rounded-btn border border-border flex flex-col justify-between"
              >
                <div>
                  <p className="font-semibold text-text-primary truncate">{tool.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{tool.cat}</p>
                </div>
                <div className="mt-2 pt-1 border-t border-border/60">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${
                    tool.status === 'Demo configured'
                      ? 'bg-status-successBg text-status-successText'
                      : tool.status === 'Requires auth'
                      ? 'bg-status-warningBg text-status-warningText'
                      : 'bg-sand text-text-muted'
                  }`}>
                    {tool.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/app/integrations"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            >
              <span>View full technical integration architecture in app</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture & Governance (PRD 5.10 & 5.11) */}
      <section id="architecture" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-sage px-2.5 py-1 rounded-full">
                Engineering Blueprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Built to evolve beyond the first dashboard.
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                The architecture decouples Amazon data extraction from operational action. Data streams from SP-API into Google BigQuery partitions, while Claude prepares drafts for human review.
              </p>

              <div className="space-y-3 pt-2 text-xs text-text-secondary">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Zero PII in Scope:</strong> Operates entirely on aggregated ASIN metrics and financial settlement feeds.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Human-in-the-Loop Safeguards:</strong> AI drafts recommendations; authorized personnel confirm execution.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Durable Handover:</strong> Clean TypeScript architecture ready to link real SP-API tokens in production.</span>
                </div>
              </div>
            </div>

            {/* Architecture Flow Card */}
            <div className="p-6 bg-card rounded-hero border border-border shadow-elevated space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-text-muted text-[10px] block">LAYER 1: DATA SOURCES</span>
                <p className="font-semibold text-text-primary mt-0.5">SP-API · Vendor Central · Ads API · 3PL Webhooks</p>
              </div>
              <div className="text-center text-text-muted text-[10px]">↓ Scheduled Ingestion & Normalization</div>
              <div className="p-3 bg-sage-light rounded-btn border border-border">
                <span className="text-primary text-[10px] block font-bold">LAYER 2: CENTRAL DATA LAKE</span>
                <p className="font-semibold text-text-primary mt-0.5">Google Cloud BigQuery (EU Partitioned)</p>
              </div>
              <div className="text-center text-text-muted text-[10px]">↓ Diagnostic Triggers & Prompts</div>
              <div className="p-3 bg-sand-light rounded-btn border border-sand-dark/40">
                <span className="text-terracotta text-[10px] block font-bold">LAYER 3: AI DRAFTING & RULES</span>
                <p className="font-semibold text-text-primary mt-0.5">Anthropic Claude 3.5 Sonnet Proposal Engine</p>
              </div>
              <div className="text-center text-text-muted text-[10px]">↓ Strict Human Approval Gate</div>
              <div className="p-3 bg-primary text-white rounded-btn shadow-soft">
                <span className="text-white/80 text-[10px] block font-bold">LAYER 4: HUMAN APPROVAL ORCHESTRATION</span>
                <p className="font-bold text-white mt-0.5">AUREL Approval Center (Audit Trail)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section (PRD 5.12) */}
      <section className="py-20 bg-primary-dark text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="px-3 py-1 rounded-full bg-white/10 text-sage text-xs font-semibold uppercase tracking-wider">
            Ready to Explore
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            See the whole operation, not just another report.
          </h2>
          <p className="text-sm text-sage/90 max-w-xl mx-auto leading-relaxed">
            Explore how a connected operating layer could help your agency manage multiple brands, protect account health, and make better commercial decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary bg-white hover:bg-sage rounded-btn shadow-elevated transition-transform hover:scale-105"
            >
              <span>Open the Interactive Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#"
              className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-white/80 hover:text-white border border-white/20 rounded-btn transition-colors hover:bg-white/10"
            >
              <span>Back to Top ↑</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer (PRD 5.13) */}
      <footer className="bg-card border-t border-border py-12 text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                <span className="font-bold text-text-primary text-sm">AUREL</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                The operating system for Amazon growth. An interactive product concept designed for enterprise agency operations.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-text-primary uppercase text-[10px] tracking-wider mb-2.5">
                Capabilities
              </h4>
              <ul className="space-y-1.5 text-text-muted">
                <li><Link to="/app/performance" className="hover:text-primary">Performance & Ads</Link></li>
                <li><Link to="/app/inventory" className="hover:text-primary">Unified Stock</Link></li>
                <li><Link to="/app/profitability" className="hover:text-primary">Profit per SKU</Link></li>
                <li><Link to="/app/health" className="hover:text-primary">Listing & Health</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-primary uppercase text-[10px] tracking-wider mb-2.5">
                Workflows
              </h4>
              <ul className="space-y-1.5 text-text-muted">
                <li><Link to="/app/approvals" className="hover:text-primary">Human Approval Center</Link></li>
                <li><Link to="/app/expansion" className="hover:text-primary">Marketplace Expansion</Link></li>
                <li><Link to="/app/onboarding" className="hover:text-primary">Client Onboarding</Link></li>
                <li><Link to="/app/communications" className="hover:text-primary">Client Newsletters</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-primary uppercase text-[10px] tracking-wider mb-2.5">
                Live Prototype
              </h4>
              <ul className="space-y-1.5 text-text-muted">
                <li><Link to="/app" className="hover:text-primary font-semibold text-primary">Explore Workspace →</Link></li>
                <li><Link to="/app/integrations" className="hover:text-primary">Connected Systems</Link></li>
                <li><Link to="/app/settings" className="hover:text-primary">Workspace Settings</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-muted gap-2">
            <p>© 2026 AUREL — Interactive concept for demonstration purposes.</p>
            <p>Sample data · No live integrations</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
