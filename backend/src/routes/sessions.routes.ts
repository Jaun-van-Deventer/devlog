import { Router } from "express";
import { sessionController } from "../controllers/session.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../types/common.js";
import { createSessionSchema } from "../types/session.js";

export const sessionRoutes = Router();

sessionRoutes.get("/", asyncHandler(sessionController.list));
sessionRoutes.get("/:id", validate({ params: idParamSchema }), asyncHandler(sessionController.getById));
sessionRoutes.post("/", validate({ body: createSessionSchema }), asyncHandler(sessionController.create));
sessionRoutes.delete("/:id", validate({ params: idParamSchema }), asyncHandler(sessionController.remove));
