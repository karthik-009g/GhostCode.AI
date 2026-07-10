"use client";

import { CityDistrict } from "@/components/infrastructure/CityDistrict";

export function IndustrialDistrict() {
  return (
    <CityDistrict
      theme="industrial"
      origin={[-36, 0, -300]}
      seed={503}
      width={38}
      depth={90}
    />
  );
}
