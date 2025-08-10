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

### Database Schema
#### Buildings Table
- `id` (uuid, primary key), `name` (text), `slug` (text, unique), `address` (text)
- `corregimiento` (text), `distrito` (text), `description` (text)
- `year_built` (integer), `floors` (integer), `apartments_count` (integer)
- `amenities` (text[]), `parking` (boolean), `pool` (boolean), `gym` (boolean)
- `security_24_7` (boolean), `elevator` (boolean), `balcony` (boolean)
- `elevator_count` (integer), `pool_count` (integer)
- `created_at`, `updated_at` (timestamps)

#### Reviews Table  
- `id` (uuid), `building_id` (uuid, FK), `user_id` (uuid, FK to auth.users)
- `overall_rating` (integer 1-5), `comment` (text), `review_title` (text)
- `apartment_type` (studio, 1br, 2br, 3br, 4br, penthouse)
- `monthly_rent_range` (under_500, 500_1000, 1000_1500, 1500_2000, 2000_3000, over_3000)
- `living_duration_months` (integer), `would_recommend` (boolean)
- `pros` (text), `cons` (text)
- **12 detailed ratings** (all integer 1-5): building_condition, security, noise_level, public_transport, shopping_centers, hospitals, gym, administration, maintenance, location, apartment_quality, amenities
- `created_at`, `updated_at` (timestamps)

#### Corregimientos Table
- `id` (uuid), `name` (text, unique), `distrito` (text), `active` (boolean), `created_at` (timestamp)

#### Building Suggestions Table  
- `id` (uuid), `building_name` (text), `building_address` (text), `corregimiento` (text)
- `submitter_name` (text), `submitter_email` (text), `developer` (text), `year_built` (integer)
- `additional_info` (text), `status` (pending/reviewing/approved/rejected), `admin_notes` (text)
- `created_at`, `updated_at` (timestamps)

#### Building Ratings View (Computed)
- Aggregated ratings per building with averages for all 12 categories plus total reviews count
- **Security**: Secured with `security_invoker = true` to use querying user's permissions

#### Security & Permissions
- **RLS enabled** on all tables with public read access
- **Reviews**: Users can only insert/update their own reviews  
- **Building suggestions**: Public insert, admin-only updates
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