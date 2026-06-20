import { Router } from "express";
import { issueController } from "../controllers/issue.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../types/common.js";
import { createIssueSchema, issueQuerySchema, updateIssueSchema } from "../types/issue.js";

export const issueRoutes = Router();

issueRoutes.get("/", validate({ query: issueQuerySchema }), asyncHandler(issueController.list));
issueRoutes.get("/:id", validate({ params: idParamSchema }), asyncHandler(issueController.getById));
issueRoutes.post("/", validate({ body: createIssueSchema }), asyncHandler(issueController.create));
issueRoutes.put(
  "/:id",
  validate({ params: idParamSchema, body: updateIssueSchema }),
  asyncHandler(issueController.update),
);
issueRoutes.delete("/:id", validate({ params: idParamSchema }), asyncHandler(issueController.remove));
