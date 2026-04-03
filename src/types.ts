export interface VisitingCard {
  id: string;
  image: string; // base64
  enhancedImage?: string;
  extractedText: string;
  name?: string;
  email?: string | string[];
  phone?: string | string[];
  address?: string;
  website?: string;
  company?: string;
  dates?: string[];
  timestamp: number;
}

export type AppState = 'splash' | 'home' | 'scan' | 'preview' | 'saved';
