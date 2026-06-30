export interface FogConfig {
  color: string;

  near: number;

  far: number;
}

export interface LightConfig {
  color: string;

  intensity: number;

  position: [number, number, number];

  distance?: number;

  decay?: number;

  castShadow?: boolean;
}

export interface EnvironmentConfig {
  preset?:
    | "studio"
    | "night"
    | "custom";

  background: boolean;

  blur?: number;

  hdr?: string;
}

export interface AtmosphereConfig {
  intensity: number;

  density: number;

  color: string;
}

export interface BackgroundConfig {
  color: string;

  gradient?: {
    type?: "linear" | "radial";

    topColor: string;

    bottomColor: string;
  };
}