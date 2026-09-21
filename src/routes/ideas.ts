import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth, requireRole } from "../auth/middleware";
import { getIdeaById, listIdeas } from "../services/ideaService";
import { decideApproval } from "../services/approvalService";

const router = Router();
router.use(requireAuth);

const listQuerySchema = z.object({
  status: z.enum(["PENDING_REVIEW", "APPROVED", "REJECTED"]).optional(),
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);
    const ideas = await listIdeas(query.status);
    res.status(200).json({ ideas });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const idea = await getIdeaById(req.params.id);
    res.status(200).json({ idea });
  })
);

const decisionSchema = z.object({
  comment: z.string().max(2000).optional(),
});

router.post(
  "/:id/approve",
  requireRole("REVIEWER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const body = decisionSchema.parse(req.body ?? {});
    const result = await decideApproval({
      contentIdeaId: req.params.id,
      decision: "APPROVED",
      decidedById: req.user!.sub,
      comment: body.comment,
    });
    res.status(200).json(result);
  })
);

router.post(
  "/:id/reject",
  requireRole("REVIEWER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const body = decisionSchema.parse(req.body ?? {});
    const result = await decideApproval({
      contentIdeaId: req.params.id,
      decision: "REJECTED",
      decidedById: req.user!.sub,
      comment: body.comment,
    });
    res.status(200).json(result);
  })
);

export default router;
