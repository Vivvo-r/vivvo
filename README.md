# 🏢 Vivvo - Reseñas Reales de Apartamentos en Panamá

**Vivvo** es una plataforma web para reseñas de apartamentos en Panamá. Encuentra y revisa los mejores edificios de la ciudad basándote en experiencias reales de inquilinos.

## 🚀 Características Implementadas

### ✅ Funcionalidades Core
- **Autenticación de Usuarios** - Registro y login con Supabase Auth + Google OAuth
- **Búsqueda Avanzada** - Búsqueda en tiempo real con autocomplete y sugerencias
- **Directorio de Edificios** - Lista completa con filtros por ubicación
- **Sistema de Reseñas Detalladas** - 12 categorías de calificación específicas
- **Páginas Individuales de Edificios** - Galería de fotos, información completa, estadísticas reales
- **Sugerencias de Edificios** - Workflow completo para agregar nuevos edificios
- **Zonas Más Buscadas** - Sección dinámica basada en datos reales con filtros clickeables

### ✅ Panel de Administración
- **Dashboard Completo** - Estadísticas en tiempo real y actividad reciente
- **Gestión de Edificios** - CRUD con sistema de fotos, desarrollador, amenidades
- **Gestión de Reseñas** - Filtros por rating, moderación y análisis
- **Gestión de Sugerencias** - Conversión automática a edificios oficiales
- **Sistema de Fotos** - Upload de URLs, galería y foto principal
- **Autenticación Segura** - Login admin (admin/vivvo2024) con recuperación de contraseña

### ✅ Experiencia de Usuario
- **Diseño Moderno** - Pixel art background, animaciones suaves, gradientes
- **Totalmente Responsive** - Optimizado para móvil con botones touch-friendly
- **Filtros Inteligentes** - Por barrio, búsqueda, rating, fecha
- **Carga Dinámica** - Sin datos dummy, todo viene de la base de datos
- **SEO Optimizado** - Meta tags, structured data, URLs amigables
- **Datos Reales** - Estadísticas, ratings y conteos calculados en tiempo real

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

**IMPORTANTE**: Ejecuta el archivo `database-setup.sql` en tu panel de Supabase (SQL Editor) para configurar todas las tablas automáticamente.

### Características de la Base de Datos:
- **4 tablas principales** con relaciones optimizadas
- **Políticas RLS** para seguridad
- **Índices optimizados** para búsquedas rápidas
- **Triggers automáticos** para actualizar timestamps
- **Validaciones de datos** a nivel de base de datos

### Esquema Completo:

#### 🏢 Tabla `buildings` (Edificios):
- **Campos principales**: nombre, slug, dirección, barrio, corregimiento
- **Información adicional**: desarrollador, año construcción, pisos, apartamentos
- **Sistema de fotos**: foto principal + galería de fotos
- **12 amenidades**: parking, piscina, gym, seguridad 24/7, ascensor, balcón, área de juegos, área social, conserjería

#### ⭐ Tabla `reviews` (Reseñas):
- **Calificación general**: 1-5 estrellas (`overall_rating`)
- **12 categorías detalladas**: condición, seguridad, ruido, transporte, etc.
- **Información del inquilino**: tipo apartamento, rango alquiler, duración
- **Comentarios**: pros, contras, recomendación, título

#### 🏛️ Tabla `corregimientos` (Ubicaciones):
- **47 corregimientos** de Ciudad de Panamá
- **Organización por distritos** para filtros geográficos
- **Estado activo/inactivo** para control de visibilidad

#### 💡 Tabla `building_suggestions` (Sugerencias):
- **Workflow completo**: pendiente → revisando → aprobado/rechazado
- **Conversión automática**: sugerencia aprobada → edificio oficial
- **Información del solicitante**: nombre, email, información adicional

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
- [x] ~~**Sistema de Fotos** - Subida y gestión de imágenes de edificios~~ ✅ **COMPLETADO**
- [x] ~~**Filtros Avanzados** - Por precio, amenidades, rating, etc.~~ ✅ **COMPLETADO** 
- [ ] **Integración con Google Maps** - Ubicación visual de edificios en mapa
- [ ] **Sistema de Favoritos** - Guardar edificios favoritos para usuarios registrados
- [ ] **Comparación de Edificios** - Comparar hasta 3 edificios lado a lado
- [ ] **Notificaciones Push** - Alertas para nuevas reseñas y edificios
- [ ] **API Pública** - Endpoints REST para desarrolladores externos
- [ ] **Sistema de Reportes** - Reportar reseñas inapropiadas o datos incorrectos
- [ ] **Integración con WhatsApp** - Compartir edificios directamente

### Mejoras Técnicas
- [x] ~~**Migración a App Router** - Actualizar estructura de Next.js~~ ✅ **COMPLETADO**
- [ ] **Optimización de Rendimiento** - Implementar caching con Redis
- [ ] **Testing Automatizado** - Tests unitarios, de integración y E2E
- [ ] **Monitoreo Avanzado** - Analytics, error tracking, performance monitoring
- [ ] **CDN para Imágenes** - Optimización automática de fotos de edificios
- [ ] **PWA** - Convertir en Progressive Web App
- [ ] **Internacionalización** - Soporte para inglés y otros idiomas

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


## 📝 Filosofía de Diseño

**"Minimalista, mas no simplista"** - Buscamos interfaces limpias y elegantes que no sacrifiquen funcionalidad. Cada elemento tiene un propósito claro y la experiencia del usuario es nuestra prioridad.

---

**Hecho con ❤️ para los buscadores de apartamentos de Panamá**

*"Busca. Reseña. Ayuda."* - Nuestro motto refleja el ciclo completo de la plataforma: buscar información, compartir experiencias, y ayudar a otros en su búsqueda.

## 📧 Contacto

- **Email**: info.vivvo@gmail.com

---

*Vivvo - Reseñas reales de apartamentos en Panamá*
