import * as THREE from "three";
import type { BoundaryMaterialConfig } from "@/types/material";
import { COLORS } from "@/constants/colors";

export const BOUNDARY_MATERIALS = {
  idle: {
    color: COLORS.cyan.faint,
    emissiveColor: COLORS.cyan.faint,
    emissiveIntensity: 0.08,
    opacity: 0.12,
    wireframe: false,
    thickness: 1,
  },

  active: {
    color: COLORS.cyan.dim,
    emissiveColor: COLORS.cyan.dim,
    emissiveIntensity: 0.22,
    opacity: 0.22,
    wireframe: false,
    thickness: 1,
  },

  breached: {
    color: COLORS.ghost.ambient,
    emissiveColor: COLORS.ghost.core,
    emissiveIntensity: 0.35,
    opacity: 0.18,
    wireframe: false,
    thickness: 1,
  },

  recovering: {
    color: COLORS.cyan.dim,
    emissiveColor: COLORS.cyan.core,
    emissiveIntensity: 0.15,
    opacity: 0.16,
    wireframe: false,
    thickness: 1,
  },

  debug: {
    color: COLORS.cyan.faint,
    emissiveColor: COLORS.cyan.faint,
    emissiveIntensity: 0.05,
    opacity: 0.08,
    wireframe: true,
    thickness: 1,
  },
} as const satisfies Record<string, BoundaryMaterialConfig>;

export function createBoundaryMaterial(
  config: BoundaryMaterialConfig = BOUNDARY_MATERIALS.idle,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: config.color,
    emissive: config.emissiveColor,
    emissiveIntensity: config.emissiveIntensity,
    opacity: config.opacity,
    transparent: true,
    wireframe: config.wireframe,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function createBoundaryEdgeMaterial(
  config: BoundaryMaterialConfig = BOUNDARY_MATERIALS.idle,
): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: config.emissiveColor,
    opacity: config.opacity * 1.4,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function updateBoundaryMaterial(
  material: THREE.MeshStandardMaterial,
  config: Partial<BoundaryMaterialConfig>,
): void {
  if (config.color !== undefined)
    material.color.set(config.color);

  if (config.emissiveColor !== undefined)
    material.emissive.set(config.emissiveColor);

  if (config.emissiveIntensity !== undefined)
    material.emissiveIntensity = config.emissiveIntensity;

  if (config.opacity !== undefined)
    material.opacity = config.opacity;

  if (config.wireframe !== undefined)
    material.wireframe = config.wireframe;

  material.needsUpdate = true;
}

export function getBreachIntensity(
  baseIntensity: number,
  time: number,
  attackProgress: number,
): number {
  const flicker = 0.7 + 0.3 * Math.sin(time * 8.5);
  return baseIntensity + attackProgress * 0.8 * flicker;
}

export function getRecoveryIntensity(
  baseIntensity: number,
  time: number,
): number {
  return baseIntensity + Math.sin(time * 2) * 0.05;
}