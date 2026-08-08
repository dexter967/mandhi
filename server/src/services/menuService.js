import supabase from "../config/supabase.js";

export async function getAllMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data;
}
export async function createMenuItem(menuItem) {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([menuItem])
    .select()
    .single();

  if (error) throw error;

  return data;
}
export async function updateMenuItem(id, updates) {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
// ===============================
// DELETE MENU ITEM
// ===============================

export async function deleteMenuItem(id) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) throw error;

  return true;
}
