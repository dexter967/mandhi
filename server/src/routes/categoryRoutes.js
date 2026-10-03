import express from "express";

import {
  getCategories,
  addCategory,
  editCategory,
  removeCategory,
} from "../controllers/categoryController.js";
import requireAdminToken from "../middleware/requireAdminToken.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/", requireAdminToken, addCategory);

router.put("/:id", requireAdminToken, editCategory);

router.delete("/:id", requireAdminToken, removeCategory);

export default router;
