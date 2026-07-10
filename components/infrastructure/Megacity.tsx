"use client";

import { CoreDistrict } from "@/components/districts/CoreDistrict";
import { FinancialDistrict } from "@/components/districts/FinancialDistrict";
import { ResearchDistrict } from "@/components/districts/ResearchDistrict";
import { ResidentialDistrict } from "@/components/districts/ResidentialDistrict";
import { IndustrialDistrict } from "@/components/districts/IndustrialDistrict";
import { GhostDistrict } from "@/components/districts/GhostDistrict";
import { Skyline } from "./Skyline";

export function Megacity() {
  return (
    <group>
      <CoreDistrict />
      <FinancialDistrict />
      <ResearchDistrict />
      <ResidentialDistrict />
      <IndustrialDistrict />
      <GhostDistrict />
      <Skyline />
    </group>
  );
}
