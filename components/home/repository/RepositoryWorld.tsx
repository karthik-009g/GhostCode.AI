"use client";

import { SoftwareDistricts } from "./SoftwareDistricts";
import {
  previewRepository,
  type RepositorySnapshot,
} from "./types";

type RepositoryWorldProps = {
  progress: number;
  snapshot?: RepositorySnapshot;
};

// Data adapters can replace previewRepository when GitHub data is connected.
export function RepositoryWorld({
  progress,
  snapshot = previewRepository,
}: RepositoryWorldProps) {
  return <SoftwareDistricts progress={progress} snapshot={snapshot} />;
}
