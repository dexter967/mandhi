const API_BASE_URL = (
  window.MANDHI_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/menu`;
const CATEGORY_API_URL = `${API_BASE_URL}/categories`;

// =========================================
// CATEGORY MANAGEMENT
// =========================================

// ===============================
// STATE / CACHE
// ===============================

let MENU_CATEGORIES = [];

const menuItemsCache = {};
const portionsCache = {};

// ===============================
// UTILITIES
// ===============================

function escapeHtml(str) {
  if (str === null || str === undefined) return "";

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hasPrice(price) {
  return price !== null && price !== undefined && price !== "";
}

function renderCategories() {
  const categoryList = document.getElementById("categoryList");

  if (!categoryList) return;

  if (MENU_CATEGORIES.length === 0) {
    categoryList.innerHTML = `<div class="loading-message">No categories found.</div>`;
    return;
  }

  categoryList.innerHTML = MENU_CATEGORIES.map(
    (category) => `
      <div class="category-admin-item">
        <span class="category-admin-name">${escapeHtml(category.name)}</span>
        <button
          type="button"
          class="category-delete-btn"
          data-category-id="${escapeHtml(category.id)}"
          data-category-name="${escapeHtml(category.name)}"
        >
          Delete
        </button>
      </div>
    `,
  ).join("");

  categoryList.querySelectorAll(".category-delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      deleteCategory(button.dataset.categoryId, button.dataset.categoryName);
    });
  });
}

// ===============================
// LOAD CATEGORIES
// ===============================

async function loadCategories() {
  const categoryList = document.getElementById("categoryList");
  if (categoryList) {
    categoryList.innerHTML = `<div class="loading-message">Loading categories...</div>`;
  }

  try {
    const response = await fetch(CATEGORY_API_URL);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load categories");
    }

    MENU_CATEGORIES = result.data || [];

    renderCategories();
    populateAddCategoryDropdown();

    return MENU_CATEGORIES;
  } catch (error) {
    console.error("Category loading error:", error);

    if (categoryList) {
      categoryList.innerHTML = `<div class="loading-message">Could not load categories from ${escapeHtml(CATEGORY_API_URL)}. ${escapeHtml(error.message || "Check that the API is running and reachable.")}</div>`;
    }

    const categorySelect = document.getElementById("category");

    if (categorySelect) {
      categorySelect.innerHTML = `<option value="">Could not load categories — check API connection</option>`;
    }

    return [];
  }
}

// ===============================
// CATEGORY NAME HELPER
// ===============================

function getCategoryName(category) {
  if (typeof category === "string") {
    return category;
  }

  return category.name || "";
}

async function addCategory() {
  const input = document.getElementById("newCategoryName");
  const message = document.getElementById("categoryMessage");
  const name = input.value.trim();

  if (!name) {
    message.textContent = "Please enter a category name.";
    message.style.color = "#b94a48";
    return;
  }

  try {
    const response = await fetch(CATEGORY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to add category");
    }

    input.value = "";
    message.textContent = "Category added successfully.";
    message.style.color = "#72b87a";
    await refreshCategories();
  } catch (error) {
    console.error("Add category error:", error);
    message.textContent = error.message || "Could not add category.";
    message.style.color = "#b94a48";
  }
}

async function deleteCategory(id, categoryName) {
  if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

  const message = document.getElementById("categoryMessage");

  try {
    const response = await fetch(`${CATEGORY_API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete category");
    }

    message.textContent = "Category deleted successfully.";
    message.style.color = "#72b87a";
    await refreshCategories();
  } catch (error) {
    console.error("Delete category error:", error);
    message.textContent = error.message || "Could not delete category.";
    message.style.color = "#b94a48";
  }
}

// ===============================
// POPULATE ADD CATEGORY DROPDOWN
// ===============================

function populateAddCategoryDropdown() {
  const select = document.getElementById("category");

  if (!select) return;

  if (!MENU_CATEGORIES.length) {
    select.innerHTML = `<option value="">No categories available</option>`;
    return;
  }

  select.innerHTML = MENU_CATEGORIES.map((category) => {
    const name = getCategoryName(category);

    return `
                <option value="${escapeHtml(name)}">
                    ${escapeHtml(name)}
                </option>
            `;
  }).join("");
}

// ===============================
// BUILD CATEGORY OPTIONS
// ===============================

function buildCategoryOptionsHtml(selectedValue) {
  if (!MENU_CATEGORIES.length) {
    return `<option value="">No categories available</option>`;
  }

  return MENU_CATEGORIES.map((category) => {
    const name = getCategoryName(category);

    const selected = name === selectedValue ? "selected" : "";

    return `
                <option
                    value="${escapeHtml(name)}"
                    ${selected}
                >
                    ${escapeHtml(name)}
                </option>
            `;
  }).join("");
}

// ===============================
// ADD MENU ITEM
// ===============================

async function addItem() {
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();

  const priceInput = document.getElementById("price").value.trim();

  const category = document.getElementById("category").value;

  const image = document.getElementById("image").value.trim();

  if (!name) {
    alert("Please enter a food name.");
    return;
  }

  if (!category) {
    alert("Please select a category.");
    return;
  }

  let price = null;

  if (priceInput !== "") {
    price = Number(priceInput);

    if (Number.isNaN(price) || price < 0) {
      alert("Please enter a valid price or leave it empty.");
      return;
    }
  }

  const item = {
    name,

    description,

    price,

    category_name: category,

    image_url: image,

    display_order: 999,

    is_available: true,

    is_bestseller: false,

    is_featured: false,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(item),
    });

    const result = await response.json();

    const message = document.getElementById("message");

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to add menu item");
    }

    message.innerHTML = "✅ Menu item added successfully!";

    message.style.color = "green";

    document.getElementById("name").value = "";

    document.getElementById("description").value = "";

    document.getElementById("price").value = "";

    document.getElementById("image").value = "";

    if (MENU_CATEGORIES.length) {
      document.getElementById("category").value = getCategoryName(
        MENU_CATEGORIES[0],
      );
    }

    await loadMenuItems();
  } catch (error) {
    console.error("Add item error:", error);

    document.getElementById("message").innerHTML = "❌ " + error.message;

    document.getElementById("message").style.color = "red";
  }
}

// ===============================
// LOAD MENU ITEMS
// ===============================

async function loadMenuItems() {
  const menuList = document.getElementById("menuList");
  menuList.innerHTML = `<div class="loading-message">Loading menu items...</div>`;

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load menu");
    }

    Object.keys(menuItemsCache).forEach((id) => delete menuItemsCache[id]);
    Object.keys(portionsCache).forEach((id) => delete portionsCache[id]);
    menuList.innerHTML = "";

    if (!Array.isArray(result.data) || result.data.length === 0) {
      menuList.innerHTML = "<p>No menu items found.</p>";
      return;
    }

    result.data.forEach((item) => {
      menuItemsCache[item.id] = item;

      const card = document.createElement("div");

      card.className = "menu-admin-card";

      card.id = `menu-card-${item.id}`;

      card.innerHTML = buildMenuCardHtml(item);

      menuList.appendChild(card);

      loadPortions(item.id);
    });
  } catch (error) {
    console.error("Menu loading error:", error);

    menuList.innerHTML = `
      <p class="loading-message">
        Could not load menu items from ${escapeHtml(API_URL)}.
        ${escapeHtml(error.message || "Check that the API is running and reachable.")}
      </p>
    `;
  }
}

// ===============================
// MENU CARD
// ===============================

function buildMenuCardHtml(item) {
  return `

        <img
            src="${escapeHtml(item.image_url || "https://picsum.photos/300")}"
            alt="${escapeHtml(item.name)}"
        >

        <div class="menu-admin-info">

            <div
                class="menu-view"
                id="menu-view-${item.id}"
            >
                ${buildMenuViewHtml(item)}
            </div>

            <div
                class="menu-edit-form"
                id="menu-edit-form-${item.id}"
                style="display:none;"
            >

                <input
                    type="text"
                    id="edit-name-${item.id}"
                    placeholder="Food Name"
                >

                <textarea
                    id="edit-description-${item.id}"
                    placeholder="Description"
                ></textarea>

                <input
                    type="number"
                    id="edit-price-${item.id}"
                    min="0"
                    step="0.01"
                    placeholder="Price (optional)"
                >

                <label>
                    Category

                    <select
                        id="edit-category-${item.id}"
                    >
                        ${buildCategoryOptionsHtml(item.category_name)}
                    </select>
                </label>

                <input
                    type="text"
                    id="edit-image-${item.id}"
                    placeholder="Image URL"
                >

                <label>
                    <input
                        type="checkbox"
                        id="edit-available-${item.id}"
                    >
                    Available
                </label>

                <label>
                    <input
                        type="checkbox"
                        id="edit-bestseller-${item.id}"
                    >
                    Bestseller
                </label>

                <label>
                    <input
                        type="checkbox"
                        id="edit-featured-${item.id}"
                    >
                    Featured
                </label>

                <div class="menu-edit-actions">

                    <button
                        type="button"
                        onclick="saveItemEdit('${item.id}')"
                    >
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onclick="cancelItemEdit('${item.id}')"
                    >
                        Cancel
                    </button>

                </div>

            </div>

            <div class="portions-block">

                <h4 class="portions-heading">
                    Portions
                </h4>

                <div
                    class="portions-list"
                    id="portions-list-${item.id}"
                >
                    Loading portions...
                </div>

                <div
                    class="portion-add-form"
                    id="add-portion-form-${item.id}"
                    style="display:none;"
                >

                    <input
                        type="text"
                        id="portion-name-${item.id}"
                        placeholder="Portion Name"
                    >

                    <input
                        type="number"
                        id="portion-price-${item.id}"
                        min="0"
                        step="0.01"
                        placeholder="Price (optional)"
                    >

                    <button
                        type="button"
                        onclick="savePortion('${item.id}')"
                    >
                        Save Portion
                    </button>

                    <button
                        type="button"
                        onclick="cancelAddPortion('${item.id}')"
                    >
                        Cancel
                    </button>

                </div>

                <button
                    type="button"
                    class="add-portion-btn"
                    id="add-portion-btn-${item.id}"
                    onclick="showAddPortionForm('${item.id}')"
                >
                    + Add Portion
                </button>

            </div>

        </div>
    `;
}

// ===============================
// MENU VIEW
// ===============================

function buildMenuViewHtml(item) {
  return `

        <h3>
            ${escapeHtml(item.name)}
        </h3>

        <p>
            ${escapeHtml(item.description || "")}
        </p>

        ${hasPrice(item.price) ? `<strong>₹${item.price}</strong>` : ""}

        <p class="menu-item-category">
            Category:
            ${escapeHtml(item.category_name || "Uncategorized")}
        </p>

        <p>
            ${item.is_available ? "✅ Available" : "❌ Unavailable"}
        </p>

        <div class="menu-admin-actions">

            <button
                type="button"
                onclick="showEditItemForm('${item.id}')"
            >
                Edit
            </button>

            <button
                type="button"
                onclick="deleteItem('${item.id}')"
            >
                Delete
            </button>

        </div>
    `;
}

// ===============================
// EDIT MENU ITEM
// ===============================

function showEditItemForm(id) {
  const item = menuItemsCache[id];

  if (!item) {
    alert("Menu item not found.");
    return;
  }

  document.getElementById(`edit-name-${id}`).value = item.name || "";

  document.getElementById(`edit-description-${id}`).value =
    item.description || "";

  document.getElementById(`edit-price-${id}`).value = hasPrice(item.price)
    ? item.price
    : "";

  const categorySelect = document.getElementById(`edit-category-${id}`);

  categorySelect.innerHTML = buildCategoryOptionsHtml(item.category_name);

  categorySelect.value = item.category_name || "";

  document.getElementById(`edit-image-${id}`).value = item.image_url || "";

  document.getElementById(`edit-available-${id}`).checked = !!item.is_available;

  document.getElementById(`edit-bestseller-${id}`).checked =
    !!item.is_bestseller;

  document.getElementById(`edit-featured-${id}`).checked = !!item.is_featured;

  document.getElementById(`menu-view-${id}`).style.display = "none";

  document.getElementById(`menu-edit-form-${id}`).style.display = "flex";
}

function cancelItemEdit(id) {
  document.getElementById(`menu-edit-form-${id}`).style.display = "none";

  document.getElementById(`menu-view-${id}`).style.display = "block";
}

// ===============================
// SAVE MENU ITEM EDIT
// ===============================

async function saveItemEdit(id) {
  const priceInput = document.getElementById(`edit-price-${id}`).value.trim();

  let price = null;

  if (priceInput !== "") {
    price = Number(priceInput);

    if (Number.isNaN(price) || price < 0) {
      alert("Please enter a valid price or leave it empty.");

      return;
    }
  }

  const updatedItem = {
    name: document.getElementById(`edit-name-${id}`).value.trim(),

    description: document.getElementById(`edit-description-${id}`).value.trim(),

    price,

    category_name: document.getElementById(`edit-category-${id}`).value,

    image_url: document.getElementById(`edit-image-${id}`).value.trim(),

    is_available: document.getElementById(`edit-available-${id}`).checked,

    is_bestseller: document.getElementById(`edit-bestseller-${id}`).checked,

    is_featured: document.getElementById(`edit-featured-${id}`).checked,
  };

  if (!updatedItem.name) {
    alert("Food name cannot be empty.");
    return;
  }

  if (!updatedItem.category_name) {
    alert("Please select a category.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(updatedItem),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update menu item");
    }

    menuItemsCache[id] = {
      ...menuItemsCache[id],
      ...updatedItem,
      id,
    };

    const viewContainer = document.getElementById(`menu-view-${id}`);

    if (viewContainer) {
      viewContainer.innerHTML = buildMenuViewHtml(menuItemsCache[id]);
    }

    document.getElementById(`menu-edit-form-${id}`).style.display = "none";

    document.getElementById(`menu-view-${id}`).style.display = "block";

    alert("✅ Menu item updated successfully!");
  } catch (error) {
    console.error("Update error:", error);

    alert("❌ " + error.message);
  }
}

// ===============================
// DELETE MENU ITEM
// ===============================

async function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this menu item?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete menu item");
    }

    delete menuItemsCache[id];
    delete portionsCache[id];

    const card = document.getElementById(`menu-card-${id}`);

    if (card) {
      card.remove();
    }

    alert("✅ Menu item deleted successfully!");
  } catch (error) {
    console.error("Delete error:", error);

    alert("❌ " + error.message);
  }
}

// ===============================
// LOAD PORTIONS
// ===============================

async function loadPortions(menuItemId) {
  const container = document.getElementById(`portions-list-${menuItemId}`);

  if (!container) return;

  container.innerHTML = `<p class="portions-loading">
            Loading portions...
        </p>`;

  try {
    const response = await fetch(`${API_URL}/${menuItemId}/portions`);

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load portions");
    }

    const portions = (result.data || [])
      .slice()
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    portionsCache[menuItemId] = portions;

    renderPortionsList(menuItemId, portions);
  } catch (error) {
    console.error("Load portions error:", error);

    container.innerHTML = `<p class="portions-error">
                Could not load portions.
            </p>`;
  }
}

// ===============================
// PORTION HTML
// ===============================

function buildPortionRowHtml(menuItemId, portion) {
  return `

        <div
            class="portion-item"
            data-portion-id="${portion.id}"
            data-display-order="${portion.display_order ?? 0}"
        >

            <span class="portion-item-name">
                ${escapeHtml(portion.portion_name)}
            </span>

            ${hasPrice(portion.price) ? `<span>₹${portion.price}</span>` : ""}

            <button
                type="button"
                class="portion-edit-btn"
                onclick="showEditPortionForm(
                    '${menuItemId}',
                    '${portion.id}'
                )"
            >
                Edit
            </button>

            <button
                type="button"
                class="portion-delete-btn"
                onclick="deletePortion(
                    '${portion.id}',
                    '${menuItemId}'
                )"
            >
                Delete
            </button>

        </div>

        <div
            class="portion-edit-form"
            id="edit-portion-form-${portion.id}"
            style="display:none;"
        >

            <input
                type="text"
                id="edit-portion-name-${portion.id}"
                value="${escapeHtml(portion.portion_name)}"
                placeholder="Portion Name"
            >

            <input
                type="number"
                id="edit-portion-price-${portion.id}"
                min="0"
                step="0.01"
                value="${hasPrice(portion.price) ? portion.price : ""}"
                placeholder="Price (optional)"
            >

            <button
                type="button"
                onclick="updatePortion(
                    '${portion.id}',
                    '${menuItemId}'
                )"
            >
                Save
            </button>

            <button
                type="button"
                onclick="cancelEditPortion(
                    '${portion.id}'
                )"
            >
                Cancel
            </button>

        </div>
    `;
}

// ===============================
// RENDER PORTIONS
// ===============================

function renderPortionsList(menuItemId, portions) {
  const container = document.getElementById(`portions-list-${menuItemId}`);

  if (!container) return;

  if (!portions.length) {
    container.innerHTML = `<p class="portions-empty">
                No portions added yet.
            </p>`;

    return;
  }

  container.innerHTML = portions
    .map((portion) => buildPortionRowHtml(menuItemId, portion))
    .join("");
}

// ===============================
// ADD PORTION FORM
// ===============================

function showAddPortionForm(menuItemId) {
  const form = document.getElementById(`add-portion-form-${menuItemId}`);

  const button = document.getElementById(`add-portion-btn-${menuItemId}`);

  if (form) {
    form.style.display = "flex";
  }

  if (button) {
    button.style.display = "none";
  }
}

function cancelAddPortion(menuItemId) {
  const form = document.getElementById(`add-portion-form-${menuItemId}`);

  const button = document.getElementById(`add-portion-btn-${menuItemId}`);

  const nameInput = document.getElementById(`portion-name-${menuItemId}`);

  const priceInput = document.getElementById(`portion-price-${menuItemId}`);

  if (nameInput) {
    nameInput.value = "";
  }

  if (priceInput) {
    priceInput.value = "";
  }

  if (form) {
    form.style.display = "none";
  }

  if (button) {
    button.style.display = "inline-block";
  }
}

// ===============================
// SAVE PORTION
// ===============================

async function savePortion(menuItemId) {
  const nameInput = document.getElementById(`portion-name-${menuItemId}`);

  const priceInput = document.getElementById(`portion-price-${menuItemId}`);

  const portion_name = nameInput.value.trim();

  const priceInputValue = priceInput.value.trim();

  if (!portion_name) {
    alert("Please enter a portion name.");

    return;
  }

  let price = null;

  if (priceInputValue !== "") {
    price = Number(priceInputValue);

    if (Number.isNaN(price) || price < 0) {
      alert("Please enter a valid price or leave it empty.");

      return;
    }
  }

  const existingCount = (portionsCache[menuItemId] || []).length;

  const payload = {
    portion_name,

    price,

    display_order: existingCount,
  };

  try {
    const response = await fetch(`${API_URL}/${menuItemId}/portions`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to add portion");
    }

    cancelAddPortion(menuItemId);

    await loadPortions(menuItemId);

    alert("✅ Portion added successfully!");
  } catch (error) {
    console.error("Add portion error:", error);

    alert("❌ " + error.message);
  }
}

// ===============================
// EDIT PORTION
// ===============================

function showEditPortionForm(menuItemId, portionId) {
  const form = document.getElementById(`edit-portion-form-${portionId}`);

  if (form) {
    form.style.display = "flex";
  }
}

function cancelEditPortion(portionId) {
  const form = document.getElementById(`edit-portion-form-${portionId}`);

  if (form) {
    form.style.display = "none";
  }
}

// ===============================
// UPDATE PORTION
// ===============================

async function updatePortion(portionId, menuItemId) {
  const nameInput = document.getElementById(`edit-portion-name-${portionId}`);

  const priceInput = document.getElementById(`edit-portion-price-${portionId}`);

  const row = document.querySelector(
    `.portion-item[data-portion-id="${portionId}"]`,
  );

  const portion_name = nameInput.value.trim();

  const priceInputValue = priceInput.value.trim();

  const display_order = row ? Number(row.dataset.displayOrder || 0) : 0;

  if (!portion_name) {
    alert("Please enter a portion name.");

    return;
  }

  let price = null;

  if (priceInputValue !== "") {
    price = Number(priceInputValue);

    if (Number.isNaN(price) || price < 0) {
      alert("Please enter a valid price or leave it empty.");

      return;
    }
  }

  const payload = {
    portion_name,

    price,

    display_order,
  };

  try {
    const response = await fetch(`${API_URL}/portions/${portionId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update portion");
    }

    await loadPortions(menuItemId);

    alert("✅ Portion updated successfully!");
  } catch (error) {
    console.error("Update portion error:", error);

    alert("❌ " + error.message);
  }
}

// ===============================
// DELETE PORTION
// ===============================

async function deletePortion(portionId, menuItemId) {
  if (!confirm("Delete this portion? This cannot be undone.")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/portions/${portionId}`, {
      method: "DELETE",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete portion");
    }

    await loadPortions(menuItemId);

    alert("✅ Portion deleted successfully!");
  } catch (error) {
    console.error("Delete portion error:", error);

    alert("❌ " + error.message);
  }
}

// ===============================
// REFRESH CATEGORIES
// ===============================

async function refreshCategories() {
  await loadCategories();

  /*
      Refresh category dropdowns
      inside currently rendered edit forms.
    */

  Object.values(menuItemsCache).forEach((item) => {
    const select = document.getElementById(`edit-category-${item.id}`);

    if (!select) return;

    select.innerHTML = buildCategoryOptionsHtml(item.category_name);

    select.value = item.category_name || "";
  });
}

// ===============================
// INITIALIZATION
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();

  await loadMenuItems();
});
