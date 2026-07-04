// HTTP-facing orchestration — see controllers/auth.controller.ts.
import type { Context } from "hono";
import { getDb } from "../db/client";
import type { AuthEnv } from "../middleware/auth";
import type { TenantEnv } from "../middleware/tenant-scope";
import * as coursesService from "../services/courses.service";
import * as tenantsService from "../services/tenants.service";
import type { CreateCourseInput, PaymentRequestInput, UpdateCourseInput } from "../validation/courses";
import type { UpdateTenantBrandingInput } from "../validation/tenants";

export async function updateTenantBranding(c: Context<TenantEnv>, input: UpdateTenantBrandingInput) {
  const db = getDb(c.env.DB);
  const tenant = await tenantsService.updateBranding(db, c.get("tenantId"), input);
  return c.json({ tenant });
}

export async function createCourse(c: Context<TenantEnv>, input: CreateCourseInput) {
  const db = getDb(c.env.DB);
  const course = await coursesService.createCourse(db, c.get("tenantId"), input);
  return c.json({ course }, 201);
}

export async function updateCourse(c: Context<TenantEnv>, courseId: string, input: UpdateCourseInput) {
  const db = getDb(c.env.DB);
  const course = await coursesService.updateCourse(db, c.get("tenantId"), courseId, input);
  return c.json({ course });
}

export async function publishCourse(c: Context<TenantEnv>, courseId: string) {
  const db = getDb(c.env.DB);
  const course = await coursesService.publishCourse(db, c.get("tenantId"), courseId);
  return c.json({ course });
}

export async function getCourse(c: Context<AuthEnv>, courseId: string) {
  const db = getDb(c.env.DB);
  const result = await coursesService.getCourseById(db, c.get("user"), courseId);
  return c.json(result);
}

export async function listTeacherCourses(c: Context<TenantEnv>) {
  const db = getDb(c.env.DB);
  const courses = await coursesService.listTeacherCourses(db, c.get("tenantId"));
  return c.json({ courses });
}

export async function joinCourse(c: Context<AuthEnv>, courseId: string) {
  const db = getDb(c.env.DB);
  const enrollment = await coursesService.joinCourse(db, c.get("user").id, courseId);
  return c.json({ enrollment }, 201);
}

export async function createPaymentRequest(c: Context<AuthEnv>, courseId: string, input: PaymentRequestInput) {
  const db = getDb(c.env.DB);
  const paymentAccessRequest = await coursesService.createPaymentRequest(db, c.get("user").id, courseId, input);
  return c.json({ paymentAccessRequest }, 201);
}

export async function listPaymentRequests(
  c: Context<TenantEnv>,
  courseId: string,
  status?: "pending" | "approved" | "rejected",
) {
  const db = getDb(c.env.DB);
  const requests = await coursesService.listPaymentRequests(db, c.get("tenantId"), courseId, status);
  return c.json({ requests });
}

export async function approvePaymentRequest(c: Context<TenantEnv>, requestId: string) {
  const db = getDb(c.env.DB);
  const result = await coursesService.approvePaymentRequest(db, c.get("tenantId"), requestId, c.get("user").id);
  return c.json(result);
}

export async function rejectPaymentRequest(c: Context<TenantEnv>, requestId: string) {
  const db = getDb(c.env.DB);
  const request = await coursesService.rejectPaymentRequest(db, c.get("tenantId"), requestId, c.get("user").id);
  return c.json({ request });
}

export async function blockEnrollment(c: Context<TenantEnv>, enrollmentId: string) {
  const db = getDb(c.env.DB);
  const enrollment = await coursesService.blockEnrollment(db, c.get("tenantId"), enrollmentId);
  return c.json({ enrollment });
}

export async function removeEnrollment(c: Context<TenantEnv>, enrollmentId: string) {
  const db = getDb(c.env.DB);
  const enrollment = await coursesService.removeEnrollment(db, c.get("tenantId"), enrollmentId);
  return c.json({ enrollment });
}
