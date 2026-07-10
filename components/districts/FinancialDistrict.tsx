"use client";

import { CityDistrict } from "@/components/infrastructure/CityDistrict";

export function FinancialDistrict() {
  return (
    <CityDistrict
      theme="financial"
      origin={[18, 0, -120]}
      seed={203}
      width={30}
      depth={70}
    />
  );
}
