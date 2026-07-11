type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-13rem)] w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
      <section className="flex flex-1 flex-col justify-center gap-3 rounded-lg border p-5">
        <p className="text-sm font-medium text-muted-foreground">Placeholder route</p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </section>
    </main>
  );
}