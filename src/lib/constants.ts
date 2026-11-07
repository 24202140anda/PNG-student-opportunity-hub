export const CATEGORIES = [
  "Scholarship",
  "Study Program",
  "Internship",
  "Graduate Job",
  "Apprenticeship",
  "Volunteer",
];

export const ORG_TYPES = [
  "Government",
  "University",
  "College",
  "NGO",
  "Private Company",
  "International Provider",
];

export const PROVINCES = [
  "Bougainville",
  "Central",
  "Chimbu",
  "East New Britain",
  "East Sepik",
  "Eastern Highlands",
  "Enga",
  "Gulf",
  "Hela",
  "Jiwaka",
  "Madang",
  "Manus",
  "Milne Bay",
  "Morobe",
  "National Capital District",
  "New Ireland",
  "Oro",
  "Sandaun",
  "Southern Highlands",
  "West New Britain",
  "Western",
  "Western Highlands",
];
export const OPP_PROVINCES = ["Nationwide", "International", ...PROVINCES];

export const COLORS = {
  primary: "#0B6E4F",
  dark: "#064E3B",
  accent: "#F2B705",
  bg: "#F4F6F5",
  card: "#FFFFFF",
  text: "#1B1F23",
  muted: "#6B7280",
  border: "#E5E7EB",
  danger: "#C62828",
  warn: "#B7791F",
  soft: "#E6F4EE",
};

export const CATEGORY_COLORS: Record<string, { bg: string; fg: string }> = {
  Scholarship: { bg: "#E6F4EE", fg: "#0B6E4F" },
  "Study Program": { bg: "#E8F0FE", fg: "#1D4ED8" },
  Internship: { bg: "#FEF3C7", fg: "#92400E" },
  "Graduate Job": { bg: "#F3E8FF", fg: "#6B21A8" },
  Apprenticeship: { bg: "#FFE4E6", fg: "#9F1239" },
  Volunteer: { bg: "#E0F2FE", fg: "#0369A1" },
};
