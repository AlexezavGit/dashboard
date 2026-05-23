import React from 'react';
import { DrillAnswers } from './DrilldownContext';
import { Language } from '../../types';

interface Props { answers: DrillAnswers; lang: Language; onEdit: () => void }

export const AnswersSummary: React.FC<Props> = ({ answers, lang, onEdit }) => {
  if (!answers) return null;
  const entries = Object.entries(answers).slice(0, 6);
  return (
    <div className="p-3 rounded-lg ds-spotlight" style={{ border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-2">
        <div style={{ fontSize: 12, fontWeight: 700 }}>{lang === 'uk' ? 'Контекст drill-down' : 'Drill-down context'}</div>
        <button onClick={onEdit} style={{ fontSize: 12, color: 'var(--color-ds-teal)' }}>{lang === 'uk' ? 'Редагувати' : 'Edit'}</button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{ fontSize: 11, color: 'var(--color-ds-muted)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-ds-text)' }}>{k}</div>
            <div>{String(v)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswersSummary;
