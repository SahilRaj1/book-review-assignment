import { Router } from "express";
import { searchBooks } from "../controllers/book.controller";

const router = Router();

/* Public routes */
router.route("/").get(searchBooks);

export default router;
