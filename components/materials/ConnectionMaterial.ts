import * as THREE from "three";
import type { ConnectionMaterialConfig } from "@/types/material";
import { COLORS } from "@/constants/colors";

export const CONNECTION_MATERIALS = {
  dormant: {
    color: COLORS.cyan.faint,
    emissiveColor: COLORS.cyan.faint,
    emissiveIntensity: 0.1,
    opacity: 0.15,
    linewidth: 1,
    pulseSpeed: 0,
    dashSpeed: 0,
  },

  idle: {
    color: COLORS.cyan.dim,
    emissiveColor: COLORS.cyan.dim,
    emissiveIntensity: 0.4,
    opacity: 0.45,
    linewidth: 1,
    pulseSpeed: 1.5,
    dashSpeed: 0,
  },

  active: {
    color: COLORS.cyan.core,
    emissiveColor: COLORS.cyan.core,
    emissiveIntensity: 0.9,
    opacity: 0.75,
    linewidth: 1,
    pulseSpeed: 2.0,
    dashSpeed: 0,
  },

  broken: {
    color: COLORS.ghost.core,
    emissiveColor: COLORS.ghost.core,
    emissiveIntensity: 0.6,
    opacity: 0.35,
    linewidth: 1,
    pulseSpeed: 0.5,
    dashSpeed: 0,
  },

  ghost: {
    color: COLORS.ghost.glow,
    emissiveColor: COLORS.ghost.glow,
    emissiveIntensity: 1.2,
    opacity: 0.55,
    linewidth: 1,
    pulseSpeed: 4,
    dashSpeed: 2,
  },

  corrupted: {
    color: COLORS.ghost.glow,
    emissiveColor: COLORS.ghost.glow,
    emissiveIntensity: 2,
    opacity: 0.9,
    linewidth: 1,
    pulseSpeed: 8,
    dashSpeed: 5,
  },
} as const satisfies Record<string, ConnectionMaterialConfig>;

export function createConnectionMaterial(
  config: ConnectionMaterialConfig = CONNECTION_MATERIALS.idle,
): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: config.color,
    opacity: config.opacity,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function createConnectionDashedMaterial(
  config: ConnectionMaterialConfig = CONNECTION_MATERIALS.idle,
): THREE.LineDashedMaterial {
  return new THREE.LineDashedMaterial({
    color: config.color,
    opacity: config.opacity,
    transparent: true,
    dashSize: 0.3,
    gapSize: 0.2,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function updateConnectionMaterial(
  material: THREE.LineBasicMaterial,
  config: Partial<ConnectionMaterialConfig>,
): void {
  if (config.color !== undefined)
    material.color.set(config.color);

  if (config.opacity !== undefined)
    material.opacity = config.opacity;

  material.needsUpdate = true;
}

export function getPulseOpacity(
  baseOpacity: number,
  time: number,
  speed = 1.5,
  offset = 0,
): number {
  return baseOpacity * (0.55 + 0.45 * Math.sin(time * speed + offset));
}

export function getCorruptionPulse(
  corruption: number,
  time: number,
): number {
  return corruption * (0.5 + 0.5 * Math.sin(time * 12));
}