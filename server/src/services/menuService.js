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
// ===============================
// GET PORTIONS FOR MENU ITEM
// ===============================

export async function getMenuPortions(menuItemId) {
  const { data, error } = await supabase
    .from("menu_portions")
    .select("*")
    .eq("menu_item_id", menuItemId)
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data;
}

// ===============================
// CREATE MENU PORTION
// ===============================

export async function createMenuPortion(menuItemId, portionData) {
  const { data, error } = await supabase
    .from("menu_portions")
    .insert([
      {
        menu_item_id: menuItemId,
        portion_name: portionData.portion_name,
        price: portionData.price,
        display_order: portionData.display_order || 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}
// ===============================
// UPDATE MENU PORTION
// ===============================

export async function updateMenuPortion(portionId, portionData) {
  const { data, error } = await supabase
    .from("menu_portions")
    .update({
      portion_name: portionData.portion_name,
      price: portionData.price,
      display_order: portionData.display_order,
    })
    .eq("id", portionId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
export async function deleteMenuPortion(portionId) {
  const { error } = await supabase
    .from("menu_portions")
    .delete()
    .eq("id", portionId);

  if (error) throw error;

  return true;
}
