// Dev-only utility — NOT deployed application logic, NOT part of the Worker's
// typechecked source tree (lives outside src/ on purpose: it needs Node
// globals like `process`/`Buffer` via node:child_process, which must never
// leak into Worker route code — see apps/api/tsconfig.json's `include`).
// Seeds one idempotent local admin account so Step 3's role guards and
// reset-code generation can be exercised end to end before Step 4 adds real
// teacher/admin provisioning. Run only against local D1:
// `pnpm --filter api db:seed:admin`.
import { execFileSync } from "node:child_process";
import path from "node:path";
import { hashPassword } from "../src/lib/password";
import { normalizePhoneToE164 } from "../src/lib/phone";

const ADMIN = {
  name: "Local Admin",
  username: "localadmin",
  phone: "01700000000",
  email: "admin@local.test",
  password: "admin123456",
};

async function main() {
  const passwordHash = await hashPassword(ADMIN.password);
  const phoneE164 = normalizePhoneToE164(ADMIN.phone);

  const sql = `INSERT INTO users (name, username, phone_e164, email, password_hash, role)
SELECT '${ADMIN.name}', '${ADMIN.username}', '${phoneE164}', '${ADMIN.email}', '${passwordHash}', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = '${ADMIN.username}');`;

  const apiRoot = path.resolve(import.meta.dirname, "..");
  const wrangler = path.join(apiRoot, "node_modules", ".bin", "wrangler");

  execFileSync(wrangler, ["d1", "execute", "exam-taker-db", "--local", "--command", sql], {
    cwd: apiRoot,
    stdio: "inherit",
  });

  console.log(`Seeded (or already existed) admin: username=${ADMIN.username} password=${ADMIN.password}`);
}

main();
