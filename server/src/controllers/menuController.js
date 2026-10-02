import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuPortions,
  createMenuPortion,
  updateMenuPortion,
  deleteMenuPortion,
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
// ===============================
// GET MENU PORTIONS
// ===============================

export async function getPortions(req, res) {
  try {
    const { id } = req.params;

    const portions = await getMenuPortions(id);

    res.status(200).json({
      success: true,
      count: portions.length,
      data: portions,
    });
  } catch (error) {
    console.error("Get portions error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ===============================
// ADD MENU PORTION
// ===============================

export async function addPortion(req, res) {
  try {
    const { id } = req.params;

    const portion = await createMenuPortion(id, req.body);

    res.status(201).json({
      success: true,
      message: "Menu portion added successfully",
      data: portion,
    });
  } catch (error) {
    console.error("Add portion error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
// ===============================
// UPDATE MENU PORTION
// ===============================

export async function editPortion(req, res) {
  try {
    const { portionId } = req.params;

    const updatedPortion = await updateMenuPortion(portionId, req.body);

    res.status(200).json({
      success: true,
      message: "Menu portion updated successfully",
      data: updatedPortion,
    });
  } catch (error) {
    console.error("Update portion error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
// REMOVE MENU PORTION
export async function removePortion(req, res) {
  try {
    const { portionId } = req.params;

    await deleteMenuPortion(portionId);

    res.status(200).json({
      success: true,
      message: "Menu portion deleted successfully",
    });
  } catch (error) {
    console.error("Delete portion error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
