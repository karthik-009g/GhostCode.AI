import * as THREE from "three";
import type { GhostMaterialConfig } from "@/types/material";
import { COLORS } from "@/constants/colors";

export const GHOST_MATERIALS = {
  dormant: {
    color: "#2A0808",
    transmission: 0.5,
    roughness: 0.15,
    emissiveColor: COLORS.ghost.core,
    emissiveIntensity: 0.4,
    opacity: 0.6,
    pulse: 0,
    corruption: 0,
  },

  idle: {
    color: "#2A0808",
    transmission: 0.35,
    roughness: 0.12,
    emissiveColor: COLORS.ghost.core,
    emissiveIntensity: 1,
    opacity: 0.88,
    pulse: 1,
    corruption: 0,
  },

  hover: {
    color: "#3A0A0A",
    transmission: 0.25,
    roughness: 0.08,
    emissiveColor: COLORS.ghost.core,
    emissiveIntensity: 1.8,
    opacity: 0.92,
    pulse: 1.5,
    corruption: 0.2,
  },

  attack: {
    color: "#500000",
    transmission: 0.15,
    roughness: 0.05,
    emissiveColor: COLORS.ghost.glow,
    emissiveIntensity: 2.8,
    opacity: 1,
    pulse: 3,
    corruption: 1,
  },

  recovering: {
    color: "#401010",
    transmission: 0.3,
    roughness: 0.1,
    emissiveColor: COLORS.ghost.core,
    emissiveIntensity: 0.8,
    opacity: 0.8,
    pulse: 0.5,
    corruption: 0.3,
  },
} as const satisfies Record<string, GhostMaterialConfig>;

export function createGhostMaterial(
  config: GhostMaterialConfig = GHOST_MATERIALS.idle,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: config.color,
    transmission: config.transmission,
    roughness: config.roughness,
    metalness: 0,
    emissive: config.emissiveColor,
    emissiveIntensity: config.emissiveIntensity,
    opacity: config.opacity,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
  });
}

export function updateGhostMaterial(
  material: THREE.MeshPhysicalMaterial,
  config: Partial<GhostMaterialConfig>,
): void {
  if (config.color !== undefined)
    material.color.set(config.color);

  if (config.transmission !== undefined)
    material.transmission = config.transmission;

  if (config.roughness !== undefined)
    material.roughness = config.roughness;

  if (config.emissiveColor !== undefined)
    material.emissive.set(config.emissiveColor);

  if (config.emissiveIntensity !== undefined)
    material.emissiveIntensity = config.emissiveIntensity;

  if (config.opacity !== undefined)
    material.opacity = config.opacity;

  material.needsUpdate = true;
}

export function lerpGhostIntensity(
  a: number,
  b: number,
  t: number,
): number {
  return a + (b - a) * t;
}