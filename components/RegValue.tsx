import React from 'react';
import { reg, formatValue, STATUS_LABEL, type RegCode } from '../data/registry';

interface Props {
  code: RegCode;
  lang: 'uk' | 'en';
  /** Показати одиницю з реєстру поруч зі значенням. */
  unit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Число з реєстру FEEL Again. Значення, одиниця, статус і код беруться лише з реєстру;
 * у підказці — походження і період. Статус подається знаком і словом, не кольором.
 */
export const RegValue: React.FC<Props> = ({ code, lang, unit = true, className, style }) => {
  const e = reg(code);
  const s = STATUS_LABEL[e.status];
  const tip = `${e.code} · ${e.name}\n${lang === 'uk' ? 'Період' : 'Period'}: ${e.period || '—'}\n` +
    `${lang === 'uk' ? 'Походження' : 'Origin'}: ${e.origin}${e.formula ? `\n${lang === 'uk' ? 'Формула' : 'Formula'}: ${e.formula}` : ''}\n` +
    `Tier ${e.tier} · ${s[lang]}${e.conflict ? ` · ${e.conflict}` : ''}`;
  return (
    <span className={className} style={style} title={tip} data-reg={e.code}>
      {formatValue(e.value, lang)}
      {unit && e.unit ? <span style={{ opacity: 0.75 }}>{' '}{e.unit}</span> : null}
      <span style={{ fontSize: 'max(0.75em, 9px)', opacity: 0.85, marginLeft: '0.4em', whiteSpace: 'nowrap' }}>
        {s.mark}{' '}{s[lang]}{' '}·{' '}{e.code}
      </span>
    </span>
  );
};
