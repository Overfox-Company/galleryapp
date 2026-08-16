import { mkdir, open, rename, stat } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { getStagingPath } from "@/features/references/utils/upload-paths";
import { safeFilename } from "@/features/references/utils/storage-names";

export const runtime = "nodejs";

const headersSchema = z.object({
  sessionId: z.string().uuid(),
  kind: z.enum(["logo", "web", "mobile"]),
  filename: z.string().min(1),
  index: z.coerce.number().int().min(0),
  offset: z.coerce.number().int().min(0),
  isLast: z.enum(["true", "false"]),
});

export async function POST(request: Request) {
  const parsed = headersSchema.safeParse({
    sessionId: request.headers.get("x-upload-session"),
    kind: request.headers.get("x-upload-kind"),
    filename: decodeURIComponent(request.headers.get("x-file-name") ?? ""),
    index: request.headers.get("x-file-index"),
    offset: request.headers.get("x-byte-offset"),
    isLast: request.headers.get("x-is-last"),
  });
  if (!parsed.success || !request.body) return Response.json({ error: "Carga inválida" }, { status: 400 });

  const { sessionId, kind, filename, index, offset, isLast } = parsed.data;
  const orderedName = `${String(index).padStart(6, "0")}-${safeFilename(filename)}`;
  const finalPath = getStagingPath(sessionId, kind, orderedName);
  const partPath = `${finalPath}.part`;
  const directory = path.dirname(partPath);
  const exists = await stat(getStagingPath(sessionId)).then(() => true).catch(() => false);
  if (!exists) return Response.json({ error: "Sesión no encontrada" }, { status: 404 });
  await mkdir(directory, { recursive: true });

  const bytes = Buffer.from(await request.arrayBuffer());
  const handle = await open(partPath, offset === 0 ? "w+" : "r+");
  await handle.write(bytes, 0, bytes.length, offset).finally(() => handle.close());
  if (isLast === "true") await rename(partPath, finalPath);
  return Response.json({ ok: true });
}
