import { Router } from "express";
import { AuthService } from "../../core/services/auth.service";
import { body, validationResult } from "express-validator";
import { ValidationError } from "../../common/errors/AppError";
import { Request, Response, NextFunction } from "express";

export const createAuthRouter = (authService: AuthService) => {
  const router = Router();

  const validate = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }
    next();
  };

  router.post(
    "/register",
    [
      body("username").trim().isLength({ min: 3, max: 20 }),
      body("email").optional().isEmail(),
      body("password").isLength({ min: 8 }),
    ],
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { user, tokenPair } = await authService.register(
          req.body.username,
          req.body.email,
          req.body.password
        );
        res.status(201).json({
          succes: true,
          user,
          ...tokenPair,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/login",
    [body("username").trim().notEmpty(), body("password").notEmpty()],
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { user, tokenPair } = await authService.login(
          req.body.username,
          req.body.password
        );
        res.status(200).json({
          success: true,
          user,
          ...tokenPair,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/refresh",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { refreshToken } = req.body;
        const tokens = await authService.refreshToken(refreshToken);
        res.status(200).json({
          success: true,
          ...tokens,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};
