// ADR-0052: teacher pages are path-based (e.g. platformdomain.com/habib-sir),
// so a tenant slug must be URL-safe.
import { z } from "zod";

export const tenantSlugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .regex(/^[a-z][a-z0-9-]*$/, "Slug must start with a letter and contain only lowercase letters, numbers, and hyphens");

export const createTenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: tenantSlugSchema,
  ownerUserId: z.string().min(1),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;

const urlField = z.string().url("Enter a valid URL");

export const updateTenantBrandingSchema = z
  .object({
    logoUrl: urlField.optional(),
    bannerUrl: urlField.optional(),
    brandColor: z.string().optional(),
    teacherPictureUrl: urlField.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Provide at least one field to update" });

export type UpdateTenantBrandingInput = z.infer<typeof updateTenantBrandingSchema>;
