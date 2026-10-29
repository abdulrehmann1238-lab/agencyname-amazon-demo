import React, { useState } from 'react';
import {
  Globe2,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Languages,
  Sparkles,
  FileCheck,
  Send,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { ExpansionProject, MarketplaceRegion } from '../../types';

export const ExpansionPage: React.FC = () => {
  const { expansionProjects, brands, products, showToast } = useApp();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<ExpansionProject | null>(null);

  // Wizard temporary form state
  const [wizBrand, setWizBrand] = useState('b-alder');
  const [wizSourceMkt, setWizSourceMkt] = useState<MarketplaceRegion>('UK');
  const [wizDestMkt, setWizDestMkt] = useState<MarketplaceRegion>('DE');
  const [wizTone, setWizTone] = useState('Premium botanical cosmetic');
  const [wizTargetTitle, setWizTargetTitle] = useState(
    'Botanisches Gesichtsserum mit Bio-Retinol (30ml) — Intensives Anti-Aging Elixier'
  );
  const [wizTargetBullets, setWizTargetBullets] = useState(
    '• STRAHLENDER TEINT: 15% stabilisiertes Vitamin C verleiht sofortige Leuchtkraft.\n• ANTIOXIDATIVE BARRIERE: Schützt vor urbanen Umwelteinflüssen.\n• BIO-ZERTIFIZIERT: Kaltgepresste botanische Öle aus biologischem Anbau.'
  );

  const activeProjectsCount = expansionProjects.length;
  const awaitingApprovalCount = expansionProjects.filter(
    (e) => e.status === 'awaiting_approval'
  ).length;

  const handleStartWizard = () => {
    setWizardStep(1);
    setWizardOpen(true);
  };

  const handleSubmitWizard = () => {
    showToast(
      'Listing queued for approval',
      'Created pending review record. Listing will NOT be published without human authorization.',
      'success'
    );
    setWizardOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Marketplace Expansion
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              Multi-Marketplace Staging
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Prepare, translate, and compliance-check client listings for new European and North American regions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleStartWizard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start Expansion Workflow</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KPICard
          label="Active Expansion Projects"
          value={activeProjectsCount}
          subtitle="4 Launch pipelines"
        />
        <KPICard
          label="Awaiting Human Review"
          value={awaitingApprovalCount}
          subtitle="Ready for brand approval"
          badge={
            awaitingApprovalCount > 0 ? (
              <span className="w-2 h-2 rounded-full bg-status-warningText" />
            ) : undefined
          }
        />
        <KPICard
          label="Readiness Compliance Score"
          value="88%"
          subtitle="Amazon EU/UK taxonomy pass"
        />
        <KPICard
          label="Published to Amazon"
          value="0 (Gated)"
          subtitle="Zero unapproved live releases"
        />
      </div>

      {/* Expansion Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expansionProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="p-5 bg-card rounded-card border border-border shadow-soft hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {project.brandName}
                </span>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
              <StatusBadge variant={project.status} size="sm" />
            </div>

            <div className="flex items-center gap-3 py-2 text-xs text-text-secondary border-y border-border/60 my-3">
              <div>
                <span className="text-[10px] text-text-muted block">Route</span>
                <strong className="text-text-primary">
                  {project.sourceMarketplace} → {project.destinationMarketplace}
                </strong>
              </div>
              <div className="h-4 w-px bg-border" />
              <div>
                <span className="text-[10px] text-text-muted block">Catalog Scope</span>
                <strong className="text-text-primary">{project.skuCount} SKUs</strong>
              </div>
              <div className="h-4 w-px bg-border" />
              <div>
                <span className="text-[10px] text-text-muted block">Readiness</span>
                <strong className="text-primary font-bold">{project.readinessScore}%</strong>
              </div>
            </div>

            {/* Checklist summary bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>Compliance & Translation Checks</span>
                <span>
                  {Object.values(project.checks).filter(Boolean).length}/9 passed
                </span>
              </div>
              <div className="w-full bg-[#EAECE4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{
                    width: `${
                      (Object.values(project.checks).filter(Boolean).length / 9) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-text-muted text-[11px]">{project.lastUpdated}</span>
              <span className="text-primary font-medium flex items-center gap-1 group-hover:underline">
                Open Workspace <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 8-Step Start Expansion Wizard Modal */}
      <Modal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Start Marketplace Expansion Wizard"
        subtitle={`Step ${wizardStep} of 8: ${
          [
            'Select Brand',
            'Source Marketplace',
            'Target Destination',
            'Select Products',
            'Translation Tone',
            'Side-by-Side Localization',
            'Readiness Checklist',
            'Approval Gate',
          ][wizardStep - 1]
        }`}
        maxWidth="2xl"
        footer={
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => setWizardOpen(false)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {wizardStep > 1 && (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded-btn hover:bg-sage transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}

              {wizardStep < 8 ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors flex items-center gap-1"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitWizard}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn shadow-soft transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Human Approval</span>
                </button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          {wizardStep === 1 && (
            <div className="space-y-3">
              <label className="block font-semibold text-text-primary">
                Select Client Brand to Expand:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setWizBrand(b.id)}
                    className={`p-3 rounded-btn border text-left transition-all ${
                      wizBrand === b.id
                        ? 'border-primary bg-sage/40 text-text-primary font-medium'
                        : 'border-border bg-card text-text-secondary hover:border-text-muted'
                    }`}
                  >
                    <p className="font-semibold text-text-primary">{b.name}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{b.category}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-3">
              <label className="block font-semibold text-text-primary">
                Select Source Catalog Marketplace:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['UK', 'US'] as MarketplaceRegion[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setWizSourceMkt(m)}
                    className={`p-3 rounded-btn border text-left transition-all ${
                      wizSourceMkt === m
                        ? 'border-primary bg-sage/40 font-semibold'
                        : 'border-border hover:border-text-muted'
                    }`}
                  >
                    <span>{m === 'UK' ? '🇬🇧 United Kingdom (Amazon.co.uk)' : '🇺🇸 United States (Amazon.com)'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-3">
              <label className="block font-semibold text-text-primary">
                Select Destination Expansion Marketplace:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'DE', name: '🇩🇪 Germany (Amazon.de)' },
                  { id: 'FR', name: '🇫🇷 France (Amazon.fr)' },
                  { id: 'IT', name: '🇮🇹 Italy (Amazon.it)' },
                  { id: 'ES', name: '🇪🇸 Spain (Amazon.es)' },
                  { id: 'CA', name: '🇨🇦 Canada (Amazon.ca)' },
                ].map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => setWizDestMkt(dest.id as MarketplaceRegion)}
                    className={`p-3 rounded-btn border text-left transition-all ${
                      wizDestMkt === dest.id
                        ? 'border-primary bg-sage/40 font-semibold'
                        : 'border-border hover:border-text-muted'
                    }`}
                  >
                    <span className="text-xs">{dest.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-3">
              <label className="block font-semibold text-text-primary">
                Select Products to Stage for Launch:
              </label>
              <div className="space-y-2">
                {products
                  .filter((p) => p.brandId === wizBrand)
                  .map((prod) => (
                    <label
                      key={prod.id}
                      className="flex items-center gap-3 p-3 bg-card border border-border rounded-btn cursor-pointer hover:bg-sage/20"
                    >
                      <input type="checkbox" defaultChecked className="rounded text-primary" />
                      <div>
                        <span className="font-mono font-semibold text-primary">{prod.sku}</span>
                        <p className="font-medium text-text-primary">{prod.title}</p>
                      </div>
                    </label>
                  ))}
              </div>
            </div>
          )}

          {wizardStep === 5 && (
            <div className="space-y-3">
              <label className="block font-semibold text-text-primary">
                Configure Brand Voice & Terminology:
              </label>
              <select
                value={wizTone}
                onChange={(e) => setWizTone(e.target.value)}
                className="w-full p-2.5 bg-card border border-border rounded-btn text-text-primary text-xs"
              >
                <option>Premium botanical cosmetic (Natural & dermatologically validated)</option>
                <option>Culinary artisan stoneware (Warm, durable, minimalist)</option>
                <option>Clinical wellness & bio-hacking (Precise, scientific, compliant)</option>
              </select>
            </div>
          )}

          {wizardStep === 6 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-text-primary">
                  Side-by-Side Localized Preview ({wizSourceMkt} → {wizDestMkt}):
                </label>
                <span className="text-[10px] text-primary bg-sage px-2 py-0.5 rounded font-mono">
                  Claude AI Draft
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                  <span className="text-[10px] font-bold text-text-muted uppercase">English (Source)</span>
                  <p className="font-semibold text-text-primary mt-1">
                    Botanical Face Serum (30ml) - Vitamin C & Ferulic
                  </p>
                </div>
                <div className="p-3 bg-card rounded-btn border border-primary">
                  <span className="text-[10px] font-bold text-primary uppercase">German Localized (Editable)</span>
                  <input
                    type="text"
                    value={wizTargetTitle}
                    onChange={(e) => setWizTargetTitle(e.target.value)}
                    className="w-full mt-1 p-1 font-semibold text-text-primary bg-transparent border-b border-border focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1">
                  Bullet Points (German):
                </label>
                <textarea
                  rows={4}
                  value={wizTargetBullets}
                  onChange={(e) => setWizTargetBullets(e.target.value)}
                  className="w-full p-2.5 bg-card border border-border rounded-btn font-mono text-[11px] leading-relaxed text-text-primary"
                />
              </div>
            </div>
          )}

          {wizardStep === 7 && (
            <div className="space-y-3">
              <label className="block font-semibold text-text-primary">
                Mandatory Readiness Checklist:
              </label>
              <div className="space-y-2 bg-[#FBFBFA] p-3 rounded-btn border border-border">
                {[
                  'German Title length under 200 characters (Passed)',
                  'Required cosmetics attributes mapped (unit_count_type) (Passed)',
                  'Medical claim prohibition compliance (EU KVO) (Passed)',
                  'Backend search terms filtered for brand trademark restrictions (Passed)',
                  'Required CE/UKCA compliance documentation on file (Passed)',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 8 && (
            <div className="space-y-4 p-4 bg-sand-light rounded-btn border border-sand-dark/40 text-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary mx-auto">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  Ready for Human Signoff — NOT Published
                </h4>
                <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto leading-relaxed">
                  Submitting will stage this listing in the <strong>Human Approval Center</strong>. In accordance with agency governance, no listing will be pushed live to Amazon until authorized by the Account Lead.
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Expansion Detail Drawer */}
      <Drawer
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title || 'Expansion Workspace'}
        subtitle={`Scope: ${selectedProject?.skuCount} SKUs · ${selectedProject?.sourceMarketplace} to ${selectedProject?.destinationMarketplace}`}
        width="xl"
      >
        {selectedProject && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-sand-light rounded-btn border border-sand-dark/40">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted">Launch Status</span>
                <p className="font-semibold text-text-primary mt-0.5 capitalize">
                  {selectedProject.status.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-text-muted">Readiness Score</span>
                <p className="font-bold text-primary text-base font-mono">
                  {selectedProject.readinessScore}%
                </p>
              </div>
            </div>

            {/* Side-by-Side Localization Table */}
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Side-by-Side Catalog Localization</h4>
              <div className="space-y-3">
                <div className="p-3 bg-card border border-border rounded-btn">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Source Title ({selectedProject.sourceMarketplace})</span>
                  <p className="text-text-secondary mt-0.5 font-medium">{selectedProject.sampleListing.sourceTitle}</p>
                </div>

                <div className="p-3 bg-sage-light border border-border rounded-btn">
                  <span className="text-[10px] font-bold text-primary uppercase">Target Title ({selectedProject.destinationMarketplace})</span>
                  <p className="text-text-primary mt-0.5 font-semibold">{selectedProject.sampleListing.targetTitle}</p>
                </div>
              </div>
            </div>

            {/* Bullets comparison */}
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Key Product Bullets ({selectedProject.destinationMarketplace})</h4>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border space-y-2">
                {selectedProject.sampleListing.targetBullets.map((b, i) => (
                  <p key={i} className="text-text-secondary leading-relaxed">
                    {b}
                  </p>
                ))}
              </div>
            </div>

            {/* Readiness checks */}
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Readiness Checklist</h4>
              <div className="space-y-1.5">
                {Object.entries(selectedProject.checks).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded bg-card border border-border">
                    <span className="text-text-secondary capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${val ? 'bg-status-successBg text-status-successText' : 'bg-status-warningBg text-status-warningText'}`}>
                      {val ? 'Passed' : 'Action Required'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
