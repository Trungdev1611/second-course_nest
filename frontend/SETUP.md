# Quick Setup Guide

## 1. Install Dependencies

```bash
cd frontend
npm install
```

## 2. Environment File

File `.env.local` đã được tạo với:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 3. Run Development Server

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3001**

> **Lưu ý**: Frontend chạy trên port 3001 để tránh conflict với Backend (port 3000)

## 4. View Component Demo

Mở http://localhost:3001 để xem tất cả components được showcase.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Demo page (showcase all components)
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── common/             # Reusable components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       ├── Avatar.tsx
│   │       ├── Tag.tsx
│   │       ├── Loading.tsx
│   │       ├── Empty.tsx
│   │       ├── Alert.tsx
│   │       ├── Divider.tsx
│   │       ├── Select.tsx
│   │       ├── Checkbox.tsx
│   │       ├── Radio.tsx
│   │       └── index.ts        # Export all components
│   ├── lib/
│   │   ├── axios.ts            # Axios instance with interceptors
│   │   └── api.ts              # API functions
│   ├── store/
│   │   ├── authStore.ts        # Authentication state (Zustand)
│   │   └── uiStore.ts          # UI state (theme, modals, etc.)
│   └── providers/
│       ├── QueryProvider.tsx   # React Query provider
│       └── AntdProvider.tsx   # Ant Design provider
```

## Features Implemented

✅ Next.js 14 with App Router
✅ Ant Design 5 with custom theme
✅ React Query (TanStack Query) setup
✅ Axios with interceptors for auth
✅ Zustand state management
✅ Common components library (14 components)
✅ Demo page showcasing all components
✅ TypeScript configuration
✅ Tailwind CSS integration
✅ Vietnamese locale for Ant Design
✅ Port 3001 (không conflict với backend)

## Ports

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs

## Next Steps

1. Review components on demo page
2. Adjust colors, sizes, and styles as needed
3. Start building actual pages (auth, posts, profile, etc.)
