import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-xl font-bold uppercase">
            Pneu<span className="text-primary">Depot</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pneumatiky pro osobní vozy, SUV i dodávky. Skladem, s odbornou podporou a servisem po celou
            dobu životnosti.
          </p>
        </div>
        <div className="flex gap-10 text-sm">
          <div className="space-y-2">
            <p className="font-semibold">Nákup</p>
            <Link to="/katalog" className="block text-muted-foreground hover:text-foreground">
              Katalog
            </Link>
            <Link to="/pruvodce" className="block text-muted-foreground hover:text-foreground">
              Poradna
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Pomoc</p>
            <Link to="/kontakt" className="block text-muted-foreground hover:text-foreground">
              Kontakt a podpora
            </Link>
            <span className="block text-muted-foreground">Po–Pá 8:00–17:00</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PneuDepot. Ukázkový obsah, ceny jsou ilustrativní.
      </div>
    </footer>
  );
}
