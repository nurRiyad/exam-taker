import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Shared shell for the signup/login/reset screens: centered, narrow-first
// (ADR-0002/0061 — author for ~360-390px width before wider breakpoints).
export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[calc(100dvh-13rem)] items-start justify-center bg-muted/30 p-4 sm:items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      </Card>
    </main>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}
