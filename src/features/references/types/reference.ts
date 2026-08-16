export type ReferencePlatform = "WEB" | "MOBILE";

export type ScreenshotRecord = {
  id: string;
  platform: ReferencePlatform;
  path: string;
  filename: string;
  position: number;
};

export type ReferenceSummary = {
  id: string;
  name: string;
  slug: string;
  logoPath: string;
  previewPath: string | null;
  hasWeb: boolean;
  hasMobile: boolean;
  category: { id: string; name: string; icon: string };
};

export type ReferenceDetail = ReferenceSummary & {
  screenshots: ScreenshotRecord[];
  createdAt: string;
};

export type UploadKind = "logo" | "web" | "mobile";
export type UploadAsset = { blob: Blob; filename: string };
