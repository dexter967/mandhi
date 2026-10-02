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

const router = express.Router();

// ===============================
// MENU ROUTES
// ===============================

router.get("/", getMenu);

router.post("/", addMenuItem);

router.put("/:id", editMenuItem);

router.delete("/:id", removeMenuItem);

// ===============================
// PORTION ROUTES
// ===============================

router.get("/:id/portions", getPortions);

router.post("/:id/portions", addPortion);

router.put("/portions/:portionId", editPortion);
router.delete("/portions/:portionId", removePortion);

// ===============================
// EXPORT
// ===============================

export default router;
