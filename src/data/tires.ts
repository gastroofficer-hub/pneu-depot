export type Season = "zimni" | "letni" | "celorocni";

export type Tire = {
  slug: string;
  brand: string;
  model: string;
  width: number;
  profile: number;
  diameter: number;
  loadIndex: string;
  speedIndex: string;
  season: Season;
  price: number;
  stock: number;
  fuel: string;
  wet: string;
  noise: number;
  category: "osobni" | "suv" | "dodavka";
};

export const seasonLabels: Record<Season, string> = {
  zimni: "Zimní",
  letni: "Letní",
  celorocni: "Celoroční",
};

export const tires: Tire[] = [
  {
    slug: "michelin-pilot-sport-5-225-45-r17",
    brand: "Michelin",
    model: "Pilot Sport 5",
    width: 225,
    profile: 45,
    diameter: 17,
    loadIndex: "94",
    speedIndex: "Y",
    season: "letni",
    price: 3690,
    stock: 24,
    fuel: "B",
    wet: "A",
    noise: 71,
    category: "osobni",
  },
  {
    slug: "continental-wintercontact-ts870-205-55-r16",
    brand: "Continental",
    model: "WinterContact TS 870",
    width: 205,
    profile: 55,
    diameter: 16,
    loadIndex: "91",
    speedIndex: "H",
    season: "zimni",
    price: 2490,
    stock: 48,
    fuel: "C",
    wet: "B",
    noise: 70,
    category: "osobni",
  },
  {
    slug: "goodyear-vector-4seasons-gen3-195-65-r15",
    brand: "Goodyear",
    model: "Vector 4Seasons Gen-3",
    width: 195,
    profile: 65,
    diameter: 15,
    loadIndex: "91",
    speedIndex: "V",
    season: "celorocni",
    price: 2150,
    stock: 36,
    fuel: "B",
    wet: "B",
    noise: 69,
    category: "osobni",
  },
  {
    slug: "bridgestone-blizzak-6-225-40-r18",
    brand: "Bridgestone",
    model: "Blizzak 6",
    width: 225,
    profile: 40,
    diameter: 18,
    loadIndex: "92",
    speedIndex: "V",
    season: "zimni",
    price: 4290,
    stock: 12,
    fuel: "C",
    wet: "A",
    noise: 72,
    category: "osobni",
  },
  {
    slug: "nokian-seasonproof-suv-235-55-r18",
    brand: "Nokian",
    model: "Seasonproof SUV",
    width: 235,
    profile: 55,
    diameter: 18,
    loadIndex: "104",
    speedIndex: "V",
    season: "celorocni",
    price: 3980,
    stock: 18,
    fuel: "C",
    wet: "B",
    noise: 71,
    category: "suv",
  },
  {
    slug: "pirelli-scorpion-verde-235-60-r18",
    brand: "Pirelli",
    model: "Scorpion Verde",
    width: 235,
    profile: 60,
    diameter: 18,
    loadIndex: "103",
    speedIndex: "W",
    season: "letni",
    price: 4450,
    stock: 9,
    fuel: "B",
    wet: "A",
    noise: 70,
    category: "suv",
  },
  {
    slug: "barum-polaris-5-185-65-r15",
    brand: "Barum",
    model: "Polaris 5",
    width: 185,
    profile: 65,
    diameter: 15,
    loadIndex: "88",
    speedIndex: "T",
    season: "zimni",
    price: 1490,
    stock: 64,
    fuel: "D",
    wet: "B",
    noise: 71,
    category: "osobni",
  },
  {
    slug: "hankook-vantra-ls-215-65-r16c",
    brand: "Hankook",
    model: "Vantra LT",
    width: 215,
    profile: 65,
    diameter: 16,
    loadIndex: "109",
    speedIndex: "T",
    season: "letni",
    price: 2890,
    stock: 21,
    fuel: "C",
    wet: "B",
    noise: 72,
    category: "dodavka",
  },
  {
    slug: "dunlop-sport-maxx-rt2-245-40-r19",
    brand: "Dunlop",
    model: "Sport Maxx RT2",
    width: 245,
    profile: 40,
    diameter: 19,
    loadIndex: "98",
    speedIndex: "Y",
    season: "letni",
    price: 5190,
    stock: 6,
    fuel: "C",
    wet: "A",
    noise: 71,
    category: "osobni",
  },
  {
    slug: "kleber-quadraxer-3-205-60-r16",
    brand: "Kleber",
    model: "Quadraxer 3",
    width: 205,
    profile: 60,
    diameter: 16,
    loadIndex: "92",
    speedIndex: "H",
    season: "celorocni",
    price: 2290,
    stock: 30,
    fuel: "C",
    wet: "B",
    noise: 70,
    category: "osobni",
  },
  {
    slug: "michelin-agilis-crossclimate-225-65-r16c",
    brand: "Michelin",
    model: "Agilis CrossClimate",
    width: 225,
    profile: 65,
    diameter: 16,
    loadIndex: "112",
    speedIndex: "R",
    season: "celorocni",
    price: 4090,
    stock: 15,
    fuel: "B",
    wet: "B",
    noise: 72,
    category: "dodavka",
  },
  {
    slug: "continental-premiumcontact-7-205-55-r16",
    brand: "Continental",
    model: "PremiumContact 7",
    width: 205,
    profile: 55,
    diameter: 16,
    loadIndex: "91",
    speedIndex: "V",
    season: "letni",
    price: 2790,
    stock: 42,
    fuel: "B",
    wet: "A",
    noise: 70,
    category: "osobni",
  },
];

export const widths = [...new Set(tires.map((t) => t.width))].sort((a, b) => a - b);
export const profiles = [...new Set(tires.map((t) => t.profile))].sort((a, b) => a - b);
export const diameters = [...new Set(tires.map((t) => t.diameter))].sort((a, b) => a - b);
export const brands = [...new Set(tires.map((t) => t.brand))].sort();

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(
    value,
  );

export const tireSize = (t: Tire) => `${t.width}/${t.profile} R${t.diameter}`;
