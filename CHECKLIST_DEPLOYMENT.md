# ✅ Checklist de Despliegue - EcoLéxico Frontend

## 📋 Pre-requisitos (ANTES de ejecutar)

### 1. Dependencias instaladas
```powershell
npm install
```

### 2. Firebase Storage configurado
- ✅ Credenciales en `src/firebase.ts` (ya están configuradas)
- ✅ Reglas de Storage permisivas para desarrollo
- ⚠️ Para producción: cambiar reglas a autenticación requerida

### 3. Backend ejecutándose
- El backend debe estar corriendo en `http://localhost:5000`
- Verificar endpoint: `http://localhost:5000/api/words`

### 4. Variables de entorno (OPCIONAL)
- Crear archivo `.env` con:
  ```
  VITE_API_URL=http://localhost:5000
  ```

---

## 🚀 Comandos para ejecutar

### Desarrollo
```powershell
npm run dev
```
- Abre: http://localhost:5173

### Producción (Build)
```powershell
npm run build
npm run preview
```

---

## ⚠️ Problemas comunes resueltos

### ✅ SOLUCIONADO: Error "Element type is invalid"
- **Problema:** Navbar de flowbite-react v0.12.10 no soporta componentes anidados
- **Solución aplicada:** Navbar personalizado con Tailwind CSS

### ✅ SOLUCIONADO: Formulario no se resetea
- **Problema:** Usaba `window.location.reload()` (recarga completa)
- **Solución aplicada:** Reset manual del estado sin recargar página

### ✅ SOLUCIONADO: URL del backend hardcodeada
- **Problema:** No configurable entre entornos
- **Solución aplicada:** Usa `import.meta.env.VITE_API_URL` con fallback

### ✅ SOLUCIONADO: Sin validación de archivos
- **Problema:** No validaba si el audio existía
- **Solución aplicada:** Validación required + feedback visual

---

## 🔍 Testing manual

### 1. Probar subida de palabra
- [ ] Rellenar formulario completo
- [ ] Subir archivo de audio (MP3)
- [ ] Verificar que aparece el nombre del archivo
- [ ] Click en "Guardar"
- [ ] Verificar mensaje de éxito
- [ ] Verificar que el formulario se limpió

### 2. Validaciones
- [ ] Intentar enviar sin audio → Debe mostrar alerta
- [ ] Intentar enviar sin palabra → Debe mostrar alerta
- [ ] Intentar enviar sin significado → Debe mostrar alerta

### 3. Navegación
- [ ] Links del menú funcionan (aunque sean #)
- [ ] Responsive: probar en móvil/tablet

---

## 📦 Estructura de archivos corregidos

```
src/
├── App.tsx ✅ (Navbar simplificado sin Flowbite)
├── components/
│   └── CreateWordForm.tsx ✅ (Validaciones mejoradas + reset)
├── services/
│   └── storageService.ts ✅ (Sin cambios, funciona)
├── firebase.ts ✅ (Configurado correctamente)
└── main.tsx ✅ (Sin cambios necesarios)
```

---

## 🎯 Próximos pasos recomendados

1. **Actualizar Flowbite React** (futuro)
   ```powershell
   npm install flowbite-react@latest
   ```

2. **Agregar loading states visuales**
   - Spinner mientras sube el audio
   - Progress bar opcional

3. **Mejorar manejo de errores**
   - Toast notifications en lugar de alerts
   - Mensajes de error específicos

4. **Optimizar Firebase**
   - Límites de tamaño de archivo
   - Validación de tipos de archivo (solo audio)

---

## 🐛 Si algo no funciona

### El frontend no inicia
```powershell
# Limpiar caché y reinstalar
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
npm run dev
```

### Error de CORS
- Verificar que el backend tenga CORS habilitado
- Verificar la URL del backend en la consola del navegador

### Audio no se sube
- Verificar reglas de Firebase Storage
- Verificar en la consola de Firebase que el bucket existe
- Revisar la consola del navegador para errores de Firebase

---

✅ **Estado actual: LISTO PARA EJECUTAR**
