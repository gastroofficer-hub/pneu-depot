export type Season = "zimni" | "letni" | "celorocni";

export type Tire = {
  id: string;
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

// Standardní rozměry pro vyhledávání podle rozměru
export const widths = [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285];
export const profiles = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
export const diameters = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(
    value,
  );

export const tireSize = (t: Tire) => `${t.width}/${t.profile} R${t.diameter}`;
