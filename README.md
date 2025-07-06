# 🏢 Vivvo - Apartment Reviews Platform

**Vivvo** is a web platform for apartment reviews in Panama. Find and review the best apartments in the city.

## 🚀 Features

- **User Authentication** - Sign up and login with Supabase
- **Building Directory** - Browse available buildings
- **Review System** - (Coming soon) Rate and review apartments
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Forms**: React Hook Form + Zod
- **Authentication**: Supabase Auth

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

Create the following tables in your Supabase database:

### Buildings table:
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

### Reviews table:
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

## 🌟 Current Pages

- **Homepage** (`/`) - Landing page with navigation
- **Buildings** (`/buildings`) - List of available buildings
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📱 Deployment

The app is ready to deploy to Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 🎯 Next Steps

- [ ] Individual building pages
- [ ] Review submission form
- [ ] User profiles
- [ ] Building image uploads
- [ ] Search functionality
- [ ] Maps integration

---

**Made with ❤️ for Panama's apartment hunters**
