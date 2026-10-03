import express from "express";

import {
  getMenu,
  addMenuItem,
  editMenuItem,
  removeMenuItem,
  getPortions,
  addPortion,
  editPortion,
  removePortion,
} from "../controllers/menuController.js";
import requireAdminToken from "../middleware/requireAdminToken.js";

const router = express.Router();

// ===============================
// MENU ROUTES
// ===============================

router.get("/", getMenu);

router.post("/", requireAdminToken, addMenuItem);

router.put("/:id", requireAdminToken, editMenuItem);

router.delete("/:id", requireAdminToken, removeMenuItem);

// ===============================
// PORTION ROUTES
// ===============================

router.get("/:id/portions", getPortions);

router.post("/:id/portions", requireAdminToken, addPortion);

router.put("/portions/:portionId", requireAdminToken, editPortion);
router.delete("/portions/:portionId", requireAdminToken, removePortion);

// ===============================
// EXPORT
// ===============================

export default router;
