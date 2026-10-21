import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createCourseSchema, updateCourseSchema } from "@exam-taker/validation/courses";
import { requireRole, type AuthEnv } from "../../middleware/auth";
import * as service from "./demo-courses.service";

export const demoCourseRoutes = new Hono<AuthEnv>()
  .get("/", requireRole("teacher"), (c) => c.json({ courses: service.listDemoCourses(c.get("user").username) }))
  .post("/", requireRole("teacher"), zValidator("json", createCourseSchema), (c) =>
    c.json({ course: service.createDemoCourse(c.req.valid("json"), c.get("user").username) }, 201),
  )
  .patch("/:id", requireRole("teacher"), zValidator("json", updateCourseSchema), (c) => {
    const course = service.updateDemoCourse(c.req.param("id"), c.get("user").username, c.req.valid("json"));
    return course ? c.json({ course }) : c.json({ error: "কোর্সটি পাওয়া যায়নি" }, 404);
  })
  .delete("/:id", requireRole("teacher"), (c) => {
    const deleted = service.deleteDemoCourse(c.req.param("id"), c.get("user").username);
    return deleted ? c.json({ deleted: true as const }) : c.json({ error: "কোর্সটি পাওয়া যায়নি" }, 404);
  });
