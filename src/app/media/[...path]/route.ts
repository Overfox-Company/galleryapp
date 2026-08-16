import { readFile } from "node:fs/promises";
import { getReferencePath } from "@/features/references/utils/upload-paths";
import { mimeFromName } from "@/features/references/utils/file-helpers";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segments = (await params).path;
  if (segments.some((segment: string) => segment.includes("..") || segment.includes("/"))) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const body = await readFile(getReferencePath(segments[0], ...segments.slice(1)));
    const mimeType = mimeFromName(segments.at(-1) ?? "image.png");
    return new Response(body, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
