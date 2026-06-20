import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../types/common.js";
import { createProjectSchema, updateProjectSchema } from "../types/project.js";

export const projectRoutes = Router();

projectRoutes.get("/", asyncHandler(projectController.list));
projectRoutes.get("/:id", validate({ params: idParamSchema }), asyncHandler(projectController.getById));
projectRoutes.post("/", validate({ body: createProjectSchema }), asyncHandler(projectController.create));
projectRoutes.put(
  "/:id",
  validate({ params: idParamSchema, body: updateProjectSchema }),
  asyncHandler(projectController.update),
);
projectRoutes.delete("/:id", validate({ params: idParamSchema }), asyncHandler(projectController.remove));
