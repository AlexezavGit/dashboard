export const L1Strategic: React.FC<Props> = ({ lang, nav, liveHciValue, darkMode = true }) => {
  const [gaugeExpanded, setGaugeExpanded] = useState(false);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto overscroll-contain ds-screen"
      style={{
        background: darkMode
          ? 'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(0,210,170,0.10) 0%, transparent 55%), ' +
            'radial-gradient(ellipse 60% 50% at 80% 40%, rgba(0,180,200,0.07) 0%, transparent 50%), ' +
            'linear-gradient(135deg, #0a1628 0%, #1a0a0a 100%)'
          : 'var(--color-ds-bg)',
      }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #00d4aa 30%, #2ec4b6 60%, rgba(200,164,92,0.7) 100%)', boxShadow: '0 0 20px rgba(0,212,170,0.55)' }} />

      {/* ── Header ── */}
      <div className="flex items-center justify-between pl-4 pr-4 sm:pl-6 sm:pr-32 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Logo darkMode={darkMode} />
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono mb-0.5" style={{ color: 'var(--color-ds-muted)' }}>
              <span style={{ color: 'var(--color-ds-gold)' }}>FEEL Again</span>
              <span>·</span>
              <span>MHPSS Ukraine</span>
              <span>·</span>
              <span style={{ color: 'var(--color-ds-text)' }}>{lang === 'uk' ? 'ЛАНДШАФТ' : 'LANDSCAPE'}</span>
            </div>
            <div className="text-[17px] font-bold ds-display leading-tight" style={{ color: 'var(--color-ds-text)' }}>
              {lang === 'uk' ? 'Ідеальний шторм — поточний ландшафт MHPSS' : 'Perfect Storm — Current MHPSS Sector Landscape'}
            </div>
          </div>
        </div>
        {/* API status dot — links to l2-analytical */}
        <button
          onClick={() => nav.push('l2-analytical')}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            color: 'rgba(0,210,170,0.7)',
            background: 'rgba(0,210,170,0.06)',
            border: '1px solid rgba(0,210,170,0.2)',
            borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: '#00d4aa', boxShadow: '0 0 8px #00d4aa',
            animation: 'pulse 2s infinite',
          }} />
          {lang === 'uk' ? '● API Live' : '● API Live'}
        </button>
      </div>

      {/* ── Dashboard body — новые потоки, hero gauge и L1→L2 связь ── */}
      <div className="flex-1 min-h-0 flex flex-col px-5 pb-1 gap-3">

        {/* KPI chips above the gauge */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: { uk: 'Індекс MHEI', en: 'MHEI index' }, value: `${INDEX_SCORE}`, detail: BAND_LABEL[currentBand][lang], accent: BAND_COLOR[currentBand] },
            { label: { uk: 'GDP вплив', en: 'GDP impact' }, value: gdpImpact(INDEX_SCORE), detail: lang === 'uk' ? 'Якщо ліквідувати розрив' : 'If the gap is closed', accent: '#e8c97a' },
            { label: { uk: 'Заблоковано WB', en: 'Blocked WB funding' }, value: '$1.07B', detail: lang === 'uk' ? 'HEAL / THRIVE' : 'HEAL / THRIVE', accent: '#ff7b6e' },
            { label: { uk: 'Черга практиків', en: 'Practitioner backlog' }, value: '7.8–12 yr', detail: lang === 'uk' ? 'за поточним темпом' : 'at current pace', accent: '#00d4aa' },
          ].map(item => (
            <div key={item.label.uk} className="rounded-3xl border border-white/10 bg-white/5 p-4 min-h-[92px]">
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ds-muted)', marginBottom: 8 }}>
                {item.label[lang]}
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 900, color: item.accent, lineHeight: 1 }}>
                {item.value}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)', marginTop: 4 }}>
                {item.detail}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_1.25fr]">
          <div className="grid gap-3">
            <FlowStrip
              title={{ uk: 'Потік впливу A', en: 'Impact stream A' }}
              lang={lang}
              onNav={screen => nav.push(screen)}
              items={[
                { label: { uk: 'Потреби → Операційна', en: 'Needs → Operational' }, detail: { uk: 'L1 змістує L2', en: 'L1 feeds L2' }, screen: 'l2-operational', color: '#A855F7' },
                { label: { uk: 'Капітал → Клінічна', en: 'Capital → Clinical' }, detail: { uk: 'Фінансування перетікає в лікування', en: 'Funding flows into care' }, screen: 'l2-clinical', color: '#3B82F6' },
              ]}
            />

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 flex flex-col items-center text-center">
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2 }}>
                {lang === 'uk' ? 'Центральний потік' : 'Central flow'}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--color-ds-text)', marginBottom: 8 }}>
                {lang === 'uk' ? 'Індекс MHEI є енергетичним вузлом для L1 і L2' : 'MHEI is the energy hub tying L1 and L2 together'}
              </div>
                <div className="w-full max-w-[420px]">
                  <GaugeDisplay lang={lang} expanded={gaugeExpanded} onToggle={() => setGaugeExpanded((open) => !open)} />
                  <div style={{ marginTop: 12 }}>
                    <FlowStrip
                      title={{ uk: 'Потік впливу B', en: 'Impact stream B' }}
                      lang={lang}
                      onNav={screen => nav.push(screen)}
                      items={[
                        { label: { uk: 'Фінанси → Фінансова', en: 'Finance → Financial' }, detail: { uk: 'Управління витратами задає темп', en: 'Cost management sets pace' }, screen: 'l2-finance', color: '#EF4444' },
                        { label: { uk: 'Покриття → Стійкість', en: 'Coverage → Sustain' }, detail: { uk: 'Доступ формує довгостроковість', en: 'Access creates sustainability' }, screen: 'l2-sustain', color: '#10B981' },
                      ]}
                    />
                  </div>
                </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STRATEGIC_FRAMEWORK(lang).map((pillar, i) => {
                const config = PILLARS_CONFIG.find(c => c.id === pillar.id)!;
                return (
                  <LayerCard key={pillar.id} l={config} pillar={pillar} i={i} lang={lang} onNav={() => nav.push(config.screenId)} darkMode={darkMode} />
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-4">
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: 'var(--color-ds-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
              {lang === 'uk' ? 'Ціна бездіяльності' : 'Cost of Inaction'}
            </div>
            <div className="grid gap-2">
              {INACTION_COSTS.map(item => (
                <button
                  key={item.val}
                  onClick={() => {
                    if (item.anchor === null) {
                      nav.push('l2-analytical');
                    } else {
                      sessionStorage.setItem('l3-scroll', item.anchor);
                      nav.push('appendix');
                    }
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 p-3 text-left transition hover:border-white/20 hover:bg-white/10"
                  style={{ color: 'var(--color-ds-text)' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: item.color }}>{item.val}</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: item.color }}>→</span>
                  </div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--color-ds-muted)', marginTop: 4 }}>
                    {item.label[lang]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: 'var(--color-ds-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                {lang === 'uk' ? 'Ланцюг впливу ВВП' : 'GDP impact chain'}
              </div>
              <div className="grid gap-3">
                {GDP_CHAIN.map((m) => (
                  <div key={m.val} className="rounded-2xl border border-white/10 bg-black/10 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--color-ds-gold)' }}>{m.val}</span>
                      {m.arrow && <span style={{ color: 'rgba(200,164,92,0.65)', fontSize: 14 }}>→</span>}
                    </div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', marginTop: 4 }}>
                      {m.label[lang]}
                    </div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: 'rgba(200,164,92,0.6)', marginTop: 4 }}>
                      {m.source[lang]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => nav.push('l2-journey')}
                className="flex-1 min-w-[120px] rounded-2xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-[11px] font-bold text-blue-300"
              >
                {lang === 'uk' ? 'Шляхи Стейкхолдерів' : 'Stakeholder Journeys'}
              </button>
              <button
                onClick={() => nav.push('appendix')}
                className="flex-1 min-w-[120px] rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-medium text-white/80"
              >
                {lang === 'uk' ? 'Аналітичний звіт' : 'Analytical Report'}
              </button>
              <button
                onClick={() => nav.push('l4')}
                className="flex-1 min-w-[120px] rounded-2xl border border-teal-400/30 bg-teal-500/10 px-3 py-2 text-[11px] font-bold text-teal-200"
              >
                {lang === 'uk' ? 'Повний звіт →' : 'Full Report →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer bar — GDP causal chain ── */}
      <div
        className="flex-shrink-0 px-6 py-2 flex items-center gap-3 flex-wrap"
        style={{ borderTop: '1px solid var(--color-ds-border)', background: 'rgba(0,0,0,0.25)' }}
      >
        {GDP_CHAIN.map((m) => (
          <React.Fragment key={m.val}>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>{m.val}</span>
                <span className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{m.label[lang]}</span>
              </div>
              <span className="text-[8px] font-mono" style={{ color: 'rgba(200,164,92,0.45)' }}>{m.source[lang]}</span>
            </div>
            {m.arrow && (
              <span style={{ color: 'rgba(200,164,92,0.4)', fontSize: 12, flexShrink: 0 }}>→</span>
            )}
          </React.Fragment>
        ))}
        {liveHciValue && (
          <>
            <span style={{ color: 'rgba(200,164,92,0.4)', fontSize: 12 }}>·</span>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>HCI {liveHciValue}</span>
              <span className="text-[8px] font-mono" style={{ color: 'rgba(200,164,92,0.45)' }}>Human Capital Index · World Bank 2020</span>
            </div>
          </>
        )}
        <div className="flex-1" />
        <button
          onClick={() => nav.push('l2-journey')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-medium px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(68,136,255,0.07)', border: '1px solid rgba(68,136,255,0.3)', color: '#4488ff', marginRight: 8 }}
        >
          {lang === 'uk' ? 'Шляхи Стейкхолдерів' : 'Stakeholder Journeys'}
        </button>
        <button
          onClick={() => nav.push('appendix')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-medium"
          style={{ color: 'var(--color-ds-muted)' }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
          {lang === 'uk' ? 'Аналітичний звіт' : 'Analytical Report'}
        </button>
        <button
          onClick={() => nav.push('l4')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-bold px-3 py-1.5 rounded-lg"
          style={{ background: 'color-mix(in srgb, var(--color-ds-teal) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--color-ds-teal) 35%, transparent)', color: 'var(--color-ds-teal)' }}
        >
          {lang === 'uk' ? '→ Повний звіт' : '→ Full Report'}
        </button>
      </div>
    </div>
  );
};
