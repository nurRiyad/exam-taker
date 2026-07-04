// Pure business logic — no Hono imports (see services/auth.service.ts).
import type { Database } from "../db/client";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";
import * as teacherMembershipsRepository from "../repositories/teacher-memberships.repository";
import * as tenantsRepository from "../repositories/tenants.repository";
import * as usersRepository from "../repositories/users.repository";
import type { CreateTenantInput, UpdateTenantBrandingInput } from "../validation/tenants";

export async function createTenant(db: Database, input: CreateTenantInput) {
  const owner = await usersRepository.findById(db, input.ownerUserId);
  if (!owner) throw new NotFoundError("Owner user not found");
  if (owner.role === "admin") throw new BadRequestError("Cannot make an admin account a tenant owner");

  const existingMembership = await teacherMembershipsRepository.findByUserId(db, owner.id);
  if (existingMembership) throw new BadRequestError("This user already owns a tenant");

  const slugTaken = await tenantsRepository.findBySlug(db, input.slug);
  if (slugTaken) throw new ConflictError("Slug is already taken", { slug: "Slug is already taken" });

  let tenant;
  try {
    tenant = await tenantsRepository.insert(db, { name: input.name, slug: input.slug });
  } catch (err) {
    // Check-then-insert race, same fallback pattern as auth.service.ts's signup.
    const message = err instanceof Error ? err.message : "";
    if (!message.includes("UNIQUE constraint failed")) throw err;
    throw new ConflictError("Slug is already taken", { slug: "Slug is already taken" });
  }

  // Not atomic with the tenant insert above — D1 has no cross-statement
  // transaction here without generating the tenant id client-side. Worst
  // case (membership insert fails) leaves an orphaned tenant row, fixable
  // manually; acceptable for MVP admin-only tenant creation.
  await teacherMembershipsRepository.insert(db, { tenantId: tenant.id, userId: owner.id, role: "owner" });
  if (owner.role !== "teacher") {
    await usersRepository.updateRole(db, owner.id, "teacher");
  }

  return tenant;
}

export async function updateBranding(db: Database, tenantId: string, input: UpdateTenantBrandingInput) {
  return tenantsRepository.update(db, tenantId, input);
}
