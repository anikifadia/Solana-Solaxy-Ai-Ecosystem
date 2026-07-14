import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ZodSchema, ZodError } from "zod";

// 1. Core security headers with Helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https://*"],
      connectSrc: [
        "'self'", 
        "https://api.mainnet-beta.solana.com", 
        "https://api.devnet.solana.com",
        "https://generativelanguage.googleapis.com"
      ],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https://*"],
      frameAncestors: ["*"], // Allow iframe embedding in the AI Studio environment
    },
  },
  crossOriginEmbedderPolicy: false,
  frameguard: false, // Disable X-Frame-Options: SAMEORIGIN to allow preview within standard frames
});

// 2. Global API Rate Limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  validate: { trustProxy: false }, // Suppress proxy validation warnings in the container environment
  message: {
    error: "Too many requests from this IP address. Please try again in 15 minutes."
  }
});

// 3. Centralized Request Validation Middleware using Zod
export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Input data validation error.",
          details: error.issues.map(err => `${err.path.join(".")}: ${err.message}`)
        });
      }
      return next(error);
    }
  };
};

// 4. Centralized Error Handling Middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[Central Server Error]:", err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "An unexpected server error occurred.";

  return res.status(statusCode).json({
    error: message,
    code: err.code || "INTERNAL_SERVER_ERROR",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
};
