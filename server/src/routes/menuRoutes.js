import express from "express";
import {
  getMenu,
  addMenuItem,
  editMenuItem,
  removeMenuItem,
} from "../controllers/menuController.js";

const router = express.Router();

router.get("/", getMenu);

router.post("/", addMenuItem);

router.put("/:id", editMenuItem);

export default router;
router.delete("/:id", removeMenuItem);
