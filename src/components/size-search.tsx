import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { diameters, profiles, widths } from "@/data/tires";

const selectClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none";

export function SizeSearch() {
  const navigate = useNavigate();
  const [width, setWidth] = useState("");
  const [profile, setProfile] = useState("");
  const [diameter, setDiameter] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({
          to: "/katalog",
          search: {
            ...(width ? { sirka: Number(width) } : {}),
            ...(profile ? { profil: Number(profile) } : {}),
            ...(diameter ? { prumer: Number(diameter) } : {}),
          },
        });
      }}
      className="rounded-xl border border-border bg-card/80 p-5 shadow-glow backdrop-blur"
    >
      <p className="font-display text-sm uppercase tracking-[0.25em] text-primary">
        Vyhledávání podle rozměru
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">Šířka</span>
          <select className={selectClass} value={width} onChange={(e) => setWidth(e.target.value)}>
            <option value="">Vše</option>
            {widths.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">Profil</span>
          <select className={selectClass} value={profile} onChange={(e) => setProfile(e.target.value)}>
            <option value="">Vše</option>
            {profiles.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">Průměr</span>
          <select className={selectClass} value={diameter} onChange={(e) => setDiameter(e.target.value)}>
            <option value="">Vše</option>
            {diameters.map((d) => (
              <option key={d} value={d}>
                R{d}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="mt-auto rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Zobrazit pneu
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Rozměr najdete na boku pneumatiky, např. 205/55 R16.
      </p>
    </form>
  );
}
