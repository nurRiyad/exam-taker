import { AuthCard } from "@/components/auth-card";
import { ResetCodeForm } from "@/components/reset-code-form";

// This remains the compatibility page for /reset-codes. Role-prefixed routes
// reuse the same component tree from /teacher/reset-codes and /admin/reset-codes.
export default function ResetCodesPage() {
  return (
    <AuthCard title="Generate a reset code" description="For teachers and admins helping a student regain access.">
      <ResetCodeForm />
    </AuthCard>
  );
}
