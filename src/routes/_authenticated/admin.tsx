import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { formatPrice, seasonLabels, tireSize, type Season, type Tire } from "@/data/tires";
import { rowToTire } from "@/lib/tires.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administrace produktů | PneuDepot" },
      { name: "description", content: "Správa produktů obchodu PneuDepot." },
      { property: "og:title", content: "Administrace | PneuDepot" },
      { property: "og:description", content: "Správa produktů." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Form = Omit<Tire, "id">;
const empty: Form = {
  slug: "", brand: "", model: "", width: 205, profile: 55, diameter: 16, loadIndex: "91",
  speedIndex: "V", season: "letni", price: 0, stock: 0, fuel: "C", wet: "B", noise: 70, category: "osobni",
};

const slugify = (f: Form) =>
  `${f.brand}-${f.model}-${f.width}-${f.profile}-r${f.diameter}`
    .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function AdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const [editing, setEditing] = useState<{ id: string | null; form: Form } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      return !!data;
    },
  });

  const list = useQuery({
    queryKey: ["admin-tires"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tires").select("*").order("brand");
      if (error) throw error;
      return data.map(rowToTire);
    },
    enabled: isAdmin.data === true,
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-tires"] });
    qc.invalidateQueries({ queryKey: ["tires"] });
  };

  const save = async () => {
    if (!editing) return;
    setError(null);
    const f = editing.form;
    const row = {
      slug: f.slug || slugify(f), brand: f.brand, model: f.model, width: f.width, profile: f.profile,
      diameter: f.diameter, load_index: f.loadIndex, speed_index: f.speedIndex, season: f.season,
      price: f.price, stock: f.stock, fuel: f.fuel, wet: f.wet, noise: f.noise, category: f.category,
    };
    const res = editing.id
      ? await supabase.from("tires").update(row).eq("id", editing.id)
      : await supabase.from("tires").insert(row);
    if (res.error) {
      setError(res.error.code === "23505" ? "Produkt se stejnou adresou (slug) už existuje." : "Uložení se nezdařilo.");
      return;
    }
    setEditing(null);
    refresh();
  };

  const remove = async (t: Tire) => {
    if (!confirm(`Smazat ${t.brand} ${t.model} ${tireSize(t)}?`)) return;
    await supabase.from("tires").delete().eq("id", t.id);
    refresh();
  };

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));

  const field = (label: string, k: keyof Form, type: "text" | "number" = "text") => (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <input
        className={inputClass}
        type={type}
        value={editing!.form[k] as string | number}
        onChange={(e) => set(k, (type === "number" ? Number(e.target.value) : e.target.value) as never)}
      />
    </label>
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold">Správa produktů</h1>
            <p className="text-sm text-muted-foreground">Přihlášen: {user.email}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin.data && (
              <button onClick={() => { setError(null); setEditing({ id: null, form: empty }); }} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                + Přidat produkt
              </button>
            )}
            <button onClick={signOut} className="rounded-md border border-border px-4 py-2 text-sm">Odhlásit</button>
          </div>
        </div>

        {isAdmin.isLoading && <p className="mt-8 text-muted-foreground">Načítám…</p>}
        {isAdmin.data === false && (
          <div className="mt-8 rounded-xl border border-border bg-card p-8">
            <p className="font-semibold">Tento účet nemá oprávnění správce.</p>
            <Link to="/" className="mt-3 inline-block text-sm text-primary">Zpět na web</Link>
          </div>
        )}

        {editing && (
          <div className="mt-8 rounded-xl border border-primary/50 bg-card p-5">
            <h2 className="text-2xl font-bold">{editing.id ? "Upravit produkt" : "Nový produkt"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {field("Značka", "brand")}
              {field("Model", "model")}
              {field("Šířka", "width", "number")}
              {field("Profil", "profile", "number")}
              {field("Průměr (R)", "diameter", "number")}
              {field("Index nosnosti", "loadIndex")}
              {field("Index rychlosti", "speedIndex")}
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">Sezóna</span>
                <select className={inputClass} value={editing.form.season} onChange={(e) => set("season", e.target.value as Season)}>
                  {Object.entries(seasonLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">Kategorie</span>
                <select className={inputClass} value={editing.form.category} onChange={(e) => set("category", e.target.value as Tire["category"])}>
                  <option value="osobni">Osobní</option>
                  <option value="suv">SUV</option>
                  <option value="dodavka">Dodávka</option>
                </select>
              </label>
              {field("Cena (Kč)", "price", "number")}
              {field("Skladem (ks)", "stock", "number")}
              {field("Štítek – spotřeba", "fuel")}
              {field("Štítek – mokro", "wet")}
              {field("Hlučnost (dB)", "noise", "number")}
              {field("Adresa (slug, nepovinné)", "slug")}
            </div>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={save} disabled={!editing.form.brand || !editing.form.model} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">Uložit</button>
              <button onClick={() => setEditing(null)} className="rounded-md border border-border px-4 py-2 text-sm">Zrušit</button>
            </div>
          </div>
        )}

        {list.data && (
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-card text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Produkt</th><th className="p-3">Rozměr</th><th className="p-3">Sezóna</th>
                  <th className="p-3 text-right">Cena</th><th className="p-3 text-right">Sklad</th><th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {list.data.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="p-3 font-medium">{t.brand} {t.model}</td>
                    <td className="p-3">{tireSize(t)} {t.loadIndex}{t.speedIndex}</td>
                    <td className="p-3">{seasonLabels[t.season]}</td>
                    <td className="p-3 text-right">{formatPrice(t.price)}</td>
                    <td className="p-3 text-right">{t.stock}</td>
                    <td className="whitespace-nowrap p-3 text-right">
                      <button onClick={() => { setError(null); const { id, ...form } = t; setEditing({ id, form }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="mr-3 text-primary hover:underline">Upravit</button>
                      <button onClick={() => remove(t)} className="text-destructive hover:underline">Smazat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
