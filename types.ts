export type Language = 'uk' | 'en';

export interface LocalizedString {
  uk: string;
  en: string;
}

export interface KpiData {
  label: LocalizedString;
  value: string;
  sub: LocalizedString;
  change: LocalizedString;
  status: 'danger' | 'warning' | 'success' | 'neutral';
  source: LocalizedString;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface SectionData {
  id: string;
  title: LocalizedString;
  icon: string;
}

export type SectionFilter = 
  | 'all' 
  | 'prevalence' 
  | 'workforce' 
  | 'budget' 
  | 'gap' 
  | 'shadow' 
  | 'economic' 
  | 'children' 
  | 'inputs';
