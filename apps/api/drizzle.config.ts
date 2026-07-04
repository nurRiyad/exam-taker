import { defineConfig } from "drizzle-kit";

// Used by `db:generate` (schema.ts -> next numbered SQL migration) only, for
// now. `dbCredentials`/`driver` are added when `drizzle-kit push`/`studio`
// are actually needed against a real D1 instance (ADR-0059).
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
});
