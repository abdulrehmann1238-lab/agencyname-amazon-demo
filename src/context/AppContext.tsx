import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Brand,
  Marketplace,
  Product,
  InventoryItem,
  CostRecord,
  HealthIssue,
  ApprovalItem,
  OnboardingProject,
  ExpansionProject,
  NewsletterDraft,
  IntegrationItem,
  NotificationItem,
  DateRangeOption,
  DemoScenarioId,
  MarketplaceRegion,
} from '../types';
import {
  BRANDS,
  MARKETPLACES,
  PRODUCTS,
  INVENTORY_ITEMS,
  COST_RECORDS,
  HEALTH_ISSUES,
  APPROVAL_ITEMS,
  ONBOARDING_PROJECTS,
  EXPANSION_PROJECTS,
  NEWSLETTER_DRAFTS,
  INTEGRATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Global Filters
  selectedBrandId: string;
  setSelectedBrandId: (id: string) => void;
  selectedBrand: Brand | null;
  selectedMarketplace: string;
  setSelectedMarketplace: (mkt: string) => void;
  selectedChannel: 'all' | 'seller' | 'vendor';
  setSelectedChannel: (ch: 'all' | 'seller' | 'vendor') => void;
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;

  // Master Data
  brands: Brand[];
  marketplaces: Marketplace[];
  products: Product[];
  integrations: IntegrationItem[];

  // Operational State
  inventory: InventoryItem[];
  costs: CostRecord[];
  healthIssues: HealthIssue[];
  approvals: ApprovalItem[];
  onboardingProjects: OnboardingProject[];
  expansionProjects: ExpansionProject[];
  newsletters: NewsletterDraft[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  pendingApprovalCount: number;

  // Actions
  approveItem: (id: string, reviewerComment?: string) => void;
  rejectItem: (id: string, reason: string) => void;
  requestChangesItem: (id: string, comment: string) => void;
  draftReplenishmentTask: (sku: string, quantity: number) => void;
  updateCostAssumptions: (sku: string, cogs: number, landed: number, adSpend: number) => void;
  generateClaudeDraft: (issueId: string) => void;
  requestReviewForHealthIssue: (issueId: string) => void;
  runSimulatedHealthChecks: (onProgress?: (step: string) => void) => Promise<void>;
  simulateStockArrival: (brandName: string, skuCount: number, logistics3PL: string) => void;
  updateNewsletterDraft: (id: string, content: string, channel: 'email' | 'whatsapp' | 'excel') => void;
  generateClaudeNewsletter: (id: string, alternativeIndex?: number) => void;
  submitNewsletterForApproval: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Scenarios & UI State
  activeScenario: DemoScenarioId;
  applyScenario: (scenario: DemoScenarioId) => void;
  resetAllDemoData: () => void;
  
  // UI Controls
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'aurel_demo_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Filters
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'seller' | 'vendor'>('all');
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d');

  // Operational state
  const [brands, setBrands] = useState<Brand[]>(BRANDS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [costs, setCosts] = useState<CostRecord[]>(COST_RECORDS);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(HEALTH_ISSUES);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(APPROVAL_ITEMS);
  const [onboardingProjects, setOnboardingProjects] = useState<OnboardingProject[]>(ONBOARDING_PROJECTS);
  const [expansionProjects, setExpansionProjects] = useState<ExpansionProject[]>(EXPANSION_PROJECTS);
  const [newsletters, setNewsletters] = useState<NewsletterDraft[]>(NEWSLETTER_DRAFTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Scenarios & UI controls
  const [activeScenario, setActiveScenario] = useState<DemoScenarioId>('healthy');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helper
  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) || null;
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const pendingApprovalCount = approvals.filter((a) => a.status === 'needs_review').length;

  // 1. Approval actions
  const approveItem = (id: string, reviewerComment?: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'approved',
            reviewedBy: 'Authorized Agency Lead',
            reviewedAt: 'Just now (Demo)',
            reviewerComment: reviewerComment || 'Approved in demo simulation.',
          };
        }
        return item;
      })
    );

    // Synchronize connected modules
    const approvedItem = approvals.find((a) => a.id === id);
    if (approvedItem) {
      if (approvedItem.type === 'listing_correction') {
        setHealthIssues((prev) =>
          prev.map((h) => (h.sku === 'BOT-008' ? { ...h, status: 'resolved' } : h))
        );
      } else if (approvedItem.type === 'replenishment_order') {
        setInventory((prev) =>
          prev.map((inv) =>
            inv.sku === 'BOT-001'
              ? { ...inv, status: 'healthy', daysOfCover: 22.9, replenishmentPending: false }
              : inv
          )
        );
      } else if (approvedItem.type === 'client_newsletter') {
        setNewsletters((prev) =>
          prev.map((n) => (n.brandId === approvedItem.brandId ? { ...n, status: 'approved' } : n))
        );
      }
    }

    showToast('Approval recorded in this demo', 'Item approved and local demo states updated.', 'success');
  };

  const rejectItem = (id: string, reason: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'rejected',
            reviewedBy: 'Authorized Agency Lead',
            reviewedAt: 'Just now (Demo)',
            rejectionReason: reason,
          };
        }
        return item;
      })
    );
    showToast('Proposal rejected in demo', reason, 'warning');
  };

  const requestChangesItem = (id: string, comment: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'changes_requested',
            reviewerComment: comment,
          };
        }
        return item;
      })
    );
    showToast('Changes requested', 'Item marked for revision with notes.', 'info');
  };

  // 2. Draft replenishment task
  const draftReplenishmentTask = (sku: string, quantity: number) => {
    const inv = inventory.find((i) => i.sku === sku);
    if (!inv) return;

    const newApproval: ApprovalItem = {
      id: `appr-rep-${Date.now()}`,
      type: 'replenishment_order',
      typeLabel: 'FBA Replenishment Order',
      brandId: inv.brandId,
      brandName: inv.brandName,
      marketplace: inv.marketplace,
      title: `Transfer ${quantity} units of ${inv.productTitle} (${sku}) to FBA`,
      description: `Drafted from Inventory Workspace. Current FBA cover is ${inv.daysOfCover} days.`,
      proposedAction: `Inbound v0 plan transfer of ${quantity} units from ${inv.thirdPartyPartner} to Amazon FC.`,
      evidence: `Average daily sales: ${inv.averageDailySales} units/day. Available 3PL stock: ${inv.thirdPartyStock} units.`,
      priority: inv.daysOfCover < 7 ? 'urgent' : 'high',
      status: 'needs_review',
      requestedBy: 'Agency Operations Lead',
      requestedAt: 'Just now',
      relatedModuleRoute: '/app/inventory',
      draftContent: `Shipment Plan: ${sku}-${quantity}U\nOrigin: ${inv.thirdPartyPartner}\nDestination: Amazon UK FBA (EDI4 / LBA2)\nUnits: ${quantity}`,
    };

    setApprovals((prev) => [newApproval, ...prev]);
    setInventory((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, replenishmentPending: true, replenishmentQuantity: quantity } : i))
    );

    showToast('Replenishment task drafted', 'Approval item created in Human Approval Center.', 'success');
  };

  // 3. Cost assumptions update
  const updateCostAssumptions = (sku: string, cogs: number, landed: number, adSpend: number) => {
    setCosts((prev) =>
      prev.map((rec) => {
        if (rec.sku === sku) {
          const totalCogs = cogs * rec.unitsSold;
          const totalLanded = landed * rec.unitsSold;
          const totalAd = adSpend * rec.unitsSold;
          const totalFees = rec.amazonFees * rec.unitsSold;
          const otherVar = rec.otherVariableCost * rec.unitsSold;
          const netContribution = rec.netSales - (totalCogs + totalLanded + totalFees + totalAd + otherVar);
          const contributionMarginPercent = Number(((netContribution / rec.netSales) * 100).toFixed(1));
          const marginStatus =
            contributionMarginPercent >= rec.targetMarginPercent
              ? 'healthy'
              : contributionMarginPercent >= rec.targetMarginPercent - 5
              ? 'suboptimal'
              : 'critical';

          return {
            ...rec,
            costOfGoods: cogs,
            landedCost: landed,
            adSpendPerUnit: adSpend,
            totalCogs,
            totalLanded,
            totalAdSpend: totalAd,
            netContribution,
            contributionMarginPercent,
            marginStatus,
          };
        }
        return rec;
      })
    );
    showToast('Cost assumptions updated', `Recalculated contribution margin for SKU ${sku}.`, 'success');
  };

  // 4. Listing health actions
  const generateClaudeDraft = (issueId: string) => {
    setHealthIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: 'drafted',
            claudeDraft:
              issue.issueType === 'Listing Suppression'
                ? 'Review the missing product attribute against current catalog specifications. Update unit_count_type to "count" with unit_count="1" for 50ml jar. Submit via SP-API Listings Patch once confirmed.'
                : issue.issueType === 'Buy Box Loss'
                ? 'Prepare Brand Registry infringement complaint regarding unauthorized seller "KitchenDirect UK". Simultaneously initiate a temporary promotional price match to £44.00 to reclaim featured offer.'
                : 'Prepare comprehensive documentation dossier with stamped carrier proof of delivery to contest chargeback on Vendor Central portal.',
          };
        }
        return issue;
      })
    );
    showToast('Draft generated with Claude', 'Recommendation prepared and ready for review.', 'info');
  };

  const requestReviewForHealthIssue = (issueId: string) => {
    const issue = healthIssues.find((h) => h.id === issueId);
    if (!issue) return;

    const newApproval: ApprovalItem = {
      id: `appr-hlth-${Date.now()}`,
      type: issue.issueType === 'Listing Suppression' ? 'listing_correction' : 'health_appeal',
      typeLabel: issue.issueType,
      brandId: issue.brandId,
      brandName: issue.brandName,
      marketplace: issue.marketplace,
      title: `${issue.issueType}: ${issue.productTitle} (${issue.sku})`,
      description: issue.businessImpact,
      proposedAction: issue.proposedNextSteps,
      evidence: issue.evidence,
      priority: issue.severity === 'critical' ? 'urgent' : 'high',
      status: 'needs_review',
      requestedBy: 'Listing & Account Health Module',
      requestedAt: 'Just now',
      relatedModuleRoute: '/app/health',
      draftContent: issue.claudeDraft || issue.proposedNextSteps,
    };

    setApprovals((prev) => [newApproval, ...prev]);
    setHealthIssues((prev) =>
      prev.map((h) => (h.id === issueId ? { ...h, status: 'review_requested' } : h))
    );
    showToast('Review requested', 'Item forwarded to Human Approval Center.', 'success');
  };

  const runSimulatedHealthChecks = async (onProgress?: (step: string) => void) => {
    const steps = [
      'Querying Amazon SP-API Listings Items status...',
      'Checking Buy Box ownership across monitored catalog...',
      'Evaluating inventory cover thresholds...',
      'Reconciling recent customer review flags...',
      'Syncing Keepa pricing and sales rank history...',
    ];

    for (const step of steps) {
      if (onProgress) onProgress(step);
      await new Promise((res) => setTimeout(res, 400));
    }

    showToast('Health checks complete', 'Catalog and account telemetry refreshed.', 'success');
  };

  // 5. Onboarding simulate 3PL stock arrival
  const simulateStockArrival = (brandName: string, skuCount: number, logistics3PL: string) => {
    const newProjectId = `onb-${Date.now()}`;
    const newProject: OnboardingProject = {
      id: newProjectId,
      brandId: `b-${brandName.toLowerCase().replace(/\s+/g, '-')}`,
      brandName,
      category: 'New Client Portfolio',
      logisticsProvider: logistics3PL,
      stockArrivalDate: new Date().toISOString().split('T')[0],
      initialSkuCount: skuCount,
      currentStageId: 2,
      overallStatus: 'active',
      amazonAuthorizationStatus: 'pending_lwa',
      billingSetupStatus: 'draft_prepared',
      freedcampProjectCreated: true,
      assignedAccountManager: 'Claire Sterling',
      notes: `Pallet arrival confirmed by ${logistics3PL}. Client onboarding workflow instantiated.`,
      stages: [
        {
          id: 1,
          name: 'Stock Booked into 3PL',
          description: 'Physical inventory receipt confirmed',
          status: 'completed',
          owner: logistics3PL,
          completedAt: 'Just now',
          tasks: [{ id: 'st1', title: 'Carrier goods-in delivery accepted', completed: true, automatedSystem: `${logistics3PL} API` }],
        },
        {
          id: 2,
          name: 'Client Record Created',
          description: 'Workspace and initial catalog initialized',
          status: 'in_progress',
          owner: 'Claire Sterling',
          tasks: [{ id: 'st2', title: 'Initialize brand profile', completed: true }, { id: 'st3', title: 'Issue Amazon SP-API Authorization Link', completed: false }],
        },
        { id: 3, name: 'Amazon Authorization Requested', description: 'SP-API and Ads OAuth consent', status: 'pending', owner: 'Client', tasks: [] },
        { id: 4, name: 'Marketplace Permissions Confirmed', description: 'Token validation', status: 'pending', owner: 'Tech Ops', tasks: [] },
        { id: 5, name: 'Brand & SKU Data Prepared', description: 'Landed cost configuration', status: 'pending', owner: 'Data Ops', tasks: [] },
        { id: 6, name: 'Freedcamp Tasks Prepared', description: 'Milestone board creation', status: 'pending', owner: 'Claire Sterling', tasks: [] },
        { id: 7, name: 'Xero / GoCardless Billing Prepared', description: 'Retainer schedule', status: 'pending', owner: 'Finance', tasks: [] },
        { id: 8, name: 'Dashboard Configured', description: 'Looker / AUREL dashboard targets', status: 'pending', owner: 'BI Team', tasks: [] },
        { id: 9, name: 'Internal Review', description: 'Final signoff', status: 'pending', owner: 'Director', tasks: [] },
        { id: 10, name: 'Onboarding Complete', description: 'Active operational state', status: 'pending', owner: 'Claire Sterling', tasks: [] },
      ],
    };

    setOnboardingProjects((prev) => [newProject, ...prev]);

    // Also push a notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `3PL Stock Received: ${brandName}`,
      message: `${logistics3PL} verified ${skuCount} SKUs received. Onboarding project initialized.`,
      category: 'onboarding',
      timestamp: 'Just now',
      read: false,
      actionRoute: '/app/onboarding',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('New client onboarding triggered', `Stock arrival from ${logistics3PL} initiated workflow.`, 'success');
  };

  // 6. Communications actions
  const updateNewsletterDraft = (id: string, content: string, channel: 'email' | 'whatsapp' | 'excel') => {
    setNewsletters((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content, channel, lastEdited: 'Just now' } : n))
    );
  };

  const generateClaudeNewsletter = (id: string, alternativeIndex = 0) => {
    const alternatives = [
      `Weekly performance update highlights:\n- Sales increased by +9.2% WoW\n- TACoS is healthy at 10.9%\n- Organic share strengthened to 65.4%\nRecommended focus: Protect top-selling ASINs and prepare holiday replenishment.`,
      `Executive flash report:\n- Revenue momentum steady across primary UK marketplace.\n- Advertising efficiency improved with ACoS down to 24.5%.\n- Critical action: Confirm 500-unit FBA transfer in approval center.`,
    ];

    const chosenText = alternatives[alternativeIndex % alternatives.length];
    setNewsletters((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            content: `${n.content}\n\n[Claude Suggested Addition]:\n${chosenText}`,
            generatedByClaude: true,
            lastEdited: 'Just now',
          };
        }
        return n;
      })
    );
    showToast('Claude draft updated', 'Populated editor with AI-assisted operational brief.', 'info');
  };

  const submitNewsletterForApproval = (id: string) => {
    const draft = newsletters.find((n) => n.id === id);
    if (!draft) return;

    const newApproval: ApprovalItem = {
      id: `appr-nws-${Date.now()}`,
      type: draft.channel === 'whatsapp' ? 'whatsapp_update' : 'client_newsletter',
      typeLabel: draft.channel === 'whatsapp' ? 'WhatsApp Client Alert' : 'Client Newsletter Briefing',
      brandId: draft.brandId,
      brandName: draft.brandName,
      marketplace: 'UK',
      title: `${draft.subject} (${draft.period})`,
      description: `Client communication prepared for ${draft.brandName} via ${draft.channel.toUpperCase()}.`,
      proposedAction: `Queue approved communication for dispatch via ${draft.channel === 'whatsapp' ? 'Twilio Business API' : 'Agency Email Gateway'}.`,
      evidence: `Reconciled operational figures: ${draft.keyMetrics.revenue} revenue, TACoS ${draft.keyMetrics.tacos}.`,
      priority: 'medium',
      status: 'needs_review',
      requestedBy: 'Communications Builder (Claude)',
      requestedAt: 'Just now',
      relatedModuleRoute: '/app/communications',
      draftContent: draft.content,
    };

    setApprovals((prev) => [newApproval, ...prev]);
    setNewsletters((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'needs_review' } : n))
    );
    showToast('Briefing submitted for approval', 'Added to Human Approval Center.', 'success');
  };

  // 7. Notification actions
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', undefined, 'info');
  };

  // 8. Scenario switcher
  const applyScenario = (scenario: DemoScenarioId) => {
    setActiveScenario(scenario);
    if (scenario === 'healthy') {
      setInventory((prev) => prev.map((i) => ({ ...i, status: 'healthy', daysOfCover: 24.5 })));
      showToast('Scenario Applied: Healthy Portfolio', 'All brands operating smoothly above targets.', 'info');
    } else if (scenario === 'inventory_pressure') {
      setInventory((prev) =>
        prev.map((i) => (i.sku === 'BOT-001' || i.sku === 'WEL-022' ? { ...i, status: 'critical', daysOfCover: 4.5 } : i))
      );
      showToast('Scenario Applied: Inventory Pressure', 'FBA stockout risk on core hero SKUs.', 'warning');
    } else if (scenario === 'ad_decline') {
      showToast('Scenario Applied: Advertising Decline', 'ACoS spike detected across generic campaigns.', 'warning');
    } else if (scenario === 'listing_issue') {
      setHealthIssues((prev) =>
        prev.map((h) => (h.sku === 'BOT-008' ? { ...h, status: 'open', severity: 'critical' } : h))
      );
      showToast('Scenario Applied: Listing Issue', 'Suppressed listing requires catalog attribute patch.', 'error');
    } else if (scenario === 'onboarding') {
      simulateStockArrival('Bloom Botanics', 6, 'Pick Pack N Post');
      showToast('Scenario Applied: New Client Onboarding', 'New brand pallet checked into warehouse.', 'info');
    }
  };

  // 9. Reset all data
  const resetAllDemoData = () => {
    setBrands(BRANDS);
    setInventory(INVENTORY_ITEMS);
    setCosts(COST_RECORDS);
    setHealthIssues(HEALTH_ISSUES);
    setApprovals(APPROVAL_ITEMS);
    setOnboardingProjects(ONBOARDING_PROJECTS);
    setExpansionProjects(EXPANSION_PROJECTS);
    setNewsletters(NEWSLETTER_DRAFTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedBrandId('all');
    setSelectedMarketplace('all');
    setSelectedChannel('all');
    setDateRange('30d');
    setActiveScenario('healthy');
    showToast('Demo data reset', 'Restored all original sample records.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        selectedBrandId,
        setSelectedBrandId,
        selectedBrand,
        selectedMarketplace,
        setSelectedMarketplace,
        selectedChannel,
        setSelectedChannel,
        dateRange,
        setDateRange,

        brands,
        marketplaces: MARKETPLACES,
        products: PRODUCTS,
        integrations: INTEGRATIONS,

        inventory,
        costs,
        healthIssues,
        approvals,
        onboardingProjects,
        expansionProjects,
        newsletters,
        notifications,
        unreadNotificationCount,
        pendingApprovalCount,

        approveItem,
        rejectItem,
        requestChangesItem,
        draftReplenishmentTask,
        updateCostAssumptions,
        generateClaudeDraft,
        requestReviewForHealthIssue,
        runSimulatedHealthChecks,
        simulateStockArrival,
        updateNewsletterDraft,
        generateClaudeNewsletter,
        submitNewsletterForApproval,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        activeScenario,
        applyScenario,
        resetAllDemoData,

        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isTourOpen,
        setIsTourOpen,

        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
