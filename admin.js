const API_URL = "http://localhost:5000/api/menu";

// ===============================
// ADD MENU ITEM
// ===============================

async function addItem() {
  const item = {
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    price: Number(document.getElementById("price").value),
    image_url: document.getElementById("image").value.trim(),

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

    if (result.success) {
      message.innerHTML = "✅ Menu item added successfully!";
      message.style.color = "green";

      document.getElementById("name").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("image").value = "";

      // Reload menu
      loadMenuItems();
    } else {
      message.innerHTML = "❌ " + result.message;
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Add item error:", error);

    document.getElementById("message").innerHTML =
      "❌ Could not connect to server";

    document.getElementById("message").style.color = "red";
  }
}

// ===============================
// LOAD MENU ITEMS
// ===============================

async function loadMenuItems() {
  try {
    const response = await fetch(API_URL);

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to load menu");
    }

    const menuList = document.getElementById("menuList");

    menuList.innerHTML = "";

    result.data.forEach((item) => {
      const card = document.createElement("div");

      card.className = "menu-admin-card";

      card.innerHTML = `

                <img
                    src="${item.image_url || "https://picsum.photos/300"}"
                    alt="${item.name}"
                >

                <div class="menu-admin-info">

                    <h3>${item.name}</h3>

                    <p>
                        ${item.description || ""}
                    </p>

                    <strong>
                        ₹${item.price}
                    </strong>

                    <p>
                        ${item.is_available ? "✅ Available" : "❌ Unavailable"}
                    </p>

                    <button onclick="editItem('${item.id}')">
                        Edit
                    </button>

                    <button onclick="deleteItem('${item.id}')">
                        Delete
                    </button>

                </div>
            `;

      menuList.appendChild(card);
    });
  } catch (error) {
    console.error("Menu loading error:", error);

    document.getElementById("menuList").innerHTML =
      "<p>Could not load menu items.</p>";
  }
}

// ===============================
/// ===============================
// START
// ===============================

loadMenuItems();

// ===============================
// OPEN EDIT FORM
// ===============================

async function editItem(id) {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to load menu");
    }

    const item = result.data.find((menuItem) => menuItem.id === id);

    if (!item) {
      alert("Menu item not found");
      return;
    }

    // Fill edit form
    document.getElementById("editId").value = item.id;
    document.getElementById("editName").value = item.name || "";
    document.getElementById("editDescription").value = item.description || "";
    document.getElementById("editPrice").value = item.price || "";
    document.getElementById("editImage").value = item.image_url || "";

    document.getElementById("editAvailable").checked = item.is_available;

    document.getElementById("editBestseller").checked = item.is_bestseller;

    document.getElementById("editFeatured").checked = item.is_featured;

    // Show edit form
    document.getElementById("editCard").style.display = "block";

    // Scroll to edit form
    document.getElementById("editCard").scrollIntoView({
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Edit loading error:", error);
    alert("Could not load menu item");
  }
}

// ===============================
// CANCEL EDIT
// ===============================

function cancelEdit() {
  document.getElementById("editCard").style.display = "none";
}
// ===============================
// SAVE EDIT
// ===============================

async function saveEdit() {
  const id = document.getElementById("editId").value;

  const updatedItem = {
    name: document.getElementById("editName").value.trim(),
    description: document.getElementById("editDescription").value.trim(),
    price: Number(document.getElementById("editPrice").value),
    image_url: document.getElementById("editImage").value.trim(),

    is_available: document.getElementById("editAvailable").checked,
    is_bestseller: document.getElementById("editBestseller").checked,
    is_featured: document.getElementById("editFeatured").checked,
  };

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

    alert("✅ Menu item updated successfully!");

    // Hide edit form
    document.getElementById("editCard").style.display = "none";

    // Reload menu
    loadMenuItems();
  } catch (error) {
    console.error("Update error:", error);
    alert("❌ Could not update menu item");
  }
}
// ===============================
// DELETE MENU ITEM
// ===============================

async function deleteItem(id) {
  const confirmed = confirm("Are you sure you want to delete this menu item?");

  if (!confirmed) {
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

    alert("✅ Menu item deleted successfully!");

    loadMenuItems();
  } catch (error) {
    console.error("Delete error:", error);

    alert("❌ Could not delete menu item");
  }
}
