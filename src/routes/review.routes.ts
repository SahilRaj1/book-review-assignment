import { Router } from "express";
import {
  updateReview,
  deleteReview,
} from "../controllers/review.controller";
import { validateToken } from "../middlewares/auth.middleware";

const router = Router();

/* Secured routes */
router.route("reviews/:id").put(validateToken, updateReview);
router.route("reviews/:id").delete(validateToken, deleteReview);

export default router;
