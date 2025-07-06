# 📧 Configurar Templates Personalizados de Email para Vivvo

## Prerrequisitos
- Proyecto Supabase configurado
- Acceso al dashboard de Supabase
- Dominio personalizado (opcional, pero recomendado)

## Paso 1: Configurar Email Templates en Supabase

### 1.1 Acceder a la configuración de Auth
1. Ve a tu [Supabase Dashboard](https://app.supabase.com/)
2. Selecciona tu proyecto Vivvo
3. Ve a **Authentication > Email Templates**

### 1.2 Configurar dominio personalizado (Recomendado)
1. En **Authentication > Settings**
2. En **SMTP settings**, configura tu propio servidor SMTP:
   - **Host**: smtp.gmail.com (o tu proveedor)
   - **Port**: 587
   - **Username**: tu-email@gmail.com
   - **Password**: tu-app-password
   - **Sender email**: noreply@vivvo.com (o tu dominio)
   - **Sender name**: Vivvo

## Paso 2: Templates Personalizados

### 2.1 Template de Confirmación de Registro

En **Authentication > Email Templates > Confirm signup**:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirma tu cuenta - Vivvo</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1d4ed8; margin-bottom: 20px; font-size: 24px; }
        .content p { margin-bottom: 20px; font-size: 16px; line-height: 1.8; }
        .button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; transition: transform 0.2s; }
        .button:hover { transform: translateY(-2px); }
        .footer { background-color: #f8fafc; padding: 20px 30px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; color: #64748b; }
        .footer p { margin: 5px 0; }
        .social { margin-top: 15px; }
        .social a { color: #1d4ed8; text-decoration: none; margin: 0 10px; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Vivvo</h1>
            <p>Vive mejor, decide mejor</p>
        </div>
        
        <div class="content">
            <h2>¡Bienvenido a Vivvo!</h2>
            
            <p>¡Hola! 👋</p>
            
            <p>Estamos emocionados de tenerte en nuestra comunidad. Vivvo es la plataforma líder para reviews de apartamentos en Panamá, donde puedes encontrar y compartir experiencias reales sobre los mejores lugares para vivir.</p>
            
            <p>Para comenzar a explorar reviews y compartir tus propias experiencias, necesitamos confirmar tu dirección de correo electrónico:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirmar mi cuenta</a>
            </div>
            
            <p>Una vez que confirmes tu cuenta, podrás:</p>
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li>📖 Leer reviews detalladas de apartamentos</li>
                <li>✍️ Escribir tus propias reviews</li>
                <li>🏠 Descubrir los mejores edificios en Panamá</li>
                <li>💬 Conectar con otros inquilinos</li>
            </ul>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #64748b;">
                Si no creaste una cuenta con nosotros, puedes ignorar este email de forma segura.
            </p>
            
            <p style="font-size: 14px; color: #64748b;">
                Este enlace expira en 24 horas por razones de seguridad.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Vivvo</strong> - La plataforma de reviews de apartamentos en Panamá</p>
            <p>© 2024 Vivvo. Hecho con ❤️ para los buscadores de apartamentos.</p>
            <div class="social">
                <a href="https://tu-sitio.com">Sitio Web</a> |
                <a href="mailto:soporte@vivvo.com">Soporte</a>
            </div>
        </div>
    </div>
</body>
</html>
```

### 2.2 Template de Recuperación de Contraseña

En **Authentication > Email Templates > Reset password**:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer contraseña - Vivvo</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1d4ed8; margin-bottom: 20px; font-size: 24px; }
        .content p { margin-bottom: 20px; font-size: 16px; line-height: 1.8; }
        .button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; transition: transform 0.2s; }
        .button:hover { transform: translateY(-2px); }
        .footer { background-color: #f8fafc; padding: 20px 30px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; color: #64748b; }
        .footer p { margin: 5px 0; }
        .social { margin-top: 15px; }
        .social a { color: #1d4ed8; text-decoration: none; margin: 0 10px; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 30px 0; }
        .alert { background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .alert h3 { margin: 0 0 10px 0; font-size: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Vivvo</h1>
            <p>Vive mejor, decide mejor</p>
        </div>
        
        <div class="content">
            <h2>🔒 Restablecer tu contraseña</h2>
            
            <p>¡Hola!</p>
            
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Vivvo. Si fuiste tú quien la solicitó, puedes crear una nueva contraseña haciendo clic en el botón de abajo:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">Restablecer mi contraseña</a>
            </div>
            
            <div class="alert">
                <h3>⚠️ Importante:</h3>
                <p>Este enlace expira en 1 hora por razones de seguridad. Si no cambias tu contraseña dentro de este tiempo, necesitarás solicitar un nuevo enlace.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #64748b;">
                <strong>¿No solicitaste este cambio?</strong><br>
                Si no solicitaste restablecer tu contraseña, puedes ignorar este email de forma segura. Tu contraseña actual no ha cambiado y tu cuenta sigue siendo segura.
            </p>
            
            <p style="font-size: 14px; color: #64748b;">
                Para tu seguridad, te recomendamos usar una contraseña fuerte que incluya números, letras y símbolos especiales.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Vivvo</strong> - La plataforma de reviews de apartamentos en Panamá</p>
            <p>© 2024 Vivvo. Hecho con ❤️ para los buscadores de apartamentos.</p>
            <div class="social">
                <a href="https://tu-sitio.com">Sitio Web</a> |
                <a href="mailto:soporte@vivvo.com">Soporte</a>
            </div>
        </div>
    </div>
</body>
</html>
```

### 2.3 Template de Cambio de Email

En **Authentication > Email Templates > Change email address**:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmar cambio de email - Vivvo</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1d4ed8; margin-bottom: 20px; font-size: 24px; }
        .content p { margin-bottom: 20px; font-size: 16px; line-height: 1.8; }
        .button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; transition: transform 0.2s; }
        .button:hover { transform: translateY(-2px); }
        .footer { background-color: #f8fafc; padding: 20px 30px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; color: #64748b; }
        .footer p { margin: 5px 0; }
        .social { margin-top: 15px; }
        .social a { color: #1d4ed8; text-decoration: none; margin: 0 10px; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 30px 0; }
        .info-box { background-color: #eff6ff; border: 1px solid #2563eb; color: #1e40af; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Vivvo</h1>
            <p>Vive mejor, decide mejor</p>
        </div>
        
        <div class="content">
            <h2>📧 Confirmar cambio de email</h2>
            
            <p>¡Hola!</p>
            
            <p>Recibimos una solicitud para cambiar la dirección de email de tu cuenta en Vivvo. Para completar este cambio, necesitamos confirmar tu nueva dirección de correo electrónico:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirmar nuevo email</a>
            </div>
            
            <div class="info-box">
                <p><strong>📋 Qué sucede después:</strong></p>
                <ul style="margin-left: 20px; line-height: 1.6;">
                    <li>Tu email actual seguirá funcionando hasta que confirmes el nuevo</li>
                    <li>Una vez confirmado, usarás el nuevo email para iniciar sesión</li>
                    <li>Todas las notificaciones se enviarán al nuevo email</li>
                </ul>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #64748b;">
                <strong>¿No solicitaste este cambio?</strong><br>
                Si no solicitaste cambiar tu email, puedes ignorar este mensaje de forma segura. Tu dirección de email actual no cambiará.
            </p>
            
            <p style="font-size: 14px; color: #64748b;">
                Este enlace expira en 24 horas por razones de seguridad.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Vivvo</strong> - La plataforma de reviews de apartamentos en Panamá</p>
            <p>© 2024 Vivvo. Hecho con ❤️ para los buscadores de apartamentos.</p>
            <div class="social">
                <a href="https://tu-sitio.com">Sitio Web</a> |
                <a href="mailto:soporte@vivvo.com">Soporte</a>
            </div>
        </div>
    </div>
</body>
</html>
```

## Paso 3: Configuración Adicional

### 3.1 Personalizar el remitente
En **Authentication > Settings > SMTP Settings**:
- **Sender name**: Vivvo
- **Sender email**: noreply@vivvo.com (o tu dominio)
- **Reply-to email**: soporte@vivvo.com

### 3.2 Configurar Rate Limiting
En **Authentication > Settings > Rate Limiting**:
- **Maximum emails per hour**: 30 (ajustar según necesidades)
- **Maximum signups per hour**: 50

### 3.3 Personalizar mensajes de error
En **Authentication > Settings > Auth Messages**:
- Personalizar mensajes de error en español
- Mantener consistencia con el tono de Vivvo

## Paso 4: Testing

### 4.1 Probar cada template
1. **Registro**: Crear nueva cuenta y verificar email
2. **Reset password**: Usar "Olvidé mi contraseña"
3. **Change email**: Cambiar email desde el perfil (cuando esté implementado)

### 4.2 Verificar en diferentes clientes
- Gmail
- Outlook
- Yahoo Mail
- Apple Mail (móvil)

### 4.3 Revisar spam
- Verificar que los emails no lleguen a spam
- Configurar SPF, DKIM, DMARC si tienes dominio propio

## Paso 5: Mejoras Opcionales

### 5.1 Dominio personalizado
- Configurar dominio propio: mail.vivvo.com
- Configurar DNS records (MX, SPF, DKIM)

### 5.2 Integración con SendGrid/Mailgun
- Para mayor deliverability
- Métricas avanzadas de email

### 5.3 Templates adicionales
- Email de bienvenida post-confirmación
- Newsletter semanal
- Notificaciones de nuevas reviews

## ✅ Checklist final

Una vez configurado:
- [ ] Templates están guardados en Supabase
- [ ] Sender configurado correctamente
- [ ] Emails de prueba enviados y recibidos
- [ ] Templates se ven bien en diferentes clientes
- [ ] Branding de Vivvo es consistente
- [ ] Todos los enlaces funcionan correctamente
- [ ] Emails no van a spam

## 📱 Responsive Design

Los templates están diseñados para verse bien en:
- Desktop (Outlook, Thunderbird)
- Mobile (Gmail app, Apple Mail)
- Webmail (Gmail web, Outlook web)

## 🎨 Personalización

Puedes personalizar:
- **Colores**: Cambiar el azul por los colores de tu marca
- **Logo**: Añadir el logo de Vivvo
- **Contenido**: Ajustar el texto según tu tono de voz
- **Idioma**: Adaptar completamente al español panameño

¡Con esto, tus emails tendrán un aspecto profesional y consistente con la marca Vivvo! 🎉 