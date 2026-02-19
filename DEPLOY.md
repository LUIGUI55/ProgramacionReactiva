# Guía de Despliegue en Netlify

¡Tu proyecto está listo! Sigue estos pasos para desplegarlo en producción.

## 1. Subir el Código a GitHub

He inicializado el repositorio localmente. Si la subida automática falló (por credenciales), ejecuta estos comandos en tu terminal dentro de la carpeta `Sensores`:

1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta:

```bash
git push -u origin main
```

> **Nota:** Si te pide credenciales, ingresa tu usuario y contraseña (o Token de Acceso Personal) de GitHub.

## 2. Desplegar en Netlify

El proyecto ya está configurado con `netlify.toml` para que el despliegue sea automático.

1. Inicia sesión en [Netlify](https://app.netlify.com/).
2. Haz clic en **"Add new site"** > **"Import an existing project"**.
3. Selecciona **GitHub**.
4. Busca y selecciona tu repositorio: `ProgramacionReactiva`.
5. **Configuración de Construcción (Build Settings):**
    * Netlify detectará automáticamente la configuración del archivo `netlify.toml`.
    * **NO cambies nada** manual, debería verse algo así:
        * **Build command:** `cd client && npm install && npm run build`
        * **Publish directory:** `client/dist`
        * **Functions directory:** `server`
6. Haz clic en **"Deploy site"**.

## 3. Verificar

Una vez desplegado:

* Netlify te dará una URL (ej. `https://tu-sitio.netlify.app`).
* Abre esa URL.
* Prueba agregar y eliminar sensores. ¡Todo debería funcionar!

## Detalles Técnicos

* **Backend:** Funciona como _Netlify Serverless Functions_ gracias a la librería `serverless-http` y la configuración en `server/index.js`.
* **Frontend:** React (Vite) se compila y se sirve como sitio estático, comunicándose con el backend a través de redirecciones configuradas en `netlify.toml` (`/api/*` -> `/.netlify/functions/index/api/*`).
