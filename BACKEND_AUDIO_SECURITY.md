# Implementación de Signed URLs para Audios

## 1. Backend - Agregar Endpoint para URLs Firmadas

En tu archivo principal del backend (server.js o index.js), agrega este código:

```javascript
// Agregar después de tus imports existentes
const cloudinary = require('cloudinary').v2;

// Ya tienes la configuración de Cloudinary, solo agrega esta función:

// Función helper para extraer public_id de URL de Cloudinary
function extractPublicId(cloudinaryUrl) {
  const regex = /upload\/(?:v\d+\/)?([^\.]+)/;
  const match = cloudinaryUrl.match(regex);
  return match ? match[1] : null;
}

// NUEVO ENDPOINT: Generar URL firmada (protegido con autenticación)
app.get('/api/audio/signed-url', authenticateToken, (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Extraer el public_id de la URL
    const publicId = extractPublicId(url);
    
    if (!publicId) {
      return res.status(400).json({ error: 'Invalid Cloudinary URL' });
    }

    // Generar URL firmada que expira en 1 hora
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      type: 'upload',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
    });

    res.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate signed URL' });
  }
});

// Rate limiting para el endpoint de audio (opcional pero recomendado)
const rateLimit = require('express-rate-limit');

const audioLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 solicitudes por IP
  message: 'Too many audio requests, please try again later.'
});

app.use('/api/audio', audioLimiter);
```

## 2. Instalar dependencia (si no la tienes)

```bash
npm install express-rate-limit
```

## 3. Configurar Cloudinary Dashboard

1. Ve a tu cuenta de Cloudinary: https://cloudinary.com/console
2. Settings → Security
3. Habilita "Strict Transformations"
4. Agrega tu dominio en "Allowed fetch domains"
5. En "URL Signature", asegúrate de tener tu API Secret configurado

## 4. Variables de Entorno

Asegúrate de tener en tu `.env` del backend:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
JWT_SECRET=tu_jwt_secret
```

⚠️ **IMPORTANTE**: El `CLOUDINARY_API_SECRET` es necesario para generar URLs firmadas.

## 5. Testing

Prueba el endpoint con:

```bash
curl -H "Authorization: Bearer TU_TOKEN" \
  "http://localhost:5000/api/audio/signed-url?url=https://res.cloudinary.com/tu_cloud/video/upload/v1234567890/audio/palabra.mp3"
```

## Beneficios de esta Implementación

✅ URLs que expiran automáticamente en 1 hora
✅ Requiere autenticación (token JWT)
✅ Rate limiting para prevenir abusos
✅ URLs firmadas que no pueden ser replicadas
✅ El API Secret nunca se expone al frontend

## Próximo Paso

Una vez implementado el backend, modificaremos el frontend (WordCard.tsx) para usar este endpoint.
