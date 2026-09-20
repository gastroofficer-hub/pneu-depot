import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import heroTire from "@/assets/hero-tire.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatPrice, seasonLabels, tireSize, tires } from "@/data/tires";

export const Route = createFileRoute("/pneumatika/$slug")({
  loader: ({ params }) => {
    const tire = tires.find((t) => t.slug === params.slug);
    if (!tire) throw notFound();
    return { tire };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Pneumatika nenalezena | PneuDepot" }, { name: "robots", content: "noindex" }],
      };
    }
    const { tire } = loaderData;
    const title = `${tire.brand} ${tire.model} ${tireSize(tire)} | PneuDepot`;
    const description = `${seasonLabels[tire.season]} pneumatika ${tire.brand} ${tire.model} v rozměru ${tireSize(tire)} ${tire.loadIndex}${tire.speedIndex}. Cena ${formatPrice(tire.price)}, skladem.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/pneumatika/${tire.slug}` },
      ],
      links: [{ rel: "canonical", href: `/pneumatika/${tire.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${tire.brand} ${tire.model} ${tireSize(tire)}`,
            brand: { "@type": "Brand", name: tire.brand },
            offers: {
              "@type": "Offer",
              price: tire.price,
              priceCurrency: "CZK",
              availability:
                tire.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            },
          }),
        },
      ],
    };
  },
  component: TireDetail,
});

function TireDetail() {
  const { tire } = Route.useLoaderData();
  const related = tires.filter((t) => t.slug !== tire.slug && t.season === tire.season).slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Link to="/katalog" className="text-sm text-muted-foreground hover:text-foreground">
          ← Zpět do katalogu
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <img
            src={heroTire}
            alt={`${tire.brand} ${tire.model}`}
            loading="lazy"
            width={1600}
            height={1104}
            className="w-full rounded-xl border border-border object-cover"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{tire.brand}</p>
            <h1 className="mt-2 text-4xl font-bold normal-case">{tire.model}</h1>
            <p className="mt-2 font-display text-2xl text-primary">
              {tireSize(tire)} {tire.loadIndex}
              {tire.speedIndex} · {seasonLabels[tire.season]}
            </p>
            <p className="mt-6 font-display text-4xl font-bold">{formatPrice(tire.price)}</p>
            <p className="text-sm text-muted-foreground">cena za 1 ks včetně DPH</p>

            <div className="mt-6 rounded-lg border border-border bg-card p-5 text-sm">
              <p className="font-semibold">
                {tire.stock > 0 ? `Skladem ${tire.stock} ks` : "Na objednávku"}
              </p>
              <p className="mt-1 text-muted-foreground">
                Nákup zatím probíhá po telefonu nebo e-mailem — objednávkový systém připravujeme.
              </p>
              <Link
                to="/kontakt"
                className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Poptat tento rozměr
              </Link>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Kategorie", tire.category],
                ["Štítek EU – spotřeba", tire.fuel],
                ["Štítek EU – mokro", tire.wet],
                ["Hlučnost", `${tire.noise} dB`],
              ].map(([k, v]) => (
                <div key={k} className="rounded border border-border px-3 py-2">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-semibold capitalize">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold">Podobné pneumatiky</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  to="/pneumatika/$slug"
                  params={{ slug: t.slug }}
                  className="rounded-lg border border-border bg-card p-4 hover:border-primary/60"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.brand}</p>
                  <p className="mt-1 font-semibold">{t.model}</p>
                  <p className="text-sm text-primary">{tireSize(t)}</p>
                  <p className="mt-2 font-display text-lg">{formatPrice(t.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
