-- ============================================
-- VIVVO - ESQUEMAS DE BASE DE DATOS COMPLETOS
-- ============================================
-- Ejecuta estos comandos en tu panel de Supabase (SQL Editor)

-- 1. TABLA BUILDINGS (Estructura completa actualizada)
-- ============================================

create table if not exists buildings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  address text not null,
  corregimiento text not null,
  distrito text,
  description text,
  year_built integer,
  floors integer,
  apartments_count integer,
  developer text,
  main_photo text,
  photos text[],
  -- Amenidades básicas
  parking boolean default false,
  pool boolean default false,
  gym boolean default false,
  security_24_7 boolean default false,
  elevator boolean default false,
  balcony boolean default false,
  -- Amenidades adicionales (NUEVAS)
  playground boolean default false,
  social_area boolean default false,
  concierge boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Eliminar columna neighborhood si existe (conflicto con corregimiento)
alter table buildings drop column if exists neighborhood;

-- Agregar columnas faltantes si la tabla ya existe
alter table buildings add column if not exists developer text;
alter table buildings add column if not exists main_photo text;
alter table buildings add column if not exists photos text[];
alter table buildings add column if not exists playground boolean default false;
alter table buildings add column if not exists social_area boolean default false;
alter table buildings add column if not exists concierge boolean default false;
alter table buildings add column if not exists distrito text;
alter table buildings add column if not exists updated_at timestamp with time zone default now();

-- Índices para optimizar búsquedas
create index if not exists idx_buildings_name on buildings(name);
create index if not exists idx_buildings_slug on buildings(slug);
create index if not exists idx_buildings_corregimiento on buildings(corregimiento);
create index if not exists idx_buildings_distrito on buildings(distrito);

-- 2. TABLA REVIEWS (Estructura corregida)
-- ============================================

create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  building_id uuid references buildings(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  -- CAMBIO IMPORTANTE: overall_rating en lugar de rating
  overall_rating integer check (overall_rating >= 1 and overall_rating <= 5) not null,
  comment text not null,
  review_title text,
  apartment_type text check (apartment_type in ('studio', '1br', '2br', '3br', '4br', 'penthouse')),
  monthly_rent_range text check (monthly_rent_range in ('under_500', '500_1000', '1000_1500', '1500_2000', '2000_3000', 'over_3000')),
  living_duration_months integer,
  would_recommend boolean,
  pros text,
  cons text,
  -- 12 categorías de calificación detallada
  rating_building_condition integer check (rating_building_condition >= 1 and rating_building_condition <= 5),
  rating_security integer check (rating_security >= 1 and rating_security <= 5),
  rating_noise_level integer check (rating_noise_level >= 1 and rating_noise_level <= 5),
  rating_public_transport integer check (rating_public_transport >= 1 and rating_public_transport <= 5),
  rating_shopping_centers integer check (rating_shopping_centers >= 1 and rating_shopping_centers <= 5),
  rating_hospitals integer check (rating_hospitals >= 1 and rating_hospitals <= 5),
  rating_gym integer check (rating_gym >= 1 and rating_gym <= 5),
  rating_administration integer check (rating_administration >= 1 and rating_administration <= 5),
  rating_maintenance integer check (rating_maintenance >= 1 and rating_maintenance <= 5),
  rating_location integer check (rating_location >= 1 and rating_location <= 5),
  rating_apartment_quality integer check (rating_apartment_quality >= 1 and rating_apartment_quality <= 5),
  rating_amenities integer check (rating_amenities >= 1 and rating_amenities <= 5),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Renombrar columna si ya existe con el nombre anterior
do $$
begin
  if exists(select * from information_schema.columns where table_name='reviews' and column_name='rating') then
    alter table reviews rename column rating to overall_rating;
  end if;
end
$$;

-- Índices para optimizar consultas
create index if not exists idx_reviews_building_id on reviews(building_id);
create index if not exists idx_reviews_user_id on reviews(user_id);
create index if not exists idx_reviews_overall_rating on reviews(overall_rating);
create index if not exists idx_reviews_created_at on reviews(created_at);

-- 3. TABLA CORREGIMIENTOS (Estructura mejorada)
-- ============================================

create table if not exists corregimientos (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  distrito text not null,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Agregar columnas si faltan
alter table corregimientos add column if not exists distrito text;
alter table corregimientos add column if not exists active boolean default true;

-- Índices
create index if not exists idx_corregimientos_name on corregimientos(name);
create index if not exists idx_corregimientos_distrito on corregimientos(distrito);
create index if not exists idx_corregimientos_active on corregimientos(active);

-- 4. TABLA BUILDING_SUGGESTIONS (Estructura corregida)
-- ============================================

create table if not exists building_suggestions (
  id uuid default gen_random_uuid() primary key,
  building_name text not null,  -- CORREGIDO: era 'name'
  building_address text not null,  -- CORREGIDO: era 'address'  
  corregimiento text not null,
  submitter_name text,
  submitter_email text not null,
  developer text,
  year_built integer,
  additional_info text,
  status text default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Renombrar columnas si ya existen con nombres anteriores
do $$
begin
  if exists(select * from information_schema.columns where table_name='building_suggestions' and column_name='name') then
    alter table building_suggestions rename column name to building_name;
  end if;
  if exists(select * from information_schema.columns where table_name='building_suggestions' and column_name='address') then
    alter table building_suggestions rename column address to building_address;
  end if;
  if exists(select * from information_schema.columns where table_name='building_suggestions' and column_name='suggested_by_email') then
    alter table building_suggestions drop column suggested_by_email;
  end if;
end
$$;

-- Agregar columnas faltantes
alter table building_suggestions add column if not exists submitter_name text;
alter table building_suggestions add column if not exists submitter_email text;
alter table building_suggestions add column if not exists developer text;
alter table building_suggestions add column if not exists year_built integer;
alter table building_suggestions add column if not exists additional_info text;
alter table building_suggestions add column if not exists updated_at timestamp with time zone default now();

-- Índices
create index if not exists idx_building_suggestions_status on building_suggestions(status);
create index if not exists idx_building_suggestions_created_at on building_suggestions(created_at);
create index if not exists idx_building_suggestions_corregimiento on building_suggestions(corregimiento);

-- 5. TRIGGERS PARA UPDATED_AT
-- ============================================

-- Función para actualizar updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Triggers para todas las tablas
drop trigger if exists update_buildings_updated_at on buildings;
create trigger update_buildings_updated_at
  before update on buildings
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_reviews_updated_at on reviews;
create trigger update_reviews_updated_at
  before update on reviews
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_building_suggestions_updated_at on building_suggestions;
create trigger update_building_suggestions_updated_at
  before update on building_suggestions
  for each row execute procedure update_updated_at_column();

-- 6. POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
alter table buildings enable row level security;
alter table reviews enable row level security;
alter table building_suggestions enable row level security;
alter table corregimientos enable row level security;

-- Políticas para buildings (lectura pública, escritura para admins)
drop policy if exists "Buildings are viewable by everyone" on buildings;
create policy "Buildings are viewable by everyone"
  on buildings for select
  using (true);

-- Políticas para reviews (lectura pública, escritura para usuarios autenticados)
drop policy if exists "Reviews are viewable by everyone" on reviews;
create policy "Reviews are viewable by everyone"
  on reviews for select
  using (true);

drop policy if exists "Users can create reviews" on reviews;
create policy "Users can create reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own reviews" on reviews;
create policy "Users can update own reviews"
  on reviews for update
  using (auth.uid() = user_id);

-- Políticas para building_suggestions (lectura y escritura limitada)
drop policy if exists "Suggestions are viewable by everyone" on building_suggestions;
create policy "Suggestions are viewable by everyone"
  on building_suggestions for select
  using (true);

drop policy if exists "Anyone can create suggestions" on building_suggestions;
create policy "Anyone can create suggestions"
  on building_suggestions for insert
  with check (true);

-- Políticas para corregimientos (solo lectura pública)
drop policy if exists "Corregimientos are viewable by everyone" on corregimientos;
create policy "Corregimientos are viewable by everyone"
  on corregimientos for select
  using (true);

-- 7. DATOS INICIALES DE CORREGIMIENTOS
-- ============================================

-- Insertar corregimientos de Ciudad de Panamá si no existen
insert into corregimientos (name, distrito) values
  ('Ancón', 'Panamá'),
  ('Bella Vista', 'Panamá'),
  ('Betania', 'Panamá'),
  ('Calidonia', 'Panamá'),
  ('Chilibre', 'Panamá'),
  ('Cristóbal', 'Colón'),
  ('El Chorreras', 'Panamá Oeste'),
  ('Juan Díaz', 'Panamá'),
  ('Las Cumbres', 'Panamá'),
  ('Las Mañanitas', 'Panamá'),
  ('Pacora', 'Panamá'),
  ('Parque Lefevre', 'Panamá'),
  ('Pedregal', 'Panamá'),
  ('Pueblo Nuevo', 'Panamá'),
  ('Río Abajo', 'Panamá'),
  ('San Felipe', 'Panamá'),
  ('San Francisco', 'Panamá'),
  ('Santa Ana', 'Panamá'),
  ('Tocumen', 'Panamá'),
  ('Veracruz', 'Panamá')
on conflict (name) do nothing;

-- ============================================
-- COMANDOS ADICIONALES DE OPTIMIZACIÓN
-- ============================================

-- Actualizar estadísticas de las tablas
analyze buildings;
analyze reviews;
analyze building_suggestions;
analyze corregimientos;

-- Mensaje de confirmación
select 'Base de datos Vivvo configurada correctamente!' as status;