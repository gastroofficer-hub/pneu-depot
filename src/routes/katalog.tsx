import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TireCard } from "@/components/tire-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { seasonLabels, type Season } from "@/data/tires";
import { tiresQuery } from "@/lib/tires-queries";

type CatalogSearch = {
  sirka?: number | undefined;
  profil?: number | undefined;
  prumer?: number | undefined;
  sezona?: Season | undefined;
  znacka?: string | undefined;
};

const seasons: Season[] = ["zimni", "letni", "celorocni"];

export const Route = createFileRoute("/katalog")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    ...(search["sirka"] ? { sirka: Number(search["sirka"]) } : {}),
    ...(search["profil"] ? { profil: Number(search["profil"]) } : {}),
    ...(search["prumer"] ? { prumer: Number(search["prumer"]) } : {}),
    ...(seasons.includes(search["sezona"] as Season)
      ? { sezona: search["sezona"] as Season }
      : {}),
    ...(typeof search["znacka"] === "string" ? { znacka: search["znacka"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Katalog pneumatik — zimní, letní i celoroční | PneuDepot" },
      {
        name: "description",
        content:
          "Filtrujte pneumatiky podle rozměru, sezóny a značky. Ceny, dostupnost a parametry štítku EU přehledně na jednom místě.",
      },
      { property: "og:title", content: "Katalog pneumatik | PneuDepot" },
      {
        property: "og:description",
        content: "Zimní, letní a celoroční pneumatiky s filtrem podle rozměru a značky.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/katalog" },
    ],
    links: [{ rel: "canonical", href: "/katalog" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(tiresQuery),
  component: Katalog,
});

const selectClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function Katalog() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/katalog" });

  const update = (patch: CatalogSearch) =>
    navigate({ search: (prev: CatalogSearch) => ({ ...prev, ...patch }) });

  const { data: tires } = useSuspenseQuery(tiresQuery);
  const uniq = <T,>(xs: T[]) => [...new Set(xs)].sort() as T[];
  const num = (xs: number[]) => [...new Set(xs)].sort((a, b) => a - b);
  const widths = num(tires.map((t) => t.width));
  const profiles = num(tires.map((t) => t.profile));
  const diameters = num(tires.map((t) => t.diameter));
  const brands = uniq(tires.map((t) => t.brand));

  const results = tires.filter(
    (t) =>
      (!search.sirka || t.width === search.sirka) &&
      (!search.profil || t.profile === search.profil) &&
      (!search.prumer || t.diameter === search.prumer) &&
      (!search.sezona || t.season === search.sezona) &&
      (!search.znacka || t.brand === search.znacka),
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl font-bold">Katalog pneumatik</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {results.length} produktů odpovídá zvolenému filtru.
        </p>

        <div className="mt-8 grid gap-3 rounded-xl border border-border bg-card p-5 sm:grid-cols-3 lg:grid-cols-5">
          <label>
            <span className="mb-1 block text-xs text-muted-foreground">Šířka</span>
            <select
              className={selectClass}
              value={search.sirka ?? ""}
              onChange={(e) =>
                update({ sirka: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">Vše</option>
              {widths.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-muted-foreground">Profil</span>
            <select
              className={selectClass}
              value={search.profil ?? ""}
              onChange={(e) =>
                update({ profil: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">Vše</option>
              {profiles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-muted-foreground">Průměr</span>
            <select
              className={selectClass}
              value={search.prumer ?? ""}
              onChange={(e) =>
                update({ prumer: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">Vše</option>
              {diameters.map((d) => (
                <option key={d} value={d}>
                  R{d}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-muted-foreground">Sezóna</span>
            <select
              className={selectClass}
              value={search.sezona ?? ""}
              onChange={(e) =>
                update({ sezona: (e.target.value || undefined) as Season | undefined })
              }
            >
              <option value="">Vše</option>
              {seasons.map((s) => (
                <option key={s} value={s}>
                  {seasonLabels[s]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-muted-foreground">Značka</span>
            <select
              className={selectClass}
              value={search.znacka ?? ""}
              onChange={(e) => update({ znacka: e.target.value || undefined })}
            >
              <option value="">Vše</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-semibold">Pro tento filtr nemáme nic skladem</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Zkuste uvolnit některý z filtrů nebo nám napište, rozměr rádi doobjednáme.
            </p>
            <button
              onClick={() => navigate({ search: {} })}
              className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Zrušit filtry
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <TireCard key={t.slug} tire={t} />
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
