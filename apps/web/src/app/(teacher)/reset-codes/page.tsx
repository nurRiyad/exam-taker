import { AuthCard } from "@/components/auth-card";
import { ResetCodeForm } from "@/components/reset-code-form";

// Route groups don't affect the URL (this resolves to /reset-codes either
// way), and a teacher and an admin visiting the same support flow would
// otherwise collide on that literal path — so this single page is shared by
// both roles (guarded by src/proxy.ts) rather than duplicated per group. See
// docs/implementation-plan.md's Step 3 frontend note.
export default function ResetCodesPage() {
  return (
    <AuthCard title="Generate a reset code" description="For teachers and admins helping a student regain access.">
      <ResetCodeForm />
    </AuthCard>
  );
}
