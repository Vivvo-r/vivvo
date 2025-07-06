# 🚀 Vivvo - Setup Simple para Cursor

## 📋 PROJECT BASICS

**Project:** Vivvo MVP  
**Goal:** Web platform for apartment reviews in Panama  
**Stack:** Next.js + TypeScript + Tailwind + Supabase  
**Timeline:** 3 weeks  

---

## 🛠️ STEP 1: Create Project

```bash
npx create-next-app@latest vivvo-mvp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd vivvo-mvp
```

## 📦 STEP 2: Install Dependencies

```bash
# Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Forms
npm install react-hook-form @hookform/resolvers zod

# UI & Icons
npm install lucide-react clsx

# Maps (later)
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

## ⚙️ STEP 3: Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_APP_NAME=Vivvo
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## 🎨 STEP 4: Basic Folder Structure

Create these folders in `src/`:
```
src/
├── app/
├── components/
│   ├── ui/
│   └── layout/
├── lib/
└── types/
```

## 🔧 STEP 5: Basic Files to Create

### 1. Constants file (`src/lib/constants.ts`):
```typescript
export const VIVVO = {
  name: 'Vivvo',
  tagline: 'Vive mejor, decide mejor',
  description: 'Reviews de apartamentos en Panamá'
} as const

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  building: (slug: string) => `/edificio/${slug}`,
} as const
```

### 2. Supabase client (`src/lib/supabase.ts`):
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

### 3. Basic types (`src/types/index.ts`):
```typescript
export interface Building {
  id: string
  name: string
  slug: string
  address: string
  neighborhood: string
}

export interface Review {
  id: string
  building_id: string
  user_id: string
  rating: number
  comment: string
}
```

## 🗄️ STEP 6: Supabase Setup

### Create these tables in Supabase SQL Editor:

#### Buildings table:
```sql
create table buildings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  address text not null,
  neighborhood text not null,
  created_at timestamp with time zone default now()
);

alter table buildings enable row level security;
create policy "Buildings viewable by everyone" on buildings for select using (true);
```

#### Reviews table:
```sql
create table reviews (
  id uuid default gen_random_uuid() primary key,
  building_id uuid references buildings(id) not null,
  user_id uuid references auth.users(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text not null,
  created_at timestamp with time zone default now()
);

alter table reviews enable row level security;
create policy "Reviews viewable by everyone" on reviews for select using (true);
create policy "Users can insert reviews" on reviews for insert with check (auth.uid() = user_id);
```

## 🎯 STEP 7: First Pages to Build

### Priority 1 (Build first):
1. Homepage (`src/app/page.tsx`) - Basic landing
2. Building list - Show buildings from database
3. Auth pages (`src/app/login/page.tsx`, `src/app/signup/page.tsx`)

### Priority 2 (Build after):
1. Individual building page (`src/app/edificio/[slug]/page.tsx`)
2. Review form
3. User profile

## 📱 STEP 8: Deploy

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial Vivvo setup"

# Deploy to Vercel
# Connect GitHub repo
# Add environment variables
```

---

## ✅ WHAT TO BUILD FIRST

### Week 1 - Core:
- [ ] Project setup ✅
- [ ] Basic homepage
- [ ] Auth system
- [ ] Buildings list

### Week 2 - Features:
- [ ] Building detail pages
- [ ] Review form
- [ ] Review display

### Week 3 - Polish:
- [ ] Mobile optimization
- [ ] User testing
- [ ] Bug fixes

---

## 🚨 KEEP IT SIMPLE

**DON'T add until needed:**
- Complex UI components
- Advanced features
- Multiple pages at once
- Fancy animations

**DO focus on:**
- One feature at a time
- Getting basic functionality working
- Testing each piece before moving on

**Start with homepage and auth - that's it!**