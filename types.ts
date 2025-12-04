export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  CRM = 'CRM',
  WEBSITE = 'WEBSITE',
  CONTENT = 'CONTENT',
  AUTOMATIONS = 'AUTOMATIONS',
  PAYMENTS = 'PAYMENTS',
  SETTINGS = 'SETTINGS',
}

export enum ClientStatus {
  LEAD = 'Lead',
  ACTIVE = 'Active',
  CHURNED = 'Churned',
}

export interface Client {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  program: string;
  joinDate: string;
  lastCheckIn: string;
  progress: number; // 0-100
}

export interface SocialPost {
  id: string;
  day: number;
  hook: string;
  body: string;
  cta: string;
  type: 'Video' | 'Image' | 'Carousel' | 'Text';
  status?: 'Draft' | 'Scheduled' | 'Published';
}

export interface WebsiteData {
  heroHeadline: string;
  heroSubhead: string;
  ctaText: string;
  features: string[];
  pricing: {
    name: string;
    price: string;
    features: string[];
  }[];
  testimonials: {
    name: string;
    result: string;
    quote: string;
  }[];
}

export interface BusinessBlueprint {
  businessName: string;
  niche: string;
  targetAudience: string;
  mission: string;
  websiteData: WebsiteData;
  contentPlan: SocialPost[];
  suggestedPrograms: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Automation {
  id: string;
  name: string;
  type: 'Email' | 'WhatsApp' | 'SMS';
  trigger: string;
  status: 'Active' | 'Paused';
  stats: {
    sent: number;
    opened: string;
  };
}

// Unified Project Data for Storage
export interface ProjectData {
  blueprint: BusinessBlueprint;
  clients: Client[];
  automations: Automation[];
}

export interface SavedProject {
  data: ProjectData;
  lastUpdated: string;
}