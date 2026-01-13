
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  lastActive?: number;
}

export interface AdUnit {
  id: string;
  type: 'header' | 'footer' | 'sidebar' | 'in-tool';
  label: string;
  html: string;
  active: boolean;
}

export interface Sponsor {
  id: string;
  imageUrl: string;
  link: string;
  name: string;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  activeTools: Record<string, boolean>;
  apiKeys: {
    gemini: string;
    youtube: string;
  };
  ads: Record<string, AdUnit>;
  sponsorConfig: {
    enabled: boolean;
    sponsors: Sponsor[];
  };
}

export enum ToolCategory {
  FINANCE = 'Finance',
  HEALTH = 'Health',
  UTILITY = 'Utility',
  YOUTUBE = 'YouTube',
  AI = 'AI'
}

export interface ToolInfo {
  id: string;
  name: string;
  icon: string;
  category: ToolCategory;
  description: string;
  requiresAuth: boolean;
}
