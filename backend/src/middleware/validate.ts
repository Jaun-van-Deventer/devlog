import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { ZodType } from "zod";

type Schemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

declare global {
  namespace Express {
    interface Request {
      parsedQuery?: Record<string, any>;
    }
  }
}

export const validate =
  (schemas: Schemas): RequestHandler =>
  (req, _res, next) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }

    if (schemas.params) {
      req.params = schemas.params.parse(req.params) as ParamsDictionary;
    }

    if (schemas.query) {
      // Store parsed query in a separate property since req.query is read-only
      req.parsedQuery = schemas.query.parse(req.query);
    }

    next();
  };
