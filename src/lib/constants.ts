export const CATEGORY_COLUMNS: Record<string, string[]> = {
  abs: ["vicatSofteningTemp", "izodImpact", "mfi220_10"],
  san: ["mfi220_10", "charpyImpact", "vicatTemp"],
  "gpps-hips": ["mfi200_5", "vicatTemp", "izodImpact"],
  "ps-pe": ["mfi200_5", "izodImpact", "vicatATemp"],
  "pc-abs": ["mfi260_5", "izodImpact", "vicatB120Temp"],
  "eps": ["particleSizeRange", "blowingAgent", "densityRange"],
};

export const PROPERTY_LABELS: Record<string, string> = {
  vicatSofteningTemp: "Vicat B 50N-50°C/h (°C)",
  vicatTemp: "Vicat (°C)",
  vicatATemp: "Vicat A (°C)",
  vicatB120Temp: "Vicat B 120°C/h (°C)",
  mfi220_10: "MFI 220°C/10kg (g/10')",
  mfi200_5: "MFI 200°C/5kg (g/10')",
  mfi260_5: "MFI 260°C/5kg (g/10')",
  izodImpact: "Izod Impact (kJ/m²)",
  charpyImpact: "Charpy Impact (kJ/m²)",
  particleSizeRange: "Particle Size (mm)",
  blowingAgent: "Blowing Agent",
  densityRange: "Density Range (kg/m³)",
};

export const ALL_NUMERIC_PROPERTIES = [
  "vicatSofteningTemp",
  "vicatTemp",
  "vicatATemp",
  "vicatB120Temp",
  "mfi220_10",
  "mfi200_5",
  "mfi260_5",
  "izodImpact",
  "charpyImpact",
] as const;

export const ALL_STRING_PROPERTIES = [
  "particleSizeRange",
  "blowingAgent",
  "densityRange",
] as const;
