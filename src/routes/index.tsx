import { createFileRoute, Link } from "@tanstack/react-router";
import heroTire from "@/assets/hero-tire.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SizeSearch } from "@/components/size-search";
import { TireCard } from "@/components/tire-card";
import { tires } from "@/data/tires";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PneuDepot — pneumatiky skladem pro osobní vozy, SUV i dodávky" },
      {
        name: "description",
        content:
          "Zimní, letní i celoroční pneumatiky skladem. Vyhledávání podle rozměru, odborná podpora a rychlé doručení po celé ČR.",
      },
      { property: "og:title", content: "PneuDepot — pneumatiky skladem" },
      {
        property: "og:description",
        content: "Vyberte pneumatiky podle rozměru a sezóny. Poradíme s výběrem i montáží.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const seasons = [
  {
    key: "zimni" as const,
    title: "Zimní",
    text: "Bezpečnost na sněhu a ledu od 7 °C níže. Povinné od 1. 11. do 31. 3.",
    accent: "border-winter/40 text-winter",
  },
  {
    key: "letni" as const,
    title: "Letní",
    text: "Kratší brzdná dráha a nižší spotřeba v teplých měsících.",
    accent: "border-summer/40 text-summer",
  },
  {
    key: "celorocni" as const,
    title: "Celoroční",
    text: "Kompromis pro nízké nájezdy a městský provoz bez přezouvání.",
    accent: "border-allseason/40 text-allseason",
  },
];

function Index() {
  const featured = tires.slice(0, 6);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroTire}
          alt="Pneumatika na mokrém asfaltu"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <p className="font-display text-sm uppercase tracking-[0.35em] text-primary">
            Více než 12 000 rozměrů
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-bold leading-[1.05] sm:text-6xl">
            Pneumatiky, které drží
            <span className="text-primary"> za každého počasí</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Zadejte rozměr z boku pneumatiky a během chvíle uvidíte jen to, co na vaše auto opravdu
            sedí. Skladové kusy odesíláme týž den.
          </p>
          <div className="mt-8 max-w-3xl">
            <SizeSearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Podle sezóny</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {seasons.map((s) => (
            <Link
              key={s.key}
              to="/katalog"
              search={{ sezona: s.key }}
              className={`rounded-xl border bg-card p-6 transition-colors hover:border-primary/60 ${s.accent}`}
            >
              <h3 className="text-2xl font-bold">{s.title} pneumatiky</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              <p className="mt-4 text-sm font-semibold text-primary">Zobrazit nabídku →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Vybrané modely</h2>
          <Link to="/katalog" className="text-sm font-semibold text-primary hover:underline">
            Celý katalog
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => (
            <TireCard key={t.slug} tire={t} />
          ))}
        </div>
      </section>

      <section className="border-t border-border surface-grid">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
          {[
            { t: "Doručení do 24 hodin", d: "Skladové pneumatiky expedujeme týž pracovní den." },
            { t: "Poradíme s výběrem", d: "Technická podpora na telefonu i e-mailu, Po–Pá 8–17." },
            { t: "Montáž u vás", d: "Síť partnerských pneuservisů po celé ČR." },
          ].map((item) => (
            <div key={item.t} className="rounded-lg border border-border bg-card/70 p-6">
              <h3 className="text-xl font-semibold normal-case">{item.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
