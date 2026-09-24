import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { Season, Tire } from "@/data/tires";

type Row = Database["public"]["Tables"]["tires"]["Row"];

export const rowToTire = (r: Row): Tire => ({
  id: r.id,
  slug: r.slug,
  brand: r.brand,
  model: r.model,
  width: r.width,
  profile: r.profile,
  diameter: r.diameter,
  loadIndex: r.load_index,
  speedIndex: r.speed_index,
  season: r.season as Season,
  price: r.price,
  stock: r.stock,
  fuel: r.fuel,
  wet: r.wet,
  noise: r.noise,
  category: r.category as Tire["category"],
});

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listTires = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("tires").select("*").order("created_at");
  if (error) {
    console.error(error);
    return [] as Tire[];
  }
  return data.map(rowToTire);
});

export const getTire = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("tires")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) console.error(error);
    return row ? rowToTire(row) : null;
  });
