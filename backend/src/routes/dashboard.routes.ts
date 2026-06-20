import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", asyncHandler(dashboardController.summary));
