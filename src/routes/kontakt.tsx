import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Podpora a kontakt | PneuDepot" },
      {
        name: "description",
        content:
          "Zákaznická podpora PneuDepot: poradíme s výběrem rozměru, reklamací i montáží. Po–Pá 8:00–17:00.",
      },
      { property: "og:title", content: "Podpora a kontakt | PneuDepot" },
      {
        property: "og:description",
        content: "Napište nám nebo zavolejte, poradíme s výběrem i servisem pneumatik.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/kontakt" },
    ],
    links: [{ rel: "canonical", href: "/kontakt" }],
  }),
  component: Kontakt,
});

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none";

function Kontakt() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold">Podpora</h1>
          <p className="mt-3 text-muted-foreground">
            Nevíte si rady s rozměrem nebo řešíte reklamaci? Ozvěte se, odpovídáme zpravidla do
            několika hodin.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Telefon</dt>
              <dd className="text-lg font-semibold">(doplňte své číslo)</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">E-mail</dt>
              <dd className="text-lg font-semibold">(doplňte svůj e-mail)</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Provozní doba
              </dt>
              <dd className="text-lg font-semibold">Po–Pá 8:00–17:00</dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h2 className="text-2xl font-bold">Napište nám</h2>
          {sent ? (
            <p className="mt-4 rounded-md border border-primary/40 bg-primary/10 p-4 text-sm">
              Děkujeme, zprávu jsme zaznamenali. Odesílání e-mailů zatím není propojené, takže se
              nikam neodeslala.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              <input className={inputClass} placeholder="Jméno" required />
              <input className={inputClass} type="email" placeholder="E-mail" required />
              <input className={inputClass} placeholder="Rozměr pneumatiky, např. 205/55 R16" />
              <textarea className={`${inputClass} min-h-28`} placeholder="Zpráva" required />
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Odeslat dotaz
              </button>
            </div>
          )}
        </form>
      </div>
      <SiteFooter />
    </div>
  );
}
