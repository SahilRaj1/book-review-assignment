import { Router } from "express";
import {
  updateReview,
  deleteReview,
} from "../controllers/review.controller";
import { validateToken } from "../middlewares/auth.middleware";

const router = Router();

/* Secured routes */
router.route("/:id").put(validateToken, updateReview);
router.route("/:id").delete(validateToken, deleteReview);

export default router;
