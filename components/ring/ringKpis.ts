/**
 * Динамическая строка данных (Band 2) кольца — меняется по ресурсу/странице.
 * Каждая метрика: label (uk/en) + value + delta + tone + badge state + source (Data Passport).
 */
import type { KpiCell } from './UnifiedRing';

export const KPIS_DASHBOARD: KpiCell[] = [
  {
    label: { uk: 'Потреба', en: 'Demand' },
    value: '3.9M',
    delta: '+12%',
    up: false,
    tone: 'red',
    state: 'VERIFIED',
    source: { uk: 'Lancet 2023', en: 'Lancet 2023' },
  },
  {
    label: { uk: 'Покриття', en: 'Coverage' },
    value: '0.28%',
    delta: '+0.02',
    up: true,
    tone: 'red',
    state: 'VERIFIED',
    source: { uk: 'НСЗУ 2024', en: 'NHSU 2024' },
  },
  {
    label: { uk: 'ВВП-втрати', en: 'GDP loss' },
    value: '$13.94B',
    delta: '',
    up: false,
    tone: 'red',
    state: 'PROJECTION',
    source: { uk: '8.2% × ВВП IMF', en: '8.2% × GDP IMF' },
  },
  {
    label: { uk: 'ROI', en: 'ROI' },
    value: '$1→$4.5',
    delta: '+0.5',
    up: true,
    tone: 'gold',
    state: 'VERIFIED',
    source: { uk: 'WHO', en: 'WHO' },
  },
  {
    label: { uk: 'HEAL+THRIVE', en: 'HEAL+THRIVE' },
    value: '$954M',
    delta: '51%',
    up: true,
    tone: 'gold',
    state: 'STATIC',
    source: { uk: 'WB ISR', en: 'WB ISR' },
  },
];

export const KPIS_PROGRAM: KpiCell[] = [
  {
    label: { uk: 'Бар’єри доступу', en: 'Access barriers' },
    value: '~62%',
    delta: '',
    up: false,
    tone: 'red',
    state: 'VERIFIED',
    source: { uk: 'OCHA 2025', en: 'OCHA 2025' },
  },
  {
    label: { uk: 'Сесій на рік', en: 'Sessions/year' },
    value: '48–76M',
    delta: '',
    up: false,
    tone: 'red',
    state: 'PROJECTION',
    source: { uk: '3.9M × 12–20 WHO', en: '3.9M × 12–20 WHO' },
  },
  {
    label: { uk: 'Локалізація', en: 'Localization' },
    value: '1.2%',
    delta: '',
    up: false,
    tone: 'red',
    state: 'STATIC',
    source: { uk: 'Grand Bargain', en: 'Grand Bargain' },
  },
  {
    label: { uk: 'ROI програми', en: 'Program ROI' },
    value: '4:1',
    delta: '',
    up: true,
    tone: 'gold',
    state: 'VERIFIED',
    source: { uk: 'WHO', en: 'WHO' },
  },
];

export const KPIS_USERS: KpiCell[] = [
  {
    label: { uk: 'Активних кабінетів', en: 'Active cabins' },
    value: '3',
    delta: '',
    up: true,
    tone: 'teal',
    state: 'PENDING',
    source: { uk: 'site_front', en: 'site_front' },
  },
  {
    label: { uk: 'Провайдерів', en: 'Providers' },
    value: '4,000',
    delta: '+120',
    up: true,
    tone: 'teal',
    state: 'STATIC',
    source: { uk: 'НСЗУ реєстр', en: 'NHSU registry' },
  },
  {
    label: { uk: 'Поза ЄСОЗ', en: 'Outside ESOZ' },
    value: '624K',
    delta: '',
    up: false,
    tone: 'red',
    state: 'PROJECTION',
    source: { uk: 'MHPSS TWG', en: 'MHPSS TWG' },
  },
];

export const KPIS_DEMO: KpiCell[] = [
  {
    label: { uk: 'Демо-режим', en: 'Demo mode' },
    value: 'LIVE',
    delta: '',
    up: true,
    tone: 'teal',
    state: 'VERIFIED',
    source: { uk: 'sandbox', en: 'sandbox' },
  },
  {
    label: { uk: 'Сценаріїв', en: 'Scenarios' },
    value: '13',
    delta: '',
    up: true,
    tone: 'gold',
    state: 'STATIC',
    source: { uk: 'проєкти запуску', en: 'launch projects' },
  },
];

export const KPIS_PARTNERS: KpiCell[] = [
  {
    label: { uk: 'Банків (хартія)', en: 'Banks (charter)' },
    value: '38',
    delta: '',
    up: true,
    tone: 'gold',
    state: 'VERIFIED',
    source: { uk: 'НБУ', en: 'NBU' },
  },
  {
    label: { uk: 'Компаній (SIB)', en: 'Companies (SIB)' },
    value: '100',
    delta: '',
    up: true,
    tone: 'teal',
    state: 'PROJECTION',
    source: { uk: 'ESG', en: 'ESG' },
  },
];

export const RING_KPIS: Record<string, KpiCell[]> = {
  data: KPIS_DASHBOARD,
  program: KPIS_PROGRAM,
  users: KPIS_USERS,
  demo: KPIS_DEMO,
  partners: KPIS_PARTNERS,
};
