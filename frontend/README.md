# Blog Platform Frontend

Frontend application for Blog Platform built with Next.js 14, Ant Design, React Query, and Zustand.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Ant Design 5
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Language**: TypeScript

## Getting Started

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) to view the app.

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   └── common/          # Common/reusable components
│   ├── lib/                 # Utilities & configs
│   │   ├── axios.ts         # Axios instance & interceptors
│   │   └── api.ts           # API functions
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts     # Authentication state
│   │   └── uiStore.ts       # UI state (theme, modals, etc.)
│   ├── providers/           # Context providers
│   │   ├── QueryProvider.tsx
│   │   └── AntdProvider.tsx
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

## Features

### Components

All common components (Ant Design wrappers) are in `src/components/common/`:

- `AntdButton`
- `AntdInput`, `AntdTextArea`
- `AntdCard`
- `AntdModal`
- `AntdBadge`
- `AntdAvatar`
- `AntdTag`
- `AntdLoading`
- `AntdEmpty`
- `AntdAlert`
- `AntdDivider`
- `AntdSelect`
- `AntdCheckbox`
- `AntdRadio`, `AntdRadioGroup`
- `AntdEditor`
- `AntdForm`, `AntdFormItem`
- `AntdTable`
- `useAntdNotification`
- `AntdNotificationPopover`
- `AntdChat`

### State Management

- **Auth Store**: User authentication state, token management
- **UI Store**: Theme, sidebar, modal states

### API Integration

- Axios instance with interceptors for authentication
- Centralized API functions in `src/lib/api.ts`
- React Query for data fetching and caching

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Component Demo

Visit `/` to see all components in action with different variants, sizes, and states.

