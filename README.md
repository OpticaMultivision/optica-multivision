# Óptica Multivision - versión visual sin base de datos

Sitio simplificado en Next.js, sin MongoDB, sin login, sin panel administrador y sin pagos online.

## Funcionalidades activas

- Home visual con foto horizontal profesional de la óptica.
- Catálogo visual por módulos:
  - Marcos ópticos
  - Lentes de sol
  - Cristales ópticos
  - Lentes para niños
- Cada módulo abre una ventana con 10 artículos referenciales.
- Cada artículo se puede agregar al carrito.
- El carrito se envía a WhatsApp sin mostrar precios.
- Formulario de contacto conectado a WhatsApp.
- Instagram.
- Google Maps.

## WhatsApp

El número configurado es:

`+56 9 3227 1822`

En el código está como:

`const WHATSAPP_NUMBER = '56932271822';`

Archivo principal:

`pages/index.tsx`

## Ejecutar localmente

```bash
npm install --legacy-peer-deps
npm run dev
```

Luego abrir:

`http://localhost:3000`
