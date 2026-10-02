import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";

// ===============================
// GET ALL CATEGORIES
// ===============================

export async function getCategories(req, res) {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ===============================
// ADD CATEGORY
// ===============================

export async function addCategory(req, res) {
  try {
    const { name, display_order } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await createCategory({
      name: name.trim(),
      display_order: display_order ?? 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Add category error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ===============================
// EDIT CATEGORY
// ===============================

export async function editCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, display_order } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await updateCategory(id, {
      name: name.trim(),
      display_order: display_order ?? 0,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Edit category error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ===============================
// DELETE CATEGORY
// ===============================

export async function removeCategory(req, res) {
  try {
    const { id } = req.params;

    await deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
