import { RequestHandler, Router } from "express";
import { TabService } from "../../core/services/tab.service";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../core/types/auth.types";
import { validationResult } from "express-validator";
import { ValidationError } from "../../common/errors/AppError";

export const createTabRouter = (tabService: TabService) => {
  const router = Router();

  const validate = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }
    next();
  };

  // GET all user's tabs
  router.get(
    "/",
    validate,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const tabs = await tabService.getUserTabs(req.user.id);
        res.json({ success: true, data: tabs });
      } catch (error) {
        next(error);
      }
    } as RequestHandler
  );
};
