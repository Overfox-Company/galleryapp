# Gallery

Biblioteca visual privada para guardar referencias de aplicaciones y sitios web. Permite crear categorías, cargar capturas sueltas o archivos ZIP/RAR y navegar las referencias como una tienda de logos.

## Requisitos

- Node.js 20 o superior
- pnpm 10 o superior
- Una clave de Hugeicons Pro en `NPM_HUGEICONS_TOKEN`

## Instalación

```bash
export NPM_HUGEICONS_TOKEN="tu-clave"
pnpm install
pnpm db:generate
pnpm db:setup
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). Primero crea una categoría en **Configuración** y luego usa **Nueva carga** para publicar una referencia.

## Variables de entorno

Copia `.env.example` como `.env` si necesitas cambiar la configuración:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_NAME="Gallery"
CLOUDFLARE_HOSTNAME="gallery.example.com"
```

`CLOUDFLARE_HOSTNAME` autoriza ese origen para las Server Actions cuando la aplicación se abre a través del túnel.

## Cómo funciona una carga

1. El navegador recibe las imágenes, ZIP o RAR desde el selector local.
2. Los archivos comprimidos se extraen localmente con WebAssembly; el archivo original nunca se envía al servidor.
3. Las imágenes se ordenan de forma natural por nombre (`02` antes de `10`).
4. Cada imagen se envía secuencialmente en fragmentos de 8 MB.
5. El servidor valida la firma de cada imagen, mueve la sesión a `storage/references/{slug}` y crea el registro en SQLite.

La estructura resultante es:

```text
storage/references/nombre-del-proyecto/
├── logo/000000-logo.png
├── web/000000-screen-01.png
└── mobile/000000-screen-01.png
```

Este diseño permite seleccionar imágenes mayores de 20 MB y archivos comprimidos mayores de 500 MB sin enviar una petición gigante por Cloudflare. La velocidad y memoria disponibles siguen dependiendo del equipo que abre el navegador.

## Túnel de Cloudflare

Con la app ejecutándose en local, apunta `cloudflared` a su puerto:

```bash
cloudflared tunnel --url http://localhost:3000
```

La aplicación no tiene login por decisión de producto. Si el hostname puede ser descubierto o compartido, protege el túnel con [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/).

## Comandos

```bash
pnpm dev          # desarrollo
pnpm build        # build de producción
pnpm start        # servidor de producción
pnpm lint         # reglas de código
pnpm typecheck    # tipos TypeScript
pnpm db:setup     # crea SQLite y aplica migraciones
pnpm db:migrate   # crea una migración durante desarrollo
```

El manual visual está en [docs/design-manual.md](docs/design-manual.md).
