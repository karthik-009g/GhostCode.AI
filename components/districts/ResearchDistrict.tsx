"use client";

import { CityDistrict } from "@/components/infrastructure/CityDistrict";

export function ResearchDistrict() {
  return (
    <CityDistrict
      theme="research"
      origin={[-18, 0, -160]}
      seed={307}
      width={28}
      depth={66}
    />
  );
}
