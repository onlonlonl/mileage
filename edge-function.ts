import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const resource = pathParts[1] || "items";
  const id = pathParts[2] || null;

  try {
    // GET /items
    if (req.method === "GET" && resource === "items") {
      const { data, error } = await supabase
        .from("mileage_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    // POST /items
    if (req.method === "POST" && resource === "items") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("mileage_items")
        .insert({
          name: body.name,
          price: body.price,
          purchased_at: body.purchased_at,
          scene: body.scene || null,
          for_lux: body.for_lux || false,
        })
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data, 201);
    }

    // PATCH /items/:id
    if (req.method === "PATCH" && resource === "items" && id) {
      const body = await req.json();
      const { data, error } = await supabase
        .from("mileage_items")
        .update(body)
        .eq("id", id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }

    // DELETE /items/:id
    if (req.method === "DELETE" && resource === "items" && id) {
      const { error } = await supabase
        .from("mileage_items")
        .delete()
        .eq("id", id);
      if (error) return json({ error: error.message }, 400);
      return json({ deleted: true });
    }

    return json({ error: "Not found" }, 404);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
