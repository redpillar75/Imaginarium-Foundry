import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../auth/middleware";
import { getProductionTaskById, listProductionTasks } from "../services/productionTaskService";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const tasks = await listProductionTasks();
    res.status(200).json({ tasks });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await getProductionTaskById(req.params.id);
    res.status(200).json({ task });
  })
);

export default router;
