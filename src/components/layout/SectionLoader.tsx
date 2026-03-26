export function SectionLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-primary/50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-[#915EFF]/40 border-t-[#915EFF] animate-spin" />
        <p className="text-sm text-secondary">Chargement…</p>
      </div>
    </div>
  );
}
