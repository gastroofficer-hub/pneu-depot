import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/katalog", label: "Katalog" },
  { to: "/pruvodce", label: "Poradna" },
  { to: "/kontakt", label: "Podpora" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl font-bold tracking-wide uppercase">
          Pneu<span className="text-primary">Depot</span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/katalog"
            className="ml-2 hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Vybrat pneu
          </Link>
        </nav>
      </div>
    </header>
  );
}
