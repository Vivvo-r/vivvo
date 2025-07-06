# 🔑 Configurar Google OAuth en Supabase

## Prerrequisitos
- Cuenta de Google Cloud Platform
- Proyecto Supabase configurado
- Código de autenticación ya implementado ✅

## Paso 1: Configurar Google Cloud Console

### 1.1 Crear proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Asegúrate de que la facturación esté habilitada (necesaria para OAuth)

### 1.2 Habilitar Google+ API
1. Ve a **APIs & Services > Library**
2. Busca "Google+ API" y haz clic en él
3. Haz clic en **Enable**

### 1.3 Configurar OAuth consent screen
1. Ve a **APIs & Services > OAuth consent screen**
2. Selecciona **External** y haz clic en **Create**
3. Completa la información requerida:
   - **App name**: Vivvo
   - **User support email**: tu-email@gmail.com
   - **Developer contact information**: tu-email@gmail.com
   - **App logo**: (opcional) logo de Vivvo
   - **App domain**: tu-dominio.com (si tienes uno)
   - **Authorized domains**: 
     - `supabase.co` (para desarrollo)
     - `tu-dominio.com` (para producción)
4. Haz clic en **Save and Continue**

### 1.4 Crear credenciales OAuth
1. Ve a **APIs & Services > Credentials**
2. Haz clic en **Create Credentials > OAuth 2.0 Client IDs**
3. Selecciona **Web application**
4. Configura:
   - **Name**: Vivvo Web Client
   - **Authorized JavaScript origins**: 
     - `https://tu-proyecto.supabase.co`
     - `http://localhost:3000` (para desarrollo)
   - **Authorized redirect URIs**: 
     - `https://tu-proyecto.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (para desarrollo)
5. Haz clic en **Create**
6. **¡IMPORTANTE!** Guarda el **Client ID** y **Client Secret**

## Paso 2: Configurar Supabase Dashboard

### 2.1 Configurar Google OAuth en Supabase
1. Ve a tu [Supabase Dashboard](https://app.supabase.com/)
2. Selecciona tu proyecto Vivvo
3. Ve a **Authentication > Providers**
4. Busca **Google** en la lista
5. Haz clic en **Enable**
6. Configura:
   - **Client ID**: (del paso 1.4)
   - **Client Secret**: (del paso 1.4)
   - **Redirect URL**: `https://tu-proyecto.supabase.co/auth/v1/callback`
7. Haz clic en **Save**

### 2.2 Configurar URL de redirección
1. En **Authentication > Settings**
2. En **Site URL**, asegúrate de que esté configurado:
   - Desarrollo: `http://localhost:3000`
   - Producción: `https://tu-dominio.com`
3. En **Redirect URLs**, añade:
   - `http://localhost:3000/auth/callback`
   - `https://tu-dominio.com/auth/callback`

## Paso 3: Verificar configuración

### 3.1 Probar el flujo de autenticación
1. Ejecuta tu aplicación: `npm run dev`
2. Ve a la página de login: `http://localhost:3000/login`
3. Haz clic en **"Continuar con Google"**
4. Deberías ser redirigido a Google OAuth
5. Después de autenticarte, deberías regresar a tu aplicación

### 3.2 Verificar en Supabase
1. Ve a **Authentication > Users** en tu dashboard
2. Deberías ver el usuario creado con Google OAuth
3. El usuario tendrá `app_metadata` con información de Google

## Paso 4: Solución de problemas comunes

### Error: "redirect_uri_mismatch"
- **Causa**: La URL de redirección no coincide
- **Solución**: Verifica que las URLs en Google Cloud Console y Supabase coincidan exactamente

### Error: "invalid_client"
- **Causa**: Client ID o Client Secret incorrectos
- **Solución**: Revisa las credenciales en ambos lados

### Error: "access_denied"
- **Causa**: El usuario canceló la autenticación
- **Solución**: Normal, el usuario puede intentar de nuevo

### Error: "unauthorized_client"
- **Causa**: OAuth consent screen no está configurado
- **Solución**: Completa la configuración del consent screen

## Paso 5: Opcional - Configurar dominios para producción

### 5.1 Cuando despliegues a producción:
1. Añade tu dominio a **Authorized domains** en Google Cloud Console
2. Actualiza las **Authorized redirect URIs** con tu dominio de producción
3. Actualiza la **Site URL** y **Redirect URLs** en Supabase

## ✅ Verificación final

Una vez completada la configuración:
- [ ] Google OAuth funciona en desarrollo
- [ ] Los usuarios pueden registrarse con Google
- [ ] Los usuarios pueden iniciar sesión con Google
- [ ] Los usuarios aparecen en el dashboard de Supabase
- [ ] El flujo de redirección funciona correctamente

## 📝 Notas importantes

1. **Desarrollo vs Producción**: Usa diferentes credenciales para cada entorno
2. **Seguridad**: Nunca comitas el Client Secret en el código
3. **Dominios**: Asegúrate de que todos los dominios estén autorizados
4. **Testing**: Prueba con diferentes cuentas de Google

¡Con esto, Google OAuth debería estar completamente funcional en tu aplicación Vivvo! 🎉 