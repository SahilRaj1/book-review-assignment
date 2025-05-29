import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
} from "../controllers/user.controller";
import { validateToken } from "../middlewares/auth.middleware";

const router = Router();

/* public routes */

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

/* secured routes */

router.route("/logout").post(validateToken, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(validateToken, changeCurrentPassword);
router.route("/current-user").get(validateToken, getCurrentUser);
router.route("/update-account").put(validateToken, updateAccountDetails);

export default router;