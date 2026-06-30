import type { GlassMaterialConfig } from "@/types/material";

export const GlassMaterial: GlassMaterialConfig = {
  // Optical properties
  transmission: 0.82,
  roughness: 0.12,
  ior: 1.45,
  metalness: 0,

  // Internal glow
  emissiveColor: "#00B8D4",
  emissiveIntensity: 0.18,

  // Transparency
  opacity: 0.9,

  // Base tint
  color: "#102A38",
};

export const GlassMaterialHover: GlassMaterialConfig = {
  ...GlassMaterial,

  // brighter glow
  emissiveIntensity: 0.38,

  // slightly less transparent
  transmission: 0.72,

  // slightly brighter tint
  color: "#123545",
};

export const GlassMaterialSelected: GlassMaterialConfig = {
  ...GlassMaterial,

  emissiveIntensity: 0.55,

  transmission: 0.65,

  opacity: 0.95,

  color: "#16445A",
};