import supabase from "../config/supabase.js";

// ===============================
// GET ALL CATEGORIES
// ===============================

export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data;
}

// ===============================
// CREATE CATEGORY
// ===============================

export async function createCategory(category) {
  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        name: category.name,
        display_order: category.display_order ?? 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ===============================
// UPDATE CATEGORY
// ===============================

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: updates.name,
      display_order: updates.display_order ?? 0,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ===============================
// DELETE CATEGORY
// ===============================

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw error;

  return true;
}
