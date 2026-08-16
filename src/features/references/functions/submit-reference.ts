import { createUploadSessionAction } from "../actions/create-upload-session-action";
import { finalizeReferenceAction } from "../actions/finalize-reference-action";
import { uploadSourceFiles } from "../utils/upload-source-files";

export type ReferenceDraft = {
  name: string;
  categoryId: string;
  hasWeb: boolean;
  hasMobile: boolean;
  logo: File[];
  web: File[];
  mobile: File[];
};

export async function submitReference(draft: ReferenceDraft, onProgress: (message: string) => void) {
  const session = await createUploadSessionAction();
  if (!session.ok) throw new Error(session.error);
  const sessionId = session.data.sessionId;

  onProgress("Subiendo logo");
  await uploadSourceFiles(draft.logo, sessionId, "logo", onProgress);
  if (draft.hasWeb) await uploadSourceFiles(draft.web, sessionId, "web", onProgress);
  if (draft.hasMobile) await uploadSourceFiles(draft.mobile, sessionId, "mobile", onProgress);

  onProgress("Guardando referencia");
  const result = await finalizeReferenceAction({
    sessionId,
    name: draft.name,
    categoryId: draft.categoryId,
    hasWeb: draft.hasWeb,
    hasMobile: draft.hasMobile,
  });
  if (!result.ok) throw new Error(result.error);
  return result.data.slug;
}
