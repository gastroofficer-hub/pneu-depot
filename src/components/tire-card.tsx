import { Link } from "@tanstack/react-router";
import heroTire from "@/assets/hero-tire.jpg";
import { Snowflake, Sun, Scale } from "lucide-react";
import { MAX_COMPARE, toggleCompare, useCompare } from "@/lib/compare";
import { formatPrice, seasonLabels, tireSize, type Tire } from "@/data/tires";

const seasonClass: Record<Tire["season"], string> = {
  zimni: "text-winter border-winter/40 bg-winter/10",
  letni: "text-summer border-summer/40 bg-summer/10",
  celorocni: "text-allseason border-allseason/40 bg-allseason/10",
};

export function TireCard({ tire }: { tire: Tire }) {
  const ids = useCompare();
  const inCompare = ids.includes(tire.slug);
  const full = !inCompare && ids.length >= MAX_COMPARE;
  return (
    <Link
      to="/pneumatika/$slug"
      params={{ slug: tire.slug }}
      className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:border-primary/60 hover:shadow-glow"
    >
      <span aria-hidden className="smoke pointer-events-none">
        <i /><i /><i /><i /><i />
      </span>
      <div className="relative">
        <div className="relative -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-lg">
        <img
          src={tire.imageUrl ?? heroTire}
          alt={`${tire.brand} ${tire.model}`}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 flex gap-1.5" aria-label={seasonLabels[tire.season]}>
          {(tire.season === "zimni" || tire.season === "celorocni") && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-winter/50 bg-background/80 text-winter backdrop-blur">
              <Snowflake className="h-5 w-5" />
            </span>
          )}
          {(tire.season === "letni" || tire.season === "celorocni") && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-summer/50 bg-background/80 text-summer backdrop-blur">
              <Sun className="h-5 w-5" />
            </span>
          )}
        </div>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span
            className={`rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${seasonClass[tire.season]}`}
          >
            {seasonLabels[tire.season]}
          </span>
          <span className="text-xs text-muted-foreground">
            {tire.stock > 0 ? `Skladem ${tire.stock} ks` : "Na objednávku"}
          </span>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">{tire.brand}</p>
        <h3 className="mt-1 text-xl font-semibold normal-case">{tire.model}</h3>
        <p className="mt-1 font-display text-lg text-primary">
          {tireSize(tire)} {tire.loadIndex}
          {tire.speedIndex}
        </p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
          <div className="rounded border border-border py-2">
            <dt>Spotřeba</dt>
            <dd className="text-sm font-semibold text-foreground">{tire.fuel}</dd>
          </div>
          <div className="rounded border border-border py-2">
            <dt>Mokro</dt>
            <dd className="text-sm font-semibold text-foreground">{tire.wet}</dd>
          </div>
          <div className="rounded border border-border py-2">
            <dt>Hluk</dt>
            <dd className="text-sm font-semibold text-foreground">{tire.noise} dB</dd>
          </div>
        </dl>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <span className="font-display text-2xl font-bold">{formatPrice(tire.price)}</span>
        <button
          type="button"
          disabled={full}
          title={full ? `Porovnat lze max. ${MAX_COMPARE} pneumatiky` : undefined}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(tire.slug);
          }}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-40 ${inCompare ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
        >
          <Scale className="h-3.5 w-3.5" />
          {inCompare ? "V porovnání" : "Porovnat"}
        </button>
      </div>
    </Link>
  );
}
