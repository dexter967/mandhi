import supabase from "./config/supabase.js";

async function testConnection() {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.log("❌ Error:", error.message);
    return;
  }

  console.log("✅ Connected to Supabase!");
  console.log(data);
}

testConnection();
