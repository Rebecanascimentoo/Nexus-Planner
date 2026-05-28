# Habits Page Redesign — Table Layout with Monthly Targets

## Date
2026-05-25

## Motivation
The existing habits page was financial-focused and used a vertical 31-column grid that was hard to read. The redesign uses a **table layout** with weeks as columns, making it compact, scannable, and month-agnostic.

## Layout

```
Header:  🔥 12 dias consecutivos   Score geral: 78%   ANO: [< 2026 >] MÊS: [< Maio >]   [+Novo]

Tabs:  [ Todos ]  [ Saúde ]  [ Estudos ]  [ Trabalho ]  [ Pessoal ]  [ + custom ]

Table:
────────────────────────────────────────────────────────────────────────────────────────
 Hábito            S1       S2       S3       S4      +dias   Meta  Streak  Score
────────────────────────────────────────────────────────────────────────────────────────
 🏃 Correr       □□□□□□□  □□□□□□□  □□□□□□□  □□□□□□□  □□□    15     🔥7    80%  ✏️🗑️
────────────────────────────────────────────────────────────────────────────────────────  ← cat separator
 🥗 Comer        □□□□□□□  □□□□□□□  □□□□□□□  □□□□□□□  □□□    20     🔥3    45%  ✏️🗑️
────────────────────────────────────────────────────────────────────────────────────────

WeekCircles:  ○ 80%  ○ 45%  ○ 92%  ○ 60%
```

## Data Model

```js
Habit {
  id: string,
  name: string,
  emoji: string,
  category: 'saude' | 'estudos' | 'trabalho' | 'pessoal' | 'social' | 'criatividade' | 'custom',
  customCategory?: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  monthlyTarget: number,     // NEW — user-configurable goal
  logs: string[],            // ['2026-05-01', ...]
  notes: { [dateKey]: string }
}
```

## Score Calculation

- **Per-habit score:** `min(100, (checkins_in_month / monthlyTarget) * 100)`
- **Overall score:** average of all per-habit scores
- **Default monthlyTarget** (auto-suggested):
  - Daily: days in current month
  - Weekly: 4
  - Monthly: 1
- User can override monthlyTarget when creating/editing a habit

## Categories (predefined)
- `saude` — Saúde
- `estudos` — Estudos
- `trabalho` — Trabalho
- `pessoal` — Pessoal
- `social` — Social
- `criatividade` — Criatividade
- `custom` — Outra (campo texto livre)

## Components

| Component | Action |
|-----------|--------|
| `HabitsPage.jsx` | Full rewrite: header (nav + streak + score), tabs, table, WeekCircles |
| `HabitTable.jsx` | **New** — table with S1–S4 columns, extras, inline DayCell per cell |
| `HabitForm.jsx` | Update: categories (predefined + custom), monthlyTarget, fix frequency values |
| `DayCell.jsx` | Keep as-is (small square button) |
| `WeekCircles.jsx` | Keep as-is (weekly progress circles) |
| `habitsStore.js` | Add `monthlyTarget` to schema, `calcHabitScore()`, `calcOverallScore()`, remove financial-specific code |
| `HabitItem.jsx` | **Remove** (dead code — not used anywhere) |
| `HabitGrid.jsx` | **Remove** (replaced by HabitTable) |
| `HabitRow.jsx` | **Remove** (replaced by inline rendering in HabitTable) |
| `ScoreRing.jsx` | Keep file but remove usage from HabitsPage (score is now text in header) |
| `TimelineChart.jsx` | Keep file but remove usage from HabitsPage (not in new design) |
| `StatsBar.jsx` | Keep file but remove usage from HabitsPage (not in new design) |
| `NotesPanel.jsx` | Keep file but remove usage from HabitsPage (not in new design) |

## Migration
Existing habits in localStorage (`nexus-habits`) with financial categories:
- `'controle'` → `'pessoal'`
- `'planejamento'` → `'estudos'`
- `'longo_prazo'` → `'trabalho'`
- New field `monthlyTarget` defaults to frequency-based auto-calculation on first render

## Key Behaviors
- Click on a DayCell toggles check-in for that date
- Tabs filter by category; "Todos" shows all with category separators
- Month/Year navigation updates the grid and scores
- Each habit row has edit (✏️) and delete (🗑️) on hover
- Empty state: illustration + "Crie seu primeiro hábito" CTA
