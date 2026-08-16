export function UploadStatus({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-secondary p-4" role="status">
      <div className="h-1.5 overflow-hidden rounded-full bg-card"><div className="upload-pulse h-full w-1/2 rounded-full bg-primary" /></div>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
