import express from "express";
import requireAdminToken from "../middleware/requireAdminToken.js";

const router = express.Router();

router.post("/verify", requireAdminToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access verified.",
  });
});

export default router;
