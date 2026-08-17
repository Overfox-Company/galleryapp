import { createUploadSessionAction } from "../actions/create-upload-session-action";
import { updateReferenceAction } from "../actions/update-reference-action";
import { uploadSourceFiles } from "../utils/upload-source-files";
import type { ReferenceDraft } from "./submit-reference";

export type ReferenceUpdateDraft = ReferenceDraft & {
  referenceId: string;
  deletedScreenshotIds: string[];
};

export async function submitReferenceUpdate(draft: ReferenceUpdateDraft, onProgress: (message: string) => void) {
  const session = await createUploadSessionAction();
  if (!session.ok) throw new Error(session.error);
  const sessionId = session.data.sessionId;

  if (draft.logo.length) {
    onProgress("Subiendo nuevo logo");
    await uploadSourceFiles(draft.logo, sessionId, "logo", onProgress);
  }
  if (draft.hasWeb && draft.web.length) await uploadSourceFiles(draft.web, sessionId, "web", onProgress);
  if (draft.hasMobile && draft.mobile.length) await uploadSourceFiles(draft.mobile, sessionId, "mobile", onProgress);

  onProgress("Actualizando referencia");
  const result = await updateReferenceAction({
    sessionId,
    referenceId: draft.referenceId,
    name: draft.name,
    categoryId: draft.categoryId,
    hasWeb: draft.hasWeb,
    hasMobile: draft.hasMobile,
    deletedScreenshotIds: draft.deletedScreenshotIds,
  });
  if (!result.ok) throw new Error(result.error);
  return result.data.slug;
}
