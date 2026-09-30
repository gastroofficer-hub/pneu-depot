import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import heroTire from "@/assets/hero-tire.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatPrice, seasonLabels, tireSize, type Tire } from "@/data/tires";
import { tiresQuery } from "@/lib/tires-queries";
import { clearCompare, removeCompare, useCompare } from "@/lib/compare";

export const Route = createFileRoute("/porovnani")({
  head: () => ({
    meta: [
      { title: "Porovnání pneumatik | PneuDepot" },
      { name: "description", content: "Porovnejte ceny, rozměry, sezónu a štítek EU vybraných pneumatik vedle sebe." },
      { property: "og:title", content: "Porovnání pneumatik | PneuDepot" },
      { property: "og:description", content: "Přehledné srovnání vybraných pneumatik." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(tiresQuery),
  component: ComparePage,
});

const categoryLabels: Record<Tire["category"], string> = { osobni: "Osobní", suv: "SUV", dodavka: "Dodávka" };

type Row = { label: string; value: (t: Tire) => string | number; best?: (ts: Tire[]) => number | string };

const rows: Row[] = [
  { label: "Cena / ks", value: (t) => formatPrice(t.price), best: (ts) => formatPrice(Math.min(...ts.map((t) => t.price))) },
  { label: "Rozměr", value: (t) => tireSize(t) },
  { label: "Sezóna", value: (t) => seasonLabels[t.season] },
  { label: "Kategorie", value: (t) => categoryLabels[t.category] },
  { label: "Index nosnosti", value: (t) => t.loadIndex },
  { label: "Index rychlosti", value: (t) => t.speedIndex },
  { label: "Štítek – spotřeba", value: (t) => t.fuel, best: (ts) => ts.map((t) => t.fuel).sort()[0]! },
  { label: "Štítek – mokro", value: (t) => t.wet, best: (ts) => ts.map((t) => t.wet).sort()[0]! },
  { label: "Hlučnost", value: (t) => `${t.noise} dB`, best: (ts) => `${Math.min(...ts.map((t) => t.noise))} dB` },
  { label: "Skladem", value: (t) => (t.stock > 0 ? `${t.stock} ks` : "Na objednávku") },
];

function ComparePage() {
  const { data } = useSuspenseQuery(tiresQuery);
  const ids = useCompare();
  const selected = ids.map((s) => data.find((t) => t.slug === s)).filter((t): t is Tire => !!t);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-4xl font-bold">Porovnání pneumatik</h1>
          {selected.length > 0 && (
            <button onClick={clearCompare} className="text-sm text-muted-foreground hover:text-foreground">Vymazat vše</button>
          )}
        </div>

        {selected.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-semibold">Zatím nemáte nic k porovnání</p>
            <p className="mt-2 text-sm text-muted-foreground">V katalogu klikněte u pneumatik na „Porovnat“ (až 4 kusy).</p>
            <Link to="/katalog" className="mt-5 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Do katalogu</Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-card">
                  <th className="w-44 p-4" />
                  {selected.map((t) => (
                    <th key={t.slug} className="p-4 text-left align-top font-normal">
                      <img src={t.imageUrl ?? heroTire} alt="" className="aspect-[4/3] w-full rounded object-cover" />
                      <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{t.brand}</p>
                      <Link to="/pneumatika/$slug" params={{ slug: t.slug }} className="font-semibold hover:text-primary">{t.model}</Link>
                      <button onClick={() => removeCompare(t.slug)} className="mt-1 block text-xs text-destructive hover:underline">Odebrat</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const best = selected.length > 1 ? r.best?.(selected) : undefined;
                  return (
                    <tr key={r.label} className="border-t border-border">
                      <th className="p-4 text-left text-xs font-medium uppercase text-muted-foreground">{r.label}</th>
                      {selected.map((t) => {
                        const v = r.value(t);
                        return (
                          <td key={t.slug} className={`p-4 font-semibold ${best !== undefined && v === best ? "text-primary" : ""}`}>{v}</td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="border-t border-border p-3 text-xs text-muted-foreground">Nejlepší hodnota v řádku je zvýrazněna.</p>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
