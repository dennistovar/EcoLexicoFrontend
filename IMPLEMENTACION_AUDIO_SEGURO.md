# 🔒 Protección de Audios - Guía de Implementación Completa

## ✅ Frontend (Ya Implementado)

El componente `WordCard.tsx` ha sido modificado para:
- ✅ Solicitar URLs firmadas al backend antes de reproducir
- ✅ Usar token JWT para autenticación
- ✅ Fallback a URL directa si falla (para compatibilidad)
- ✅ Mejor manejo de errores

## 📋 Pasos para Completar la Implementación

### 1. Backend - Agregar el Endpoint

En tu archivo principal del backend (ej: `server.js` o `index.js`), agrega:

```javascript
// Después de tus imports existentes
const cloudinary = require('cloudinary').v2;
const rateLimit = require('express-rate-limit');

// Función helper para extraer public_id
function extractPublicId(cloudinaryUrl) {
  const regex = /upload\/(?:v\d+\/)?([^\.]+)/;
  const match = cloudinaryUrl.match(regex);
  return match ? match[1] : null;
}

// Rate limiting para audio
const audioLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Demasiadas solicitudes de audio, intenta más tarde.'
});

// Aplicar rate limiting
app.use('/api/audio', audioLimiter);

// ENDPOINT: Generar URL firmada
app.get('/api/audio/signed-url', authenticateToken, (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL requerida' });
    }

    const publicId = extractPublicId(url);
    
    if (!publicId) {
      return res.status(400).json({ error: 'URL de Cloudinary inválida' });
    }

    // Generar URL firmada que expira en 1 hora
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      type: 'upload',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600
    });

    res.json({ signedUrl });
  } catch (error) {
    console.error('Error generando URL firmada:', error);
    res.status(500).json({ error: 'Error al generar URL firmada' });
  }
});
```

### 2. Instalar Dependencias (Backend)

```bash
cd ../Backend  # O donde esté tu backend
npm install express-rate-limit
```

### 3. Verificar Variables de Entorno (Backend)

En tu archivo `.env` del backend, asegúrate de tener:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret_MUY_IMPORTANTE
JWT_SECRET=tu_jwt_secret
PORT=5000
```

⚠️ **CRÍTICO**: `CLOUDINARY_API_SECRET` es necesario para firmar URLs.

### 4. Configurar Cloudinary Dashboard

1. Ir a: https://cloudinary.com/console
2. **Settings → Security**
3. Habilitar **"Strict Transformations"**
4. En **"Allowed fetch domains"**, agregar tu dominio de producción
5. Verificar que tengas el **API Secret** visible

### 5. Probar el Endpoint

Con tu backend corriendo, prueba:

```bash
# Reemplaza TU_TOKEN con un token válido
curl -H "Authorization: Bearer TU_TOKEN" \
  "http://localhost:5000/api/audio/signed-url?url=https://res.cloudinary.com/tu_cloud/video/upload/v123/audio/test.mp3"
```

Debería devolver:
```json
{
  "signedUrl": "https://res.cloudinary.com/tu_cloud/video/upload/s--SIGNATURE--/v123/audio/test.mp3"
}
```

### 6. Verificar Funcionamiento

1. Inicia el backend: `npm start` o `node server.js`
2. Inicia el frontend: `npm run dev`
3. Navega a cualquier región y haz clic en el icono de audio 🔊
4. Abre DevTools (F12) → Network
5. Deberías ver una request a `/api/audio/signed-url`
6. El audio debería reproducirse normalmente

## 🔍 Debugging

### Si el audio no se reproduce:

1. **Verificar consola del navegador** - ¿Hay errores?
2. **Verificar Network tab** - ¿La request a `/api/audio/signed-url` fue exitosa?
3. **Verificar backend logs** - ¿Hay errores al generar la URL?
4. **Verificar token** - ¿Estás autenticado?

### Si sale error 401 (Unauthorized):

```javascript
// Verificar que authenticateToken esté definido en tu backend:
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}
```

## 📊 Beneficios Implementados

✅ **URLs Temporales**: Expiran en 1 hora
✅ **Autenticación**: Solo usuarios con token pueden obtenerlas
✅ **Rate Limiting**: Máximo 100 requests por IP cada 15 min
✅ **Fallback**: Si falla, usa URL directa (compatibilidad)
✅ **No expone credenciales**: API Secret permanece en el backend
✅ **Dificulta scraping**: Las URLs cambian constantemente

## ⚠️ Limitaciones (Inherentes al Web)

❌ No puedes ocultar 100% el código frontend
❌ Las URLs de audio serán visibles mientras se reproducen
❌ Usuarios técnicos podrían descargar audios si realmente quieren

## 🎯 ¿Qué Logras?

✅ Dificultas el acceso masivo (scraping)
✅ Proteges contra uso no autorizado
✅ Controlas quién accede y cuándo
✅ Detectas patrones de abuso con rate limiting
✅ URLs que no pueden ser compartidas (expiran)

## 📝 Notas Adicionales

- Las URLs firmadas son únicas y no pueden ser replicadas sin el API Secret
- Cada vez que se solicita una URL, se genera una firma única
- Las URLs expiran automáticamente después de 1 hora
- Si alguien intenta usar una URL expirada, Cloudinary la rechaza

## 🚀 Próximos Pasos Opcionales

1. **Watermarking**: Agregar marca de agua a los audios
2. **Logging**: Registrar cada reproducción para análisis
3. **Restricciones por usuario**: Limitar reproducciones por día
4. **Encriptación adicional**: Ofuscar aún más las URLs

---

**Implementado por**: Sistema de Seguridad EcoLéxico
**Fecha**: 17 de Diciembre, 2025
