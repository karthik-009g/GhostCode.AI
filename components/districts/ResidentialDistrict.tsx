"use client";

import { CityDistrict } from "@/components/infrastructure/CityDistrict";

export function ResidentialDistrict() {
  return (
    <CityDistrict
      theme="residential"
      origin={[34, 0, -240]}
      seed={409}
      width={34}
      depth={84}
    />
  );
}
