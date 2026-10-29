import React, { useState } from 'react';
import {
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink,
  Lock,
  Layers,
  Database,
  Workflow,
  Sparkles,
  ShoppingBag,
  Building2,
  Target,
  LineChart,
  Warehouse,
  Boxes,
  Mail,
  MessageSquare,
  CreditCard,
  FileSpreadsheet,
  Headphones,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { IntegrationItem } from '../../types';

export const IntegrationsPage: React.FC = () => {
  const { integrations, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);

  const categories = [
    'all',
    'Amazon Commerce',
    'Advertising',
    'Inventory & Logistics',
    'Analytics & Costs',
    'AI',
    'Workflow Automation',
    'Communications',
    'Billing',
  ];

  const filteredIntegrations = integrations.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Amazon Commerce':
        return <ShoppingBag className="w-4 h-4 text-primary" />;
      case 'Advertising':
        return <Target className="w-4 h-4 text-terracotta" />;
      case 'Inventory & Logistics':
        return <Warehouse className="w-4 h-4 text-[#2A5576]" />;
      case 'Analytics & Costs':
        return <LineChart className="w-4 h-4 text-primary" />;
      case 'AI':
        return <Sparkles className="w-4 h-4 text-primary" />;
      case 'Workflow Automation':
        return <Workflow className="w-4 h-4 text-terracotta" />;
      case 'Communications':
        return <MessageSquare className="w-4 h-4 text-[#2A5576]" />;
      case 'Billing':
        return <CreditCard className="w-4 h-4 text-status-successText" />;
      default:
        return <Cpu className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Connected Systems Hub
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-sage text-primary border border-[#D5E2D5]">
              21 Integration Connectors
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Standardized adapters connecting Amazon SP-API, Advertising, 3PL warehouses, CRM and accounting systems.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search systems (e.g. SP-API, Xero, Keepa)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-card border border-border rounded-btn focus:outline-none focus:ring-1 focus:ring-primary shadow-subtle"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-btn transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-white font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-sage'
            }`}
          >
            {cat === 'all' ? 'All Systems (21)' : cat}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedIntegration(item)}
            className="p-5 bg-card rounded-card border border-border shadow-soft hover:shadow-card hover:border-primary transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#FBFBFA] border border-border flex-shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-text-muted">{item.category}</span>
                  </div>
                </div>

                <StatusBadge variant={item.demoStatus} size="sm" />
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mt-2 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-border/60 text-[11px] text-text-muted space-y-1">
                <div className="flex justify-between">
                  <span>Auth:</span>
                  <span className="text-text-secondary truncate max-w-[170px]">{item.authMethod}</span>
                </div>
                {item.lastSimulatedSync && (
                  <div className="flex justify-between">
                    <span>Sync:</span>
                    <span className="text-text-secondary font-mono">{item.lastSimulatedSync}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-[10px] text-text-muted">Interval: {item.syncInterval}</span>
              <span className="text-primary font-semibold flex items-center gap-1 group-hover:underline">
                Configure <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Production Architecture Whitepaper Callout */}
      <div className="p-6 bg-sage-light/60 rounded-card border border-border space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-text-primary">
            Production Data Layer & Integration Safeguards
          </h3>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          The production AUREL architecture separates client-facing dashboards from high-throughput SP-API ingestion. Below are key technical considerations established during system design:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-text-secondary">
          <div className="p-3.5 bg-card rounded-btn border border-border space-y-1">
            <h4 className="font-semibold text-text-primary">1. Seller & Vendor Decoupling</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Separate OAuth and EDI pipelines prevent Seller Central FBA metrics from polluting Vendor Central shipped revenue analytics.
            </p>
          </div>

          <div className="p-3.5 bg-card rounded-btn border border-border space-y-1">
            <h4 className="font-semibold text-text-primary">2. BigQuery vs Google Sheets</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              BigQuery serves as the enterprise analytical data store with automated date partitioning, while Sheets is reserved strictly for manual client input overrides.
            </p>
          </div>

          <div className="p-3.5 bg-card rounded-btn border border-border space-y-1">
            <h4 className="font-semibold text-text-primary">3. Quota Management & Backoff</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              SP-API and Ads API token buckets implement exponential backoff with durable dead-letter queues to gracefully handle Amazon rate limits.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Detail & Config Modal */}
      <Modal
        isOpen={!!selectedIntegration}
        onClose={() => setSelectedIntegration(null)}
        title={selectedIntegration?.name || 'System Configuration'}
        subtitle={`Category: ${selectedIntegration?.category} · Auth: ${selectedIntegration?.authMethod}`}
        maxWidth="lg"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSelectedIntegration(null)}
              className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              Close
            </button>
            <button
              onClick={() => {
                showToast('Integration parameters saved in demo', undefined, 'success');
                setSelectedIntegration(null);
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-btn transition-colors"
            >
              Save Parameters
            </button>
          </div>
        }
      >
        {selectedIntegration && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-sand-light rounded-btn border border-sand-dark/40 text-text-secondary leading-relaxed">
              <p className="font-semibold text-text-primary mb-1">Functional Description</p>
              <p>{selectedIntegration.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Data Ingested</span>
                <p className="text-text-primary mt-1 leading-relaxed">{selectedIntegration.dataProvided}</p>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-btn border border-border">
                <span className="text-[10px] uppercase font-bold text-text-muted">Data Dispatched</span>
                <p className="text-text-primary mt-1 leading-relaxed">{selectedIntegration.dataConsumed}</p>
              </div>
            </div>

            {selectedIntegration.configNotes.length > 0 && (
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Technical Implementation Notes:</h4>
                <ul className="space-y-1.5 bg-card p-3 rounded-btn border border-border font-mono text-[11px] text-text-secondary">
                  {selectedIntegration.configNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold">›</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
