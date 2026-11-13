export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to ENSP</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        {/* TODO: read the "home_hero" row from site_sections (src/server/queries/site.ts) */}
        This hero text and image will come from the dashboard.
      </p>
    </section>
  );
}
