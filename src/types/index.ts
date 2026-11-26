export interface ProjectOverview {
  client: string;
  brief: string;
  targetAudience: string;
  garmentType: string;
  coreObjective: string;
}

export interface CreativeDirection {
  concept: string;
  mood: string;
  typography: string;
  illustration: string;
  culturalInspiration?: string;
  placement: string;
}

export interface DesignProcessInfo {
  sketchesNote: string;
  roughsNote: string;
  typographyTestsNote: string;
  colorExplorationsNote: string;
  placementTestingNote: string;
}

export interface FinalDesigns {
  frontArtwork: string;
  backArtwork?: string;
  sleeveArtwork?: string;
  neckChestDetails?: string;
  closeups: string[];
  transparentAssets?: string[];
  variations: string[];
}

export interface MockupGallery {
  heroMockup: string;
  frontMockup: string;
  backMockup?: string;
  sideView?: string;
  detailCloseups: string[];
  collectionViews: string[];
  modelMockups?: string[];
}

export interface ClientFeedback {
  quote: string;
  name: string;
  brand: string;
  role: string;
  verified: boolean;
}

export interface VerifiedResults {
  collectionResponse?: string;
  salesImpact?: string;
  repeatCollaboration?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  brandId: string;
  brandName: string;
  year: number | string;
  category: string;
  categories: string[];
  garmentTypes: string[];
  servicesProvided: string[];
  designerRole: string;
  projectOverview: ProjectOverview;
  designChallenge: string;
  creativeDirection: CreativeDirection;
  designProcess: DesignProcessInfo;
  finalDesigns: FinalDesigns;
  mockups: MockupGallery;
  clientFeedback?: ClientFeedback;
  verifiedResults?: VerifiedResults;
  isFeatured: boolean;
  isDraft: boolean;
  createdAt: string;
}

export interface BrandCollection {
  name: string;
  articleSummary: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  completedProjectsCount: number;
  collectionsCount?: number;
  collectionsList?: BrandCollection[];
  categories: string[];
  collaborationPeriod: string;
  location: string;
  websiteUrl?: string;
  verified: boolean;
  featured: boolean;
  galleryImages?: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  count: number;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  whatIsIncluded: string[];
  suitableFor: string;
  deliverables: string[];
  iconName: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  brandName: string;
  clientRole: string;
  projectId?: string;
  verified: boolean;
}

export interface SiteSettings {
  instagramUrl?: string;
  tiktokUrl?: string;
  pinterestUrl?: string;
  whatsappNumber: string;
  whatsappMessage: string;
  emailAddress: string;
  consultationLink: string;
  heroSlogan: string;
  heroIntro: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ProjectBriefFormData {
  fullName: string;
  brandName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  timezone: string;
  projectType: string;
  clothingCategory: string;
  requiredServices: string[];
  garmentTypes: string[];
  numberOfDesigns: string;
  budgetRange: string;
  deliveryTimeline: string;
  projectDescription: string;
  referenceLinks: string;
  fileUploadNames: string[];
  preferredContact: 'whatsapp' | 'email' | 'consultation';
  privacyConsent: boolean;
}

export interface ApparelCategory {
  id: string;
  name: string;
}

export interface CollectionDrop {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  description?: string;
  banner_image: string;
  is_active: boolean;
  sort_order?: number;
  created_at: string;
}

export interface ApparelProduct {
  id: string;
  collection_id: string;
  category_id: string;
  category_name?: string;
  title: string;
  slug: string;
  description?: string;
  images: string[];
  image_url?: string;
  sizes?: string[];
  price?: number | null;
  stock_quantity?: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCount {
  categoryId?: string;
  categoryName: string;
  count: number;
}

export interface CollectionWithStats extends CollectionDrop {
  categoryCounts: CategoryCount[];
  total_products?: number;
  products?: ApparelProduct[];
}

