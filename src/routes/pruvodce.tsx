import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/pruvodce")({
  head: () => ({
    meta: [
      { title: "Poradna — jak vybrat pneumatiky | PneuDepot" },
      {
        name: "description",
        content:
          "Jak číst rozměr pneumatiky, kdy přezouvat, co znamená index nosnosti a rychlosti a jak se orientovat ve štítku EU.",
      },
      { property: "og:title", content: "Poradna — jak vybrat pneumatiky" },
      {
        property: "og:description",
        content: "Rozměry, sezóny, indexy a štítek EU vysvětlené srozumitelně.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/pruvodce" },
    ],
    links: [{ rel: "canonical", href: "/pruvodce" }],
  }),
  component: Pruvodce,
});

const articles = [
  {
    title: "Jak přečíst rozměr 205/55 R16 91V",
    text: "205 je šířka v milimetrech, 55 je výška boku v procentech šířky, R16 je průměr ráfku v palcích. 91 je index nosnosti (615 kg na kolo) a V maximální rychlost 240 km/h.",
  },
  {
    title: "Kdy přezouvat",
    text: "Orientačním bodem je teplota 7 °C. Pod ní tvrdne letní směs a prodlužuje se brzdná dráha. V ČR je zimní obutí povinné od 1. listopadu do 31. března, pokud je na silnici sníh, led nebo námraza.",
  },
  {
    title: "Kdy dávají smysl celoroční pneumatiky",
    text: "Při nájezdu zhruba do 12 000 km ročně, převážně městském provozu a v nížinách. Pro horské oblasti a dálniční nájezdy doporučujeme sezónní sady.",
  },
  {
    title: "Štítek EU v kostce",
    text: "Tři údaje: valivý odpor (spotřeba), přilnavost za mokra (brzdná dráha) a hlučnost v decibelech. Rozdíl mezi třídou A a C za mokra znamená až o několik metrů delší brzdnou dráhu.",
  },
  {
    title: "Jak dlouho pneumatika vydrží",
    text: "Zákonné minimum dezénu je 1,6 mm, u zimních doporučujeme vyměnit pod 4 mm. Stáří nad 6 let hlídejte i u málo ojetých kusů podle DOT kódu na boku.",
  },
];

function Pruvodce() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-bold">Poradna</h1>
        <p className="mt-3 text-muted-foreground">
          Nejčastější dotazy zákazníků k výběru, sezónám a údržbě pneumatik.
        </p>
        <div className="mt-8 space-y-4">
          {articles.map((a) => (
            <article key={a.title} className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-2xl font-bold normal-case">{a.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
            </article>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
