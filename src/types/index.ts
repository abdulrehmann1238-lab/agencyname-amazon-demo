// Core domain types for AUREL - Amazon Agency Operating System

export type MarketplaceRegion = 'UK' | 'DE' | 'FR' | 'US' | 'CA' | 'IT' | 'ES';

export interface Marketplace {
  id: string;
  name: string;
  country: string;
  region: MarketplaceRegion;
  currency: string;
  currencySymbol: string;
  flag: string;
  defaultChannel: 'seller' | 'vendor' | 'both';
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logoText: string;
  accentColor: string;
  badgeBg: string;
  supportedMarketplaces: MarketplaceRegion[];
  channels: ('seller' | 'vendor')[];
  monthlySalesTarget: number;
  contactName: string;
  contactEmail: string;
  preferredChannel: 'email' | 'whatsapp' | 'excel';
  healthScore: number;
}

export interface Product {
  id: string;
  brandId: string;
  sku: string;
  asin: string;
  title: string;
  category: string;
  marketplace: MarketplaceRegion;
  channel: 'seller' | 'vendor';
  retailPrice: number;
  currency: string;
  imageUrl?: string;
  active: boolean;
}

export interface PerformanceMetricPoint {
  date: string;
  totalSales: number;
  adSales: number;
  organicSales: number;
  adSpend: number;
  units: number;
  sessions: number;
  clicks: number;
  cpc: number;
  roas: number;
}

export interface AdCampaign {
  id: string;
  name: string;
  type: 'Sponsored Products' | 'Sponsored Brands' | 'Sponsored Display';
  brandId: string;
  marketplace: MarketplaceRegion;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  dailyBudget: number;
  spend: number;
  sales: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  cpc: number;
  conversions: number;
}

export interface SearchTermData {
  id: string;
  searchTerm: string;
  campaignName: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  impressions: number;
  clicks: number;
  spend: number;
  attributedSales: number;
  acos: number;
  roas: number;
  conversionRate: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  productTitle: string;
  brandId: string;
  brandName: string;
  marketplace: MarketplaceRegion;
  fbaStock: number;
  vendorStock: number;
  thirdPartyStock: number; // 3PL stock
  totalStock: number;
  averageDailySales: number;
  daysOfCover: number;
  status: 'critical' | 'risk' | 'healthy' | 'overstocked' | 'zero_demand';
  replenishmentPending: boolean;
  replenishmentQuantity?: number;
  thirdPartyPartner: string;
  stockHistory: { date: string; fba: number; vendor: number; thirdParty: number }[];
}

export interface CostRecord {
  id: string;
  productId: string;
  sku: string;
  productTitle: string;
  brandId: string;
  brandName: string;
  marketplace: MarketplaceRegion;
  retailPrice: number;
  netSales: number;
  unitsSold: number;
  costOfGoods: number; // per unit
  landedCost: number;   // shipping/freight per unit
  amazonFees: number;   // referral + FBA pick & pack per unit
  adSpendPerUnit: number;
  otherVariableCost: number;
  // Computed fields
  totalCogs: number;
  totalLanded: number;
  totalFees: number;
  totalAdSpend: number;
  netContribution: number;
  contributionMarginPercent: number;
  targetMarginPercent: number;
  marginStatus: 'healthy' | 'suboptimal' | 'critical';
  sellerboardComparison?: {
    sellerboardContribution: number;
    difference: number;
    withinTolerance: boolean;
  };
}

export type HealthSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface HealthIssue {
  id: string;
  brandId: string;
  brandName: string;
  sku: string;
  asin: string;
  productTitle: string;
  marketplace: MarketplaceRegion;
  issueType: 
    | 'Listing Suppression'
    | 'Buy Box Loss'
    | 'Unauthorized Seller'
    | 'Account Health Warning'
    | 'Vendor Shortage Claim'
    | 'Vendor Chargeback';
  severity: HealthSeverity;
  detectedAt: string;
  status: 'open' | 'drafted' | 'review_requested' | 'resolved' | 'dismissed';
  evidence: string;
  businessImpact: string;
  proposedNextSteps: string;
  claudeDraft?: string;
  assignedTo: string;
  keepaHistory?: { date: string; price: number; bsr: number; buyBoxPrice: number }[];
}

export type ApprovalType = 
  | 'listing_correction'
  | 'replenishment_order'
  | 'client_newsletter'
  | 'whatsapp_update'
  | 'marketplace_translation'
  | 'vendor_shortage_response'
  | 'health_appeal';

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  typeLabel: string;
  brandId: string;
  brandName: string;
  marketplace: MarketplaceRegion;
  title: string;
  description: string;
  proposedAction: string;
  evidence: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'needs_review' | 'approved' | 'rejected' | 'changes_requested';
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerComment?: string;
  rejectionReason?: string;
  relatedModuleRoute: string;
  draftContent?: string;
}

export interface OnboardingStage {
  id: number;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  owner: string;
  completedAt?: string;
  tasks: { id: string; title: string; completed: boolean; automatedSystem?: string }[];
}

export interface OnboardingProject {
  id: string;
  brandId: string;
  brandName: string;
  category: string;
  logisticsProvider: string;
  stockArrivalDate: string;
  initialSkuCount: number;
  currentStageId: number;
  overallStatus: 'active' | 'blocked' | 'ready_for_review' | 'completed';
  stages: OnboardingStage[];
  amazonAuthorizationStatus: 'authorized' | 'pending_lwa' | 'required';
  billingSetupStatus: 'ready' | 'draft_prepared' | 'awaiting_mandate';
  freedcampProjectCreated: boolean;
  assignedAccountManager: string;
  notes: string;
}

export interface ExpansionProject {
  id: string;
  title: string;
  brandId: string;
  brandName: string;
  sourceMarketplace: MarketplaceRegion;
  destinationMarketplace: MarketplaceRegion;
  skuCount: number;
  status: 'planning' | 'translating' | 'readiness_check' | 'awaiting_approval' | 'ready_to_launch';
  readinessScore: number;
  lastUpdated: string;
  checks: {
    titleLengthCheck: boolean;
    requiredAttributes: boolean;
    missingListingFields: boolean;
    restrictedClaimsCheck: boolean;
    destinationCategoryMapped: boolean;
    localizedCopyReviewed: boolean;
    searchTermsOptimized: boolean;
    complianceDocumentation: boolean;
    humanApprovalRecorded: boolean;
  };
  sampleListing: {
    sourceTitle: string;
    targetTitle: string;
    sourceBullets: string[];
    targetBullets: string[];
    sourceDescription: string;
    targetDescription: string;
    sourceSearchTerms: string;
    targetSearchTerms: string;
  };
}

export interface NewsletterDraft {
  id: string;
  brandId: string;
  brandName: string;
  period: string; // e.g. "Week 43 (Oct 21 - Oct 27, 2026)"
  channel: 'email' | 'whatsapp' | 'excel';
  templateId: 'weekly_update' | 'monthly_review' | 'ppc_summary' | 'inventory_alert';
  subject: string;
  content: string;
  status: 'draft' | 'needs_review' | 'approved';
  generatedByClaude: boolean;
  tone: 'professional' | 'strategic' | 'concise';
  lastEdited: string;
  keyMetrics: {
    revenue: string;
    spend: string;
    tacos: string;
    topSku: string;
    units: string;
  };
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'Amazon Commerce' | 'Advertising' | 'Inventory & Logistics' | 'Analytics & Costs' | 'AI' | 'Workflow Automation' | 'Communications' | 'Billing';
  description: string;
  demoStatus: 'Planned' | 'Demo configured' | 'Requires authorization';
  authMethod: string;
  dataProvided: string;
  dataConsumed: string;
  syncInterval: string;
  iconName: string;
  lastSimulatedSync?: string;
  configNotes: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'inventory' | 'advertising' | 'health' | 'approval' | 'onboarding';
  timestamp: string;
  read: boolean;
  actionRoute?: string;
}

export type DemoScenarioId = 'healthy' | 'inventory_pressure' | 'ad_decline' | 'listing_issue' | 'onboarding';

export type DateRangeOption = '7d' | '30d' | '90d' | 'ytd';
