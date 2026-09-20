import { Link } from "@tanstack/react-router";
import { formatPrice, seasonLabels, tireSize, type Tire } from "@/data/tires";

const seasonClass: Record<Tire["season"], string> = {
  zimni: "text-winter border-winter/40 bg-winter/10",
  letni: "text-summer border-summer/40 bg-summer/10",
  celorocni: "text-allseason border-allseason/40 bg-allseason/10",
};

export function TireCard({ tire }: { tire: Tire }) {
  return (
    <Link
      to="/pneumatika/$slug"
      params={{ slug: tire.slug }}
      className="group flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/60"
    >
      <div>
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
        <span className="text-sm font-medium text-primary group-hover:underline">Detail</span>
      </div>
    </Link>
  );
}
