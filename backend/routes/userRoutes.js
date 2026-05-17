import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(createUser).get(authenticate, authorizeAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// Watchlist routes
router.get("/watchlist", authenticate, getWatchlist);
router.post("/watchlist/:movieId", authenticate, addToWatchlist);
router.delete("/watchlist/:movieId", authenticate, removeFromWatchlist);

export default router;
