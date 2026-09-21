import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { loginUser, registerUser } from "../services/authService";
import { requireAuth, requireRole } from "../auth/middleware";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const createUserSchema = registerSchema.extend({
  role: z.enum(["ADMIN", "REVIEWER", "CONTRIBUTOR"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Public self-signup always creates a CONTRIBUTOR (the least-privileged
// role, able only to submit sources). Elevated roles can only be granted
// by an existing ADMIN via POST /users below, so this endpoint can never
// be used to self-escalate to REVIEWER/ADMIN.
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);
    const result = await registerUser(body.email, body.password, "CONTRIBUTOR");
    res.status(201).json(result);
  })
);

router.post(
  "/users",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const body = createUserSchema.parse(req.body);
    const result = await registerUser(body.email, body.password, body.role);
    res.status(201).json(result);
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const result = await loginUser(body.email, body.password);
    res.status(200).json(result);
  })
);

export default router;
