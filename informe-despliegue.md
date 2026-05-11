# Informe breve de despliegue y dependencias (Portal Asistente para Guías Docentes)

Fecha: 2026-05-11

## 1) Resumen de la aplicacion
- Tipo: SPA estatica (React + Vite + TypeScript + Tailwind CSS).
- Backend: no hay servidor propio ni API externa configurada en el codigo.
- Datos: se cargan desde ficheros locales en `src/data/`.
- Salida de build: carpeta `dist/` (estatica).

## 2) Dependencias principales (runtime)
- React 18, React DOM
- React Router DOM (ruteo SPA)
- Tailwind CSS (estilos)
- FontAwesome (iconos)
- react-quill (editor)
- pdfmake, docx, file-saver, html-to-pdfmake (exportacion de documentos)
- react-select

## 3) Dependencias de desarrollo
- Vite + plugin React SWC
- TypeScript
- ESLint + Prettier
- PostCSS + Autoprefixer

## 4) Build y despliegue
- Build: `npm run build`
- Output: `dist/`
- Requisitos: hosting de estaticos con soporte de SPA (fallback a `index.html`).

## 5) Autenticacion
- La aplicacion actualmente es accesible sin login.
- Si la infraestructura requiere login (LDAP/SSO), se podría:
  - Proteger el acceso en el proxy inverso / SSO corporativo, o
  - Incorporar un proveedor de autenticacion.

## 6) Flujos externos (n8n)
En la parte final del asistente de elaboracion de la guia docente hay integraciones con n8n mediante webhooks:

- **Valoracion pedagogica con IA**
  - Webhook POST: `asistente-guia-unav`
  - Usa un agente LLM para generar feedback pedagogico sobre la guia.
  - Proveedor LLM que se utiliza en las pruebas: Groq (modelo Llama 4 Scout 17B).

- **Envio y confirmacion de guia docente**
  - Webhook POST: `confirma-guia-docente`
  - Subida del PDF a Google Drive en carpeta segun curso.
  - Registro en Google Sheets de la entrega.
  - Envio de la guia al profesor por Gmail (adjuntos PDF + Word).

Estas integraciones requieren credenciales de n8n para los servicios implicados.

## 7) Observaciones adicionales
- No hay variables de entorno definidas en `package.json`.
- El ruteo depende de React Router, por lo que el servidor debe servir `index.html` para rutas internas.
