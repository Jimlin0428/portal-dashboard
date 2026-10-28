export type ToolCategory = 'business' | 'finance' | 'lifestyle';

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  url: string;
  isExternal: boolean;
  subdomain?: string;
  iconName: string;
  badge?: string;
  highlights?: string[];
}

export interface UserSubscriptionInfo {
  email?: string;
  allowed_tools: string[];
}

export type CategoryFilter = 'all' | ToolCategory;
