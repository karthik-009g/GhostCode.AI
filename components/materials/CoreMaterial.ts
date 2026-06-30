import * as THREE from "three";
import type { CoreMaterialConfig } from "@/types/material";
import { COLORS } from "@/constants/colors";

export const CORE_MATERIALS = {
  idle: {
    color: "#0A2030",
    transmission: 0.6,
    roughness: 0.12,
    ior: 1.5,
    metalness: 0.05,
    emissiveColor: COLORS.cyan.core,
    emissiveIntensity: 0.55,
    opacity: 0.95,
    energy: 1,
  },

  hover: {
    color: "#0A2030",
    transmission: 0.45,
    roughness: 0.08,
    ior: 1.5,
    metalness: 0.05,
    emissiveColor: COLORS.cyan.core,
    emissiveIntensity: 1.1,
    opacity: 0.95,
    energy: 1.5,
  },

  selected: {
    color: "#12384A",
    transmission: 0.35,
    roughness: 0.06,
    ior: 1.5,
    metalness: 0.08,
    emissiveColor: COLORS.cyan.core,
    emissiveIntensity: 1.6,
    opacity: 1,
    energy: 2,
  },

  corrupted: {
    color: "#2B1015",
    transmission: 0.15,
    roughness: 0.35,
    ior: 1.3,
    metalness: 0.2,
    emissiveColor: COLORS.ghost.core,
    emissiveIntensity: 2.2,
    opacity: 1,
    energy: 0,
  },
} as const satisfies Record<string, CoreMaterialConfig>;

export function createCoreMaterial(
  config: CoreMaterialConfig = CORE_MATERIALS.idle,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: config.color,
    transmission: config.transmission,
    roughness: config.roughness,
    ior: config.ior,
    metalness: config.metalness,
    emissive: config.emissiveColor,
    emissiveIntensity: config.emissiveIntensity,
    opacity: config.opacity,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: true,
  });
}

export function updateCoreMaterial(
  material: THREE.MeshPhysicalMaterial,
  config: Partial<CoreMaterialConfig>,
): void {
  if (config.color !== undefined)
    material.color.set(config.color);

  if (config.transmission !== undefined)
    material.transmission = config.transmission;

  if (config.roughness !== undefined)
    material.roughness = config.roughness;

  if (config.ior !== undefined)
    material.ior = config.ior;

  if (config.metalness !== undefined)
    material.metalness = config.metalness;

  if (config.emissiveColor !== undefined)
    material.emissive.set(config.emissiveColor);

  if (config.emissiveIntensity !== undefined)
    material.emissiveIntensity = config.emissiveIntensity;

  if (config.opacity !== undefined)
    material.opacity = config.opacity;

  material.needsUpdate = true;
}