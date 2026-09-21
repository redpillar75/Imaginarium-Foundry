import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth, requireRole } from "../auth/middleware";
import { getSourceById, submitSource } from "../services/sourceService";
import { retryAnalysisJob } from "../services/pipelineJobService";
import { ApiError } from "../errors";

const router = Router();
router.use(requireAuth);

const submitSchema = z.object({
  url: z.string().min(1),
});

router.post(
  "/",
  requireRole("CONTRIBUTOR", "REVIEWER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const body = submitSchema.parse(req.body);
    const { sourceRecord, wasDeduplicated } = await submitSource(body.url, req.user!.sub);
    res.status(wasDeduplicated ? 200 : 201).json({ sourceRecord, wasDeduplicated });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const source = await getSourceById(req.params.id);
    if (!source) throw ApiError.notFound(`Source record ${req.params.id} not found`);
    res.status(200).json({ sourceRecord: source });
  })
);

router.post(
  "/:id/retry",
  requireRole("REVIEWER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const job = await retryAnalysisJob(req.params.id);
    res.status(200).json({ job });
  })
);

export default router;
