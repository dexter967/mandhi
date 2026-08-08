import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService.js";

export async function getMenu(req, res) {
  try {
    const menu = await getAllMenuItems();

    res.status(200).json({
      success: true,
      count: menu.length,
      data: menu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function addMenuItem(req, res) {
  try {
    const newItem = await createMenuItem(req.body);

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: newItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function editMenuItem(req, res) {
  try {
    const { id } = req.params;

    const updatedItem = await updateMenuItem(id, req.body);

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
// ===============================
// DELETE MENU ITEM
// ===============================

export async function removeMenuItem(req, res) {
  try {
    const { id } = req.params;

    await deleteMenuItem(id);

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
