import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  LayoutDashboard,
  Boxes,
  Percent,
  ShieldAlert,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GuidedTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isTourOpen) return null;

  const tourSteps = [
    {
      title: 'Portfolio Overview & Executive Clarity',
      description:
        'A single consolidated view across Seller Central, Vendor Central and Amazon Ads for multiple consumer brands. Seamlessly filter by brand, marketplace, and date range.',
      route: '/app',
      icon: LayoutDashboard,
      badge: 'Step 1 of 5',
    },
    {
      title: 'Unified Inventory & FBA Stock Protection',
      description:
        'Combines FBA, Vendor, and 3PL warehouse inventory (Mintsoft, Pick Pack N Post) into single unified Days of Cover metrics. Trigger one-click replenishment drafting directly into human approvals.',
      route: '/app/inventory',
      icon: Boxes,
      badge: 'Step 2 of 5',
    },
    {
      title: 'Real Profit per SKU & Sellerboard Reconciliation',
      description:
        'Net contribution formula factoring landed freight, FBA fees, and PPC ad spend per SKU. Test live cost assumption updates and compare variance with Sellerboard.',
      route: '/app/profitability',
      icon: Percent,
      badge: 'Step 3 of 5',
    },
    {
      title: 'Listing Health & Claude Response Drafting',
      description:
        'Surfaces listing suppressions, Buy Box loss, and Vendor shortage deductions early. Uses integrated Keepa price history and Claude to draft editable mitigation proposals.',
      route: '/app/health',
      icon: ShieldAlert,
      badge: 'Step 4 of 5',
    },
    {
      title: 'Human Approval Center — Zero Autonomous Risks',
      description:
        'The operational control gate: Every consequential action (catalog patches, stock orders, client newsletters, translations) requires human review and signoff before execution.',
      route: '/app/approvals',
      icon: CheckCheck,
      badge: 'Step 5 of 5',
    },
  ];

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      navigate(tourSteps[nextStep].route);
    } else {
      setIsTourOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      navigate(tourSteps[prevStep].route);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#202820]/40 backdrop-blur-sm"
        onClick={() => setIsTourOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-card rounded-modal border border-border shadow-elevated p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              AUREL Interactive Walkthrough
            </span>
          </div>
          <button
            onClick={() => setIsTourOpen(false)}
            className="p-1 text-text-muted hover:text-text-primary rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="py-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage flex items-center justify-center text-primary flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-text-muted uppercase">
                {step.badge}
              </span>
              <h4 className="text-base font-semibold text-text-primary tracking-tight">
                {step.title}
              </h4>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed bg-[#FBFBFA] p-3.5 rounded-card border border-border">
            {step.description}
          </p>

          <div className="flex items-center gap-1.5 pt-1">
            {tourSteps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStep
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            onClick={() => setIsTourOpen(false)}
            className="text-xs text-text-muted hover:text-text-primary"
          >
            Skip walkthrough
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-btn border border-border hover:bg-sage transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors flex items-center gap-1"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <span>Complete Tour</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
