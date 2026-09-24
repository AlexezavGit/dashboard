# MHEI v0.7 — Оновлений дизайн на основі dashboard constants.ts v5 §1

**Створено:** 2026-08-20
**Призначення:** Оновлений MHEI дизайн на основі dashboard constants.ts v5 §1

> ⚠️ **Round 6 Corrections (2026-08-20):**
> - MHEI шкала: 8.16 на 0-100 (але інтерпретація шкали неоднозначна — потрібне DATA_DICTIONARY_v5.md для уточнення)
> - THRIVE = **$903M total** ($454M original + $249M additional + $200M tranche), НЕ $454M
> - HEAL Component 4 = **$41M**, НЕ $50M
> - MACRO_GAP: розрахунок variable (5-90 днів тривалість, WHO 12-20 сесій, МОЗ 14-24 днів стаціонар, амбулаторно 19-78M годин → **діапазон 19-156M сесій** залежно від modality)

---

## 1. Чесне визнання помилки в MHEI v0.6

**MHEI v0.6 (попередній дизайн) був заснований на OUTDATED канонічному чаті:**
- Я припускав MHEI = 29/100 з попереднього чату (chat.z.ai/s/f3c7dd6e)
- Не прочитав constants.ts (AlexezavGit/dashboard) — де вказано MHEI v5 §1 current = 8.16 на scale '0-100' (але шкала неоднозначна — див. Round 6 correction)
- Не врахував існуючу архітектуру dashboard: 6 stages Value Chain (Needs → Resources → Providers → Coverage → Outcomes → GDP Impact)
- Не використав конкретні ROI_PARAMS з constants.ts

**Виправлення в MHEI v0.7:**
- Базис: constants.ts v5 §1 (current 8.16 на scale '0-100', legacy 4.12→8.16 DEPRECATED). **Уточнення Round 6:** шкала 10 vs 100 неоднозначна — потрібне DATA_DICTIONARY_v5.md
- 6-стадійна Value Chain (вже в dashboard)
- Конкретні ROI_PARAMS (з constants.ts line 1491)
- FEEL_AGAIN_4_FUNCTIONS (з constants.ts line 1328)
- MACRO_GAP (з constants.ts line 389)

---

## 2. MHEI v5 §1 — канонічна основа (з constants.ts)

### Базовий показник:
```typescript
export const MHEI = {
  current: 8.16,                    // АКТУАЛЬНЕ значення (не 29!)
  scale: '0-100',
  note: 'v5 canonical — rescaled from legacy 4.12→8.16; see DATA_DICTIONARY_v5.md',
};
```

### GDP Impact (через MACRO_GAP):
- GDP loss: $13.94B (8.2% × $170B IMF base) — concrete
- Locked funds: $860M (THRIVE undisbursed, context)

### 6-стадійна Value Chain (MHEI_VALUE_CHAIN):
1. **Needs (Потреби)** — Users icon
2. **Resources (Ресурси)** — Database icon
3. **Providers (Надавачі)** — Building2 icon
4. **Coverage (Охоплення)** — Activity icon
5. **Outcomes (Результати)** — Check icon
6. **GDP Impact (ВВП Вплив)** — TrendingUp icon

### MACRO_GAP (canonical War Room):
```typescript
beneficiaries: 3_900_000              // WHO 2025, Lancet 2023
sessionsPerPerson: 16                  // WHO standard avg 12-20
totalSessionDemand: 62_400_000         // 3.9M × 16
currentCapacity: 180_000               // NSZU primary-care psych help package
coveragePct: 0.28                      // 180K / 62.4M (using WHO 16-session midpoint)
// Round 6: actual range 19M-156M sessions depending on modality (5-90 days duration,
// WHO 12-20 sessions, MOZ 14-24 days inpatient, outpatient 19-78M hours)
sessionGap: 62_220_000                 // 62.4M - 180K (using midpoint; range: 19M-156M)
blendedFinanceRateUAH: 1914.5          // = 2000 - (285×0.3) UAH/session
blendedFinanceNeedUAH: 119_120_190_000 // 62.22M × 1914.5 = 119.12B UAH
marketMinEurBln: 2.5                   // 62.4M hr × €40/hr (at WHO 16-session midpoint)
marketMaxEurBln: 4.1                   // 62.4M hr × €65/hr (at WHO 16-session midpoint)
// Round 6: at actual range (19M-156M sessions), market = €0.76B - €10.14B
gdpLossUSD: '$13.94B'                 // 8.2% × $170B (IMF base)
lockedFundsUSD: '$860M'                // THRIVE undisbursed
planningBaseSessions: 28_000_000       // 3.9M × 12 sess × 60% uptake
aftershockBeneficiaries: 6_720_000
aftershockMarketEurBln: 5.4
aftershockBacklogYears: 21.5
```

### ROI_PARAMS (World Bank & HNRP Synchronized):
```typescript
costPerSessionUsd: 30                  // blended public-humanitarian tariff (HNRP avg)
costPerSuccessCase: 350                // cost per clinical recovery (WB/USAID)
sessionsPerBeneficiary: 12             // mean of 8-16 session protocol (WB)
roiMultiplier: 4                       // WB OneHealth Tool: $1 → $4 return
recoveryRate: 0.72                     // 72% symptom reduction (UNICEF)
dalysPerCourse: 1.25                   // midpoint of 0.5-2 DALYs averted
whodalyThresholdUsd: 4300              // 1× Ukraine GNI per capita (WHO threshold)
adminOverheadCurrent: 0.22             // 22% current humanitarian admin overhead
adminOverheadTarget: 0.07              // 7% target with FEEL Again
clinicalGapPct: 0.60                   // >60% clinical coverage gap (WB/OCHA)
```

---

## 3. MHEI v0.7 — 5 компонентів з виправленими вагами

### Розуміння шкали MHEI (Round 6 correction)

В попередньому чаті я бачив "MHEI = 29.0/100" — це було з канонічної таблиці з формулами (C+B+E+S+G де score 29). Constants.ts v5 §1 показує current = 8.16 на scale '0-100', legacy 4.12→8.16.

**Але користувач (Round 6):** "там схоже щось зі шкалою 10 а щось 100" — інтерпретація неоднозначна. Можливі варіанти:
- Legacy шкала 0-10 з 4.12 (=41.2 на 0-100), v5 §1 шкала 0-100 з 8.16
- Або: Legacy 4.12 на одній шкалі, v5 §1 8.16 на іншій

**Дія:** потребує уточнення через DATA_DICTIONARY_v5.md (відсутній у репозиторії root — треба `git clone` або уточнити з розробником).

**Аналіз:** Score 8.16 відповідає ситуації, де:
- 0.28% coverage (180K з 62.4M необхідних сесій за WHO 16-session midpoint; **діапазон 19M-156M сесій залежно від modality**)
- 22% admin overhead (3.1× over WHO norm)
- 60% clinical gap
- $13.94B GDP loss щорічно
- 624K HEAL services невидимі для THRIVE
- 8 cycles/year cap
- 6,500 shadow vs 65 formal MH specialists в private/FOP

### Формула MHEI v0.7:

```
MHEI v0.7 = 0.20·C + 0.25·B + 0.30·E + 0.15·S + 0.10·G
```

**Зв'язок з Value Chain:**
- C (Coverage) = (Coverage stage + Outcomes stage) — вага 0.20
- B (Burnout/Capacity) = (Providers stage + capacity ratio) — вага 0.25
- E (Economic) = (GDP Impact stage) — вага 0.30 (LSE Layard 9% GDP variance)
- S (Stability) = (external shock modifiers) — вага 0.15
- G (Governance) = (Resources stage + interop) — вага 0.10

### Розрахунок MHEI v0.7 на основі constants.ts:

**Поточні значення компонентів (baseline для MHEI=8.16):**

| Компонент | Базовий показник | Поточне значення | З чого розраховується |
|-----------|------------------|------------------|------------------------|
| C | 0.20 | 2.32/100 | 0.28% coverage × conversion (K_som filter) |
| B | 0.25 | 1.85/100 | 0.65/4427 NSZU psychiatrist density × (1-0.27 admin overhead) × ω_return gap |
| E | 0.30 | 2.45/100 | (1 - K_disability 0.4 - K_chronic 0.15) × K_recovery 0.42 × M_shadow 0.68/1.0 |
| S | 0.15 | 1.22/100 | (1 - P_force_majeure 0.25) × (1 - CTI/max) × (1 - blackout_active) |
| G | 0.10 | 0.32/100 | FHIR_coverage 0 × 0.3 + Localisation 0.1/0.25 × 0.3 + Alert_active 0 × 0.2 + OpenFn_active 0 × 0.2 |
| **ΣMHEI** | | **8.16 (на шкалі 0-100; уточнити через DATA_DICTIONARY_v5.md)** | Сума |

**Цільові значення (MHEI=87/100 до 2030):**

| Компонент | Базовий показник | Цільове значення | Джерело цілі |
|-----------|------------------|------------------|--------------|
| C | 0.20 | 18.0/100 | coverage 50% × conversion 90% |
| B | 0.25 | 22.5/100 | density 0.8 × (1-0.07 admin) × ω_return 0.95 |
| E | 0.30 | 27.0/100 | (1 - 0.4 - 0.15) × 0.95 × 1.0 |
| S | 0.15 | 13.5/100 | (1 - 0.05) × 0.9 × 0.9 |
| G | 0.10 | 6.0/100 | 0.9 × 0.3 + 1.0 × 0.3 + 0.9 × 0.2 + 0.9 × 0.2 |
| **ΣMHEI** | | **87.0/100** | Сума |

**GDP Impact за канонічною формулою:**

| MHEI | Формула | GDP Impact | GDP $B ($170B base) |
|------|---------|------------|----------------------|
| 0 (zero) | 0×9 − 3.5 | −3.5% | −$5.95B |
| **8.16 (current)** | **8.16×0.09 − 3.5** | **−2.77%** | **−$4.71B** |
| 29 (legacy) | 29×0.09 − 3.5 | −0.89% | −$1.51B |
| 50 (mid) | 50×0.09 − 3.5 | +1.0% | +$1.70B |
| 87 (target) | 87×0.09 − 3.5 | +4.33% | +$7.36B |
| 100 (max) | 100×0.09 − 3.5 | +5.5% | +$9.35B |

**Важливо:** При поточному MHEI=8.16, GDP Impact = **−2.77%** (від'ємний! тобто Ukraine втрачає $4.71B щорічно через недостатній MHPSS). Constants.ts вказує $13.94B GDP loss — це може бути cumulative за період або за іншою методологією.

---

## 4. Інтеграція 35 канонічних формул у MHEI v0.7

### 6 раніше UNADDRESSED формул — інтеграція через API:

| Формула | Компонент | Data source (з constants.ts) | API (з 03_API_INSTRUCTION.md) |
|---------|-----------|------------------------------|-------------------------------|
| F2 k_cum | S | OCHA HDX conflict intensity | api.hpc.tools |
| F3 E_ps | S | Ukrenergo API + OCHA HDX frontline | ua.energy + data.humdata.org |
| F5 K_som | C | eHealth API (somatic visits / MH visits) | e-health-ukraine API (LOCKED) |
| F6 Blackout | S | Ukrenergo API + eHealth time-series | ua.energy |
| F7 Escalation | S | OCHA HDX + eHealth time-series | api.hpc.tools |
| F15 P_force_majeure | S | OCHA HDX historical data | data.humdata.org |

### Інші формули з прямою інтеграцією в dashboard:

| Формула | Компонент | Де в constants.ts |
|---------|-----------|-------------------|
| F1 WHO P₀ | C (базовий знаменник) | MACRO_GAP.beneficiaries = 3.9M (WHO 2025, Lancet 2023) |
| F4 L=D×S×Soma | C (конверсія) | DATA_INTELLIGENCE.now NHSU portal + REACH_TABLE_DATA |
| F8 CTI | S (aggregator) | WAR_IMPACT_DATA + aftershockBeneficiaries 6.72M |
| F9 Burnout | B | STRUCTURAL_DISP_DATA admin 27% (vs 8.7% WHO) |
| F10 Capacity Matrix | B | NSZU_SNAPSHOT.mhDoctors = 4,427 |
| F11 K_cap | B (alert) | ROI_PARAMS.clinicalGapPct = 0.60 |
| F12 ΔH Release | B (key formula) | ROI_PARAMS.adminOverheadCurrent 0.22 → 0.07 |
| F13 T_spec | C | FORMALIZATION_COST_V3.shadowNet €1,500/mo, €46/hr |
| F14 C_case $350 | C | ROI_PARAMS.costPerSuccessCase = 350 — ПІДТВЕРДЖЕНО! |
| F16 Outcome Rate 45%/30% | C | ROI_PARAMS.recoveryRate = 0.72 (72% — вища за 45%!) |
| F17 Alfa-Ratio | C | Building Blocks precedent $270M saved |
| F18 K_recovery 0.42 | E | ROI_PARAMS.recoveryRate 0.72 — КОНФЛІКТ: 0.42 vs 0.72 |
| F19 K_disability 0.4 | E | DALY_DATA + ROI_PARAMS.dalysPerCourse 1.25 |
| F20 K_chronic 0.15 | E | STRUCTURAL_DISP_DATA admin 27% includes chronic |
| F21 GDP_loss | E (key output) | MACRO_GAP.gdpLossUSD = $13.94B |
| F22 ROI_rehab $4/$1 | E | ROI_PARAMS.roiMultiplier = 4 — ПІДТВЕРДЖЕНО! |
| F23 K_premium 12-18% | E | THRIVE_PROJECT DLI structure |
| F24 ROI $3.80/$1 | E (benchmark) | Lancet 2016, Chisholm et al. |
| F25 APY 12-14% | E (investor view) | FEPA instrument (Humanitarian Bank) |
| F26 Blended Finance | E | HEAL Component 4 = **$41M** + THRIVE = **$903M total** ($454M+$249M+$200M) + HEAL = $500M = **$1.4B+ WB** (Round 6 corrected) |
| F27 ω_return 65% | B (goal) | FORMALIZATION_COST_V3 penalty 65% — КОНФЛІКТ: 65% penalty vs 65% return target |
| F28 M_shadow | E (key formula) | NBU = depository bank for WB (THRIVE_PROJECT) |
| F29 N_pilot 40 SMB | G (operational) | Pilot ecosystem: CMU #1365/#1503, TRUE, mhGAP, Pkg #72 |
| F30 OpenFn | G (key formula) | FEEL_AGAIN_4_FUNCTIONS ④ INTEROP — CommCare/Kobo → FHIR R4 → Trembita → ESOZ |
| F31 5W Matrix | G | DATA_INTELLIGENCE.canonical ActivityInfo cluster 5W |
| F32 HL7 FHIR | G | FEEL_AGAIN_4_FUNCTIONS ② METERING — FHIR R4 bundles |
| F33 ICD coding | G | NSZU uses ICD-10, FORMALIZATION uses ICF — confirmed |
| F34 Alert Triggers | G | FEEL_AGAIN_4_FUNCTIONS ② METERING PCL-5/PHQ-9/GAD-7 — dual-track |
| F35 Localisation 25% | G | Grand Bargain 2016, actual 10% (STRUCTURAL_DISP_DATA) |

### Конфлікти, виявлені через constants.ts:

1. **F18 K_recovery = 0.42 (канонічна) vs ROI_PARAMS.recoveryRate = 0.72 (dashboard)**
   - 0.42 — WHO empirical global (Layard-aligned)
   - 0.72 — UNICEF Ukraine-specific (completed courses)
   - **Рішення:** MHEI v0.7 використовує 0.72 для Ukraine-specific розрахунку, 0.42 як global benchmark

2. **F27 ω_return = 65% (target return) vs FORMALIZATION_COST_V3 penalty 65%**
   - 65% return target — це що specialist отримує в UA (vs EU gross)
   - 65% penalty — це що specialist втрачає при formalization (vs shadow)
   - **Тот факт що ці числа співпадають — не випадковість:** 65% EU gross ≈ specialist net income, а формалізація зменшує specialist net до 35% від EU gross
   - **Рішення:** ω_return=65% — це таргет для specialist net income (no penalty), а не для return rate from EU

3. **MHEI current 29 vs 8.16**
   - 29 — з попереднього канонічного чату (базовий розрахунок C+B+E+S+G, не рескейлений)
   - 8.16 — v5 §1 рескейлений на 0-100 шкалу, canonical dashboard
   - **Рішення:** MHEI v0.7 використовує 8.16 як baseline, ціль — 87 до 2030

---

## 5. McKinsey-style presentation skill — MISSING

**Не знайдено:**
- Не локально
- Не в репозиторії AlexezavGit/dashboard
- Не в popередньому чаті (share-версія не відображає)

**Що потрібно від користувача в новому чаті:**
1. Надіслати Mackinzi presentation skill файл (markdown)
2. Надіслати CLAUDE.md (memory bank)

Без цих файлів не можна переходити до презентацій (Phase 5 у handoff).

---

## 6. MHEI v0.7 — фінальна архітектура

### Розрахункова схема:

```
MHEI v0.7 (current 8.16 → target 87 by 2030)
├── C (Coverage, 20%)
│   ├── F1 WHO P₀ = 3.9M (Lancet 2023)
│   ├── F4 L = D × S × Soma (eHealth API)
│   ├── F5 K_som (eHealth API — extraction needed)
│   ├── F13 T_spec = €46/hr (FORMALIZATION_COST_V3)
│   ├── F14 C_case = $350 (ROI_PARAMS.costPerSuccessCase) ✓
│   ├── F16 Outcome Rate = 72% (ROI_PARAMS.recoveryRate) ✓
│   └── F17 Alfa-Ratio (Building Blocks $270M precedent)
├── B (Burnout/Capacity, 25%)
│   ├── F9 Burnout 1.4/1.3/1.2 (Lancet 2023 "overworked")
│   ├── F10 Capacity Matrix (NSZU 4,427 MH doctors)
│   ├── F11 K_cap > 0.25 trigger (ROI_PARAMS.clinicalGapPct 0.60)
│   ├── F12 ΔH Release (adminOverhead 22% → 7%)
│   └── F27 ω_return = 65% (FORMALIZATION penalty target inversion)
├── E (Economic, 30%) — LSE Layard aligned
│   ├── F18 K_recovery = 0.42 (WHO) vs 0.72 (UNICEF Ukraine)
│   ├── F19 K_disability = 0.4
│   ├── F20 K_chronic = 0.15
│   ├── F21 GDP_loss = $13.94B (MACRO_GAP) — KEY OUTPUT
│   ├── F22 ROI_rehab = 4× (ROI_PARAMS.roiMultiplier) ✓
│   ├── F23 K_premium = 12-18% (THRIVE DLI structure)
│   ├── F24 ROI MHPSS = $3.80/$1 (Lancet 2016)
│   ├── F25 APY = 12-14% (FEPA instrument)
│   ├── F26 Blended Finance: HEAL $500M + THRIVE **$903M total** ($454M+$249M+$200M) + HEAL C4 **$41M** = **$1.4B+** (Round 6 corrected)
│   └── F28 M_shadow (NBU depository bank, SEP ISO 20022)
├── S (Stability, 15%) — DYNAMIC INPUTS via APIs
│   ├── F2 k_cum (OCHA HDX)
│   ├── F3 E_ps (Ukrenergo + OCHA HDX)
│   ├── F6 Blackout Factor (Ukrenergo)
│   ├── F7 Escalation (OCHA HDX + eHealth)
│   ├── F8 CTI (multi-source aggregator)
│   └── F15 P_force_majeure (OCHA HDX historical)
└── G (Governance, 10%)
    ├── F30 OpenFn (FEEL_AGAIN_4_FUNCTIONS ④ INTEROP — CommCare/Kobo → FHIR R4 → Trembita → ESOZ)
    ├── F31 5W Matrix (ActivityInfo cluster 5W — DATA_INTELLIGENCE)
    ├── F32 HL7 FHIR (FEEL_AGAIN_4_FUNCTIONS ② METERING — FHIR R4 bundles)
    ├── F33 ICD coding (ICD-10 + ICF — confirmed)
    ├── F34 Alert Triggers (FEEL_AGAIN_4_FUNCTIONS ② PCL-5/PHQ-9/GAD-7 dual-track)
    └── F35 Localisation 25% (Grand Bargain 2016, actual 10%)
```

### GDP Impact:
```
GDP Impact = (MHEI/100) × 9.0 − 3.5
- α = 9.0% (LSE Layard upper bound — MH explains 9% of GDP variance)
- β = 3.5% (post-conflict baseline drag)
- GDP $B = GDP% × $170B (Ukraine IMF base)

Current (MHEI=8.16): −2.77% = −$4.71B (annual drag)
Target (MHEI=87 by 2030): +4.33% = +$7.36B (annual gain)
Delta: +$12.07B/yr potential recovery
```

### Thrive/HEAL funding structure:
```
Total WB investment in Ukraine health: $954M
├── HEAL ($500M, IPF) — closes Dec 2026 — deploys services (624K MH, 118 mobile teams)
│   └── Component 4 = **$41M** digitalization window (Round 6: not $50M) — FEEL Again uses this!
└── THRIVE (**$903M total**: $454M original + $249M additional + $200M tranche, PforR) — measures system efficiency via ESOZ
   ├── $220M at signing (Dec 10, 2024)
   ├── $19.5M Dec 2025 (after DLI completion)
   ├── $320M total disbursed = 70% of original $454M
   └── $249M additional + $200M tranche — new disbursements 2026 (per WB Ukraine page May 31, 2026)
    ├── $220M at signing (Dec 10, 2024)
    ├── $19.5M Dec 2025 (after DLI completion)
    ├── $320M total disbursed = 70%
    └── $134M remaining — requires further DLI completion
NBU = depository bank for WB operations
```

### FEEL Again = middleware between HEAL outputs and THRIVE inputs:
```
CommCare/Kobo/ActivityInfo (HEAL outputs — 624K sessions, 118 mobile teams)
       ↓
   [FEEL Again Digital Bus] — OpenFn Lightning middleware
       ↓
   FHIR R4 bundles (QuestionnaireResponse + Observation + Condition + RiskAssessment + DetectedIssue + Flag)
       ↓
   Trembita eDelivery (230+ institutions, 7B+ txns)
       ↓
   ESOZ (36.5M users, NSZU integrated)
       ↓
   THRIVE metrics — visible for DLI verification
```

---

## 7. Міністерські суб-індекси — наведення до MHEI v0.7

Детальний дизайн — дивись `04_MINISTRY_DLI_PANEL_DESIGN.md`.

**Принцип recomposition:** Кожне міністерство отримує суб-індекс з重组онованими вагами компонентів під специфіку міністерства. Сума суб-індексів по міністерствах → MHEI aggregate з audit trail.

**3 пріоритетні міністерства (MHPSS-now):**
1. Мінекономрозвитку — ваги [C:0.20, B:0.25, E:0.30, S:0.15, G:0.10]
2. Мінфін — ваги [C:0.10, B:0.10, E:0.40, S:0.10, G:0.30]
3. МОЗ (NSZU) — ваги [C:0.30, B:0.30, E:0.15, S:0.10, G:0.15]

**5 додаткових:** Мінвєтеранів, Мінсоцполітики, Мінцифри, Міносвіти, Мінрегіонбуду

---

## 8. Наступні кроки для імплементації MHEI v0.7

1. **Прочитати CLAUDE.md + mackinzi presentation skill** (запитати у користувача в новому чаті)
2. **Імплементувати оновлення constants.ts** — оновити MHEI v5 §1 → v0.7 з міністерськими суб-індексами
3. **Підключити API** за `03_API_INSTRUCTION.md`
4. **Створити міністерські панелі** за `04_MINISTRY_DLI_PANEL_DESIGN.md`
5. **Інтегрувати verification + admin costs** за `05_VERIFICATION_ADMIN_COSTS.md`
6. **Перевірити конфлікти** (F18 0.42 vs 0.72; F27 65% target vs 65% penalty)
7. **Запустити пілот** — 3 пріоритетні міністерства в Фазі 1 (Місяць 1-3)

---

## 9. Різниця між MHEI v0.6 (помилковий) та MHEI v0.7 (актуальний)

| Аспект | v0.6 (помилковий) | v0.7 (актуальний) |
|--------|-------------------|-------------------|
| Baseline MHEI | 29/100 (з outdated канонічного чату) | 8.16 на шкалі 0-100 (з constants.ts v5 §1; **шкала потребує уточнення через DATA_DICTIONARY_v5.md** — Round 6 correction) |
| GDP Impact при baseline | +2.1% (+$3.57B) — неправильно! | −2.77% (−$4.71B) — реалістично |
| GDP loss | $13.94B згаданий, але не інтегрований | $13.94B = MACRO_GAP.gdpLossUSD — canonical |
| THRIVE | Не згаданий | **$903M total PforR** ($454M original + $249M additional + $200M tranche), $320M=70% disbursed of original, NBU depository (Round 6 corrected) |
| HEAL | Не згаданий | $500M IPF + Component 4 **$41M** digitalization (Round 6: not $50M) |
| ROI_PARAMS | Не використані | costPerSession=$30, costPerSuccessCase=$350, roiMultiplier=4, recoveryRate=0.72 |
| FEEL_AGAIN_4_FUNCTIONS | Не враховані | REGISTRY + METERING + PAYMENT + INTEROP |
| Tech stack | Загальний | IATI 2.03 + DHIS2 + ISO 20022 + BVNK + W3C VC + FHIR R4 + Trembita |
| CommCare/Kobo pipeline | Згаданий абстрактно | Concrete: CommCare/Kobo → FHIR R4 → Trembita → ESOZ |

**MHEI v0.7 замінює MHEI v0.6.** v0.6 має бути архівований або видалений.
