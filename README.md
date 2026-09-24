# BudgetBasics

An interactive educational platform that teaches students and young adults the fundamentals of personal budgeting.

## Overview

BudgetBasics is a data-driven educational web application built with React, TypeScript, and Vite. It features interactive lessons, financial calculators, savings goal tracking, expense planning, quizzes, a rule-based chatbot, and full Arabic/English bilingual support with RTL layout.

The application is designed so that all educational content can be added or replaced by editing JSON data files — no React components, pages, or business logic need to change.

## Requirements

- Node.js 18+
- npm 10+

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The dev server starts automatically. Open the printed URL in your browser.

## Build

```bash
npm run build
```

Output is in the `dist/` directory.

## Test

```bash
npm run test
```

Tests use Vitest and cover pure utility functions: financial calculations, text normalization, and import validation.

## Typecheck

```bash
npm run typecheck
```

## Deployment

### Vercel

The project includes `vercel.json` with SPA rewrite rules. Connect the repository to Vercel and deploy.

### Netlify / Other static hosts

`public/_redirects` contains `/* /index.html 200` for SPA routing support.

## Architecture Overview

```
src/
├── app/              # App providers and router
├── components/       # Reusable UI components (Button, Card, Modal, etc.)
│   ├── ui/           # Generic UI primitives
│   ├── layout/       # Sidebar, Layout, navigation config
│   └── common/       # ErrorBoundary, OnboardingTour
├── data/             # JSON content files (lessons, quizzes, tips, etc.)
├── features/         # Feature-specific logic (search)
├── hooks/            # Custom React hooks (useExpenses, useSavingsGoals, etc.)
├── i18n/             # Internationalization (ar.ts, en.ts, I18nProvider)
├── pages/            # Route page components
├── services/         # Data loaders and localStorage abstraction
├── styles/           # Theme tokens and global CSS
├── types/            # TypeScript type definitions
├── utils/            # Pure functions (finance, text, validation)
├── assets/           # Images, icons, illustrations (team-provided)
├── config.ts         # App configuration
└── main.tsx          # Entry point
```

### Key Design Decisions

- **Data-driven content**: All educational content lives in `src/data/*.json`. Components render any valid data without hardcoding content.
- **Storage abstraction**: Only `src/services/storage.ts` accesses `localStorage`. All other code uses hooks or the storage service functions.
- **Pure financial functions**: All calculations are in `src/utils/finance.ts` — no React or browser dependencies.
- **i18n via Context**: Custom lightweight internationalization without external libraries. Arabic and English dictionaries with TypeScript-enforced key matching.

## Content Editing Guide

All content files are in `src/data/`. Edit these JSON files to add or modify content. No code changes required.

### How to Add a Lesson

Edit `src/data/budgeting.json`:

```json
[
  {
    "id": "lesson-what-is-budget",
    "title": { "ar": "ما هو الميزانية", "en": "What is a Budget" },
    "summary": { "ar": "ملخص قصير", "en": "A short summary" },
    "content": [
      { "ar": "فقرة اولى", "en": "First paragraph" },
      { "ar": "فقرة ثانية", "en": "Second paragraph" }
    ],
    "table": {
      "headers": [
        { "ar": "العمود ١", "en": "Column 1" }
      ],
      "rows": [
        [{ "ar": "قيمة", "en": "Value" }]
      ]
    },
    "example": { "ar": "مثال", "en": "Example" }
  }
]
```

Type: `Lesson` in `src/types/index.ts`.

### How to Add a Quiz

Edit `src/data/quizzes.json`:

```json
[
  {
    "id": "quiz-basics",
    "title": { "ar": "أساسيات الميزانية", "en": "Budgeting Basics" },
    "questions": [
      {
        "id": "q1",
        "question": { "ar": "السؤال", "en": "Question" },
        "options": [
          { "ar": "خيار ١", "en": "Option 1" },
          { "ar": "خيار ٢", "en": "Option 2" }
        ],
        "correctIndex": 0,
        "explanation": { "ar": "الشرح", "en": "Explanation" }
      }
    ]
  }
]
```

Type: `Quiz` in `src/types/index.ts`.

### How to Add a Tip

Edit `src/data/tips.json`:

```json
[
  {
    "id": "tip-save-monthly",
    "title": { "ar": "ادخر شهرياً", "en": "Save Monthly" },
    "content": { "ar": "المحتوى", "en": "Content" },
    "category": { "ar": "ادخار", "en": "Saving" }
  }
]
```

Type: `Tip` in `src/types/index.ts`.

### How to Add a Chatbot Rule

Edit `src/data/chatbot.json`:

```json
[
  {
    "id": "rule-budget",
    "keywordsAr": ["ميزانية", "ادخار"],
    "keywordsEn": ["budget", "save"],
    "answer": { "ar": "الإجابة", "en": "The answer" },
    "relatedQuestions": [
      { "ar": "سؤال ذو صلة", "en": "Related question" }
    ]
  }
]
```

Type: `ChatbotRule` in `src/types/index.ts`.

### How to Add a Needs/Wants Item

Edit `src/data/needs-wants.json`:

```json
[
  {
    "id": "item-rent",
    "name": { "ar": "الإيجار", "en": "Rent" },
    "category": "need",
    "explanation": { "ar": "الشرح", "en": "Explanation" }
  }
]
```

Type: `NeedsWantItem` in `src/types/index.ts`. `category` must be `"need"` or `"want"`.

### How to Add a Money Mistake

Edit `src/data/money-mistakes.json`:

```json
[
  {
    "id": "mistake-1",
    "scenario": { "ar": "الموقف", "en": "Scenario" },
    "consequence": { "ar": "النتيجة", "en": "Consequence" },
    "solution": { "ar": "الحل", "en": "Solution" }
  }
]
```

Type: `MoneyMistake` in `src/types/index.ts`.

### How to Add a Gallery Item

Edit `src/data/gallery.json`:

```json
[
  {
    "id": "gallery-1",
    "title": { "ar": "العنوان", "en": "Title" },
    "description": { "ar": "الوصف", "en": "Description" },
    "topic": { "ar": "الموضوع", "en": "Topic" },
    "type": "infographic",
    "assetPath": "/assets/illustrations/example.svg"
  }
]
```

Type: `GalleryItem` in `src/types/index.ts`. `type` is `"image"`, `"illustration"`, or `"infographic"`. `assetPath` is optional — when missing, a neutral placeholder is shown.

### How to Add a Badge

Badges are defined in `src/services/dataLoaders.ts` in the `badgeDefinitions` array:

```typescript
{ id: 'my-badge', name: { ar: 'اسم', en: 'Name' }, description: { ar: 'وصف', en: 'Desc' }, icon: 'Award' }
```

Type: `Badge` in `src/types/index.ts`.

### How to Add an Image

1. Place the file in `src/assets/images/`, `src/assets/icons/`, or `src/assets/illustrations/`.
2. Reference it from a gallery item's `assetPath` field.
3. Do not use external image URLs — all assets must be local.

## Theme Editing Guide

All colors are defined as CSS custom properties in `src/styles/theme.css` and mapped to Tailwind tokens. To change the palette, edit the CSS variables for `:root` (light) and `.dark` (dark mode).

## Adding a New Page

1. Create the page component in `src/pages/`.
2. Add the route in `src/app/router/AppRouter.tsx`.
3. Add navigation entry in `src/components/layout/navConfig.ts`.
4. Add translation keys in both `src/i18n/en.ts` and `src/i18n/ar.ts`.

## Adding a New Content Type

1. Define the TypeScript type in `src/types/index.ts`.
2. Create a JSON data file in `src/data/`.
3. Add a data loader in `src/services/dataLoaders.ts`.
4. Create rendering components that accept the type as props.
5. Add empty-state i18n keys for when the data file has no items.

## Tech Stack

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS 3.4
- React Router v6
- Recharts
- lucide-react
- Vitest
- Custom i18n (no external library)
