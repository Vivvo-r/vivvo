# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs with Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Production server**: `npm start`
- **Linting**: `npm run lint`
- **Install dependencies**: `npm install`

## Project Architecture

**Vivvo** is a Next.js 15 application for apartment reviews in Panama, built with TypeScript, Tailwind CSS, and Supabase.

### Core Structure
- **Next.js 15 App Router**: Uses the new app directory structure
- **Authentication**: Dual system - Supabase Auth for users + simple admin credentials (admin/vivvo2024)
- **Database**: Supabase PostgreSQL with 4 main tables: `buildings`, `reviews`, `corregimientos`, `building_suggestions`
- **State Management**: React Context API (`AuthContext`, `AdminContext`)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS 4.0

### Key Features
- **12-category detailed review system**: Each review includes ratings for building condition, security, noise, transport, etc.
- **Admin panel**: Complete CRUD for buildings, reviews, and suggestions at `/admin`
- **Search & filtering**: By name, corregimiento (47 districts in Panama City)
- **Building suggestions**: Users can suggest new buildings for approval

### Database Schema Highlights
- **Buildings**: Include amenities (pool, gym, parking, etc.) and location data
- **Reviews**: Comprehensive rating system with 12 detailed categories plus general feedback
- **Supabase Auth integration**: Uses `auth.users` table for user management
- **Admin credentials**: Hardcoded as admin/vivvo2024 (stored in AdminContext.tsx:14-18)

### Context Providers
- **AuthContext**: Handles Supabase authentication, Google OAuth, password reset
- **AdminContext**: Simple localStorage-based admin authentication system

### Environment Setup
Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Page Structure
- Public: `/`, `/buildings`, `/edificio/[slug]`, `/about`, auth pages
- Protected: `/edificio/[slug]/review` (requires login)
- Admin: `/admin/*` (requires admin login)

### TypeScript Types
Core interfaces defined in `src/types/index.ts`: `Building`, `Review`, `User`, `Corregimiento`, `BuildingSuggestion`

## Recent UI/UX Improvements (2025)

### Modern Design System
- **Hero Section**: Animated gradients with floating elements and progressive text animations
- **Enhanced Building Cards**: 3D hover effects, rating badges, favorite buttons, and amenity tags
- **Interactive Elements**: Micro-animations, gradient buttons with hover states, and glass morphism effects
- **Mobile Optimization**: Touch-friendly buttons, proper iOS input handling, and responsive breakpoints

### Visual Enhancements
- **Color Palette**: Blue-to-purple gradients for modern appeal
- **Typography**: Progressive reveal animations and improved hierarchy
- **Card Design**: Rounded corners, shadows, and hover transformations
- **Loading States**: Shimmer effects and skeleton screens

### Mobile-First Features
- iOS-safe input font sizes (16px minimum to prevent zoom)
- Touch-friendly button sizes (44px minimum)
- Responsive grids that adapt to screen sizes
- Optimized spacing and padding for mobile

### CSS Architecture
- Custom animations for fade-ins and floating effects
- Line-clamp utilities for text truncation
- Mobile-specific media queries
- Focus states for accessibility