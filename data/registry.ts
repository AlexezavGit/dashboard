// Єдиний шлях, яким число з реєстру потрапляє на екран.
// Число на сторінці = код реєстру → значення з data/registry.generated.ts.
// Заборонені коди в модулі мають лише ідентифікатор, тому показати їх неможливо.
import { REGISTRY, FORBIDDEN_CODES, type RegCode, type RegEntry, type RegStatus } from './registry.generated';

export type { RegCode, RegEntry, RegStatus };
export { REGISTRY_SOURCE_SHA256 } from './registry.generated';

export function reg(code: RegCode): RegEntry {
  const e = (REGISTRY as Record<string, RegEntry>)[code];
  if (!e) {
    if (FORBIDDEN_CODES.includes(code)) throw new Error(`${code} заборонений реєстром і не може бути показаний`);
    throw new Error(`${code} відсутній у реєстрі`);
  }
  return e;
}

const GROUP = ' '; // нерозривний пробіл між тисячами

/** Повне значення без округлення: групування тисяч, десяткова кома для uk. */
export function formatValue(value: string, lang: 'uk' | 'en'): string {
  const neg = value.startsWith('-');
  const [int, frac] = (neg ? value.slice(1) : value).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'uk' ? GROUP : ',');
  const dec = frac ? (lang === 'uk' ? ',' : '.') + frac : '';
  return (neg ? '−' : '') + grouped + dec;
}

/** Мітка статусу: знак і слово — колір ніколи не є єдиним носієм сенсу. */
export const STATUS_LABEL: Record<RegStatus, { mark: string; uk: string; en: string }> = {
  verified:   { mark: '✓', uk: 'перевірено', en: 'verified' },
  assumption: { mark: '△', uk: 'припущення', en: 'assumption' },
  disputed:   { mark: '⚑', uk: 'спірне',     en: 'disputed' },
};
