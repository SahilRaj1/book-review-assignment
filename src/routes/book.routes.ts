import { Router } from "express";
import {
  getAllBooks,
  addBook,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";
import { validateToken } from "../middlewares/auth.middleware";
import { addReview } from "../controllers/review.controller";

const router = Router();

/* Public routes */
router.route("/").get(getAllBooks);
router.route("/:id").get(getBookById);

/* Secured routes */
router.route("/").post(validateToken, addBook);
router.route("/:id").put(validateToken, updateBook);
router.route("/:id").delete(validateToken, deleteBook);
router.route("/:id/reviews").post(validateToken, addReview);

export default router;
