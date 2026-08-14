# Mi Donación

MVP de trazabilidad de ayuda humanitaria para Colombia.

## Funciones incluidas

- Registro e inicio de sesión para responsables y voluntarios.
- Registro de puntos de acopio en Colombia con ubicación GPS opcional.
- Registro de donaciones físicas con código público `DON-...`.
- Inventario general del punto de acopio.
- Registro de compras y carga privada de facturas/comprobantes.
- Creación de envíos con código público `ENV-...`.
- Vinculación de donaciones con envíos.
- Registro de salida hacia destino.
- Confirmación de entrega con fotografía + GPS + fecha/hora.
- Seguimiento público sin login mediante código de donación o envío.
- Protección de datos sensibles mediante PostgreSQL RLS.

## Backend conectado

Proyecto Supabase: `Mi Donación`

Región técnica: South America (São Paulo / `sa-east-1`).

País operativo principal: Colombia.

Las variables necesarias están documentadas en `.env.example`. Para despliegues reales configúralas como variables de entorno en el proveedor de hosting.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Publicar en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. En Vercel selecciona **Add New > Project** e importa el repositorio.
3. Framework: Next.js (detección automática).
4. Configura estas variables de entorno:

```text
NEXT_PUBLIC_SUPABASE_URL=<URL DEL PROYECTO SUPABASE>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<PUBLISHABLE KEY>
```

5. Ejecuta el deploy.
6. Vercel entregará una URL pública `*.vercel.app`.
7. Luego puedes conectar un dominio propio desde **Project Settings > Domains**.

## Seguridad

- Las tablas públicas tienen Row Level Security (RLS).
- Teléfonos, direcciones exactas, cuentas y coordenadas no se devuelven en la consulta pública.
- Las facturas usan un bucket privado.
- Las fotografías de entrega usan un bucket público porque forman parte de la evidencia visible del seguimiento.
- Solo perfiles `verifier` o `admin` pueden cambiar el estado de verificación de un punto de acopio.

## Flujo recomendado

1. Responsable crea su cuenta.
2. Registra su punto de acopio.
3. Cuando recibe una donación, registra los insumos y entrega al donante el código `DON-...`.
4. Al preparar un envío, vincula esa donación al envío.
5. Registra la salida.
6. En destino, carga fotografía y permite GPS para confirmar la entrega.
7. El donante consulta el mismo código y ve el avance y evidencias públicas.

## Próximas mejoras antes de uso masivo

- Verificación de identidad y organizaciones.
- Moderación y reportes de fraude.
- Rate limiting / anti-abuso para seguimiento público.
- Firma/hash de evidencias para auditoría avanzada.
- Multi-item por formulario de donación y envío.
- Mapas y rutas.
- Notificaciones por email/SMS/WhatsApp.
- Panel administrativo nacional.
