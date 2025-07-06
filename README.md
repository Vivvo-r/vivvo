# 🏢 Vivvo - Reseñas Reales de Apartamentos en Panamá

**Vivvo** es una plataforma web para reseñas de apartamentos en Panamá. Encuentra y revisa los mejores edificios de la ciudad basándote en experiencias reales de inquilinos.

## 🚀 Características Implementadas

### ✅ Funcionalidades Core
- **Autenticación de Usuarios** - Registro y login con Supabase Auth
- **Búsqueda Funcional** - Busca edificios por nombre, ubicación, corregimiento
- **Directorio de Edificios** - Lista completa de edificios con detalles
- **Sistema de Reseñas Detalladas** - 12 categorías de calificación específicas
- **Páginas Individuales de Edificios** - Información completa y reseñas expandibles
- **Sugerencias de Edificios** - Los usuarios pueden sugerir nuevos edificios

### ✅ Panel de Administración
- **Autenticación Admin** - Panel protegido por credenciales (admin/vivvo2024)
- **Gestión de Edificios** - CRUD completo con amenidades y corregimientos
- **Gestión de Reseñas** - Visualización y administración de todas las reseñas
- **Gestión de Sugerencias** - Aprobación/rechazo de edificios sugeridos
- **Dashboard con Estadísticas** - Contadores en tiempo real

### ✅ Experiencia de Usuario
- **Diseño Responsive** - Funciona en desktop y móvil
- **Header Fijo** - Navegación persistente en página de edificios
- **Filtros por Corregimiento** - 47 corregimientos de Ciudad de Panamá
- **SEO Optimizado** - Metadatos completos para indexación en Google
- **Página About Us** - Historia personal y misión de la plataforma

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod

## 📦 Instalación

1. Clona el repositorio
2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
   Edita `.env.local` con tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🗄️ Configuración de Base de Datos

La base de datos incluye las siguientes tablas principales:

### Tabla `buildings`:
```sql
create table buildings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  address text not null,
  neighborhood text not null,
  corregimiento text not null,
  description text,
  year_built integer,
  floors integer,
  apartments_count integer,
  parking boolean default false,
  pool boolean default false,
  gym boolean default false,
  security_24_7 boolean default false,
  elevator boolean default false,
  balcony boolean default false,
  created_at timestamp with time zone default now()
);
```

### Tabla `reviews` (con 12 categorías detalladas):
```sql
create table reviews (
  id uuid default gen_random_uuid() primary key,
  building_id uuid references buildings(id) not null,
  user_id uuid references auth.users(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text not null,
  review_title text,
  apartment_type text,
  monthly_rent_range text,
  living_duration_months integer,
  would_recommend boolean,
  pros text,
  cons text,
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
  created_at timestamp with time zone default now()
);
```

### Tabla `corregimientos`:
```sql
create table corregimientos (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default now()
);
```

### Tabla `building_suggestions`:
```sql
create table building_suggestions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  neighborhood text not null,
  corregimiento text not null,
  suggested_by_email text,
  status text default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamp with time zone default now()
);
```

## 🌟 Páginas Disponibles

### Frontend Público
- **Homepage** (`/`) - Página de inicio con búsqueda funcional
- **Buildings** (`/buildings`) - Lista de edificios con filtros y búsqueda
- **Building Detail** (`/edificio/[slug]`) - Información detallada y reseñas
- **Review Form** (`/edificio/[slug]/review`) - Formulario de reseña en 4 pasos
- **Login** (`/login`) - Autenticación de usuarios
- **Signup** (`/signup`) - Registro de usuarios
- **Suggest Building** (`/suggest-building`) - Sugerencia de nuevos edificios
- **About Us** (`/about`) - Historia y misión de la plataforma

### Panel de Administración
- **Admin Dashboard** (`/admin`) - Panel principal con estadísticas
- **Buildings Management** (`/admin/buildings`) - Gestión completa de edificios
- **Suggestions Management** (`/admin/suggestions`) - Gestión de sugerencias

## 🔧 Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Servidor de producción
npm start

# Ejecutar linter
npm run lint
```

## 📱 Despliegue

La aplicación está lista para desplegar en Vercel:

1. Sube tu código a GitHub
2. Conecta tu repositorio de GitHub a Vercel
3. Agrega las variables de entorno en el dashboard de Vercel
4. ¡Despliega!

## 🎯 Próximos Pasos

### Funcionalidades Planificadas
- [ ] **Sistema de Fotos** - Subida y gestión de imágenes de edificios
- [ ] **Integración con Maps** - Ubicación visual de edificios
- [ ] **Notificaciones** - Sistema de alertas para administradores
- [ ] **API Pública** - Endpoints para desarrolladores
- [ ] **Filtros Avanzados** - Por precio, amenidades, rating, etc.
- [ ] **Favoritos** - Sistema de edificios favoritos para usuarios
- [ ] **Comparación** - Comparar edificios lado a lado

### Mejoras Técnicas
- [ ] **Optimización de Rendimiento** - Implementar caching
- [ ] **Testing** - Tests unitarios y de integración
- [ ] **Monitoreo** - Analytics y error tracking
- [ ] **Migración a App Router** - Actualizar estructura de Next.js
- [ ] **Internacionalización** - Soporte para múltiples idiomas

### Expansión
- [ ] **Otras Ciudades** - Expandir a Colón, David, etc.
- [ ] **Móvil App** - Aplicación nativa
- [ ] **Programa de Referidos** - Sistema de incentivos
- [ ] **Integración con Inmobiliarias** - Partnerships estratégicos

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                 # Next.js 15 App Router
│   ├── admin/          # Panel de administración
│   ├── auth/           # Páginas de autenticación
│   ├── buildings/      # Lista de edificios
│   ├── edificio/       # Páginas individuales de edificios
│   └── about/          # Página About Us
├── components/         # Componentes reutilizables
│   ├── layout/        # Componentes de layout
│   └── ui/            # Componentes de UI
├── contexts/          # React Context providers
├── lib/               # Utilidades y configuraciones
└── types/             # Definiciones TypeScript
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Filosofía de Diseño

**"Minimalista, mas no simplista"** - Buscamos interfaces limpias y elegantes que no sacrifiquen funcionalidad. Cada elemento tiene un propósito claro y la experiencia del usuario es nuestra prioridad.

---

**Hecho con ❤️ para los buscadores de apartamentos de Panamá**

*"Busca. Reseña. Ayuda."* - Nuestro motto refleja el ciclo completo de la plataforma: buscar información, compartir experiencias, y ayudar a otros en su búsqueda.

## 📧 Contacto

- **Email**: info.vivvo@gmail.com
- **Website**: [vivvo.com](https://vivvo.com)

---

*Vivvo - Reseñas reales de apartamentos en Panamá*
