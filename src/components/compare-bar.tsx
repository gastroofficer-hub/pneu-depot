import { Link } from "@tanstack/react-router";
import { clearCompare, MAX_COMPARE, useCompare } from "@/lib/compare";

export function CompareBar() {
  const ids = useCompare();
  if (ids.length === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex items-center gap-4 rounded-full border border-primary/50 bg-card/95 px-5 py-3 shadow-glow backdrop-blur">
        <span className="text-sm">
          Porovnání: <strong>{ids.length}</strong> / {MAX_COMPARE}
        </span>
        <button onClick={clearCompare} className="text-sm text-muted-foreground hover:text-foreground">
          Vymazat
        </button>
        <Link to="/porovnani" className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
          Porovnat
        </Link>
      </div>
    </div>
  );
}
