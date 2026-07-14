import * as THREE from "three";

import type { TowerSpec } from "../shared";
import type { ArchitectureProfile } from "./ArchitectureProfiles";

type FacadeModulesProps = {
  spec: TowerSpec;
  tint: string;
  profile: ArchitectureProfile;
};

export function FacadeGlassInset({
  spec,
  tint,
  profile,
}: FacadeModulesProps) {
  const insetDepth = profile.facade === "glass-grid" ? 0.58 : 0.5;

  return (
    <>
      {[-0.24, 0.24].map((offset) => (
        <mesh
          key={offset}
          position={[spec.width * offset, spec.height * 0.08, spec.depth * insetDepth]}
        >
          <boxGeometry args={[spec.width * 0.26, spec.height * 0.56, 0.1]} />
          <meshPhysicalMaterial
            color="#0b1e2d"
            roughness={0.12}
            metalness={0.14}
            transmission={0.48}
            transparent
            opacity={0.58}
            emissive={tint}
            emissiveIntensity={0.07}
          />
        </mesh>
      ))}
    </>
  );
}

export function VerticalFin({
  spec,
  profile,
}: Pick<FacadeModulesProps, "spec" | "profile">) {
  const finDepth = profile.facade === "panel-stack" ? 0.26 : 0.16;

  return (
    <>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * spec.width * 0.42, spec.height * 0.08, spec.depth * 0.53]}
        >
          <boxGeometry args={[0.13, spec.height * 0.74, finDepth]} />
          <meshStandardMaterial
            color="#26313c"
            roughness={0.38}
            metalness={0.62}
          />
        </mesh>
      ))}
    </>
  );
}

export function MaintenanceCatwalk({
  spec,
  tint,
  profile,
}: FacadeModulesProps) {
  if (profile.facade === "glass-grid") return null;

  const y = profile.facade === "fractured" ? spec.height * 0.02 : -spec.height * 0.08;

  return (
    <group position={[0, y, spec.depth * 0.62]}>
      <mesh>
        <boxGeometry args={[spec.width * 0.78, 0.12, 0.72]} />
        <meshStandardMaterial
          color="#1c252e"
          roughness={0.5}
          metalness={0.52}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * spec.width * 0.36, 0.22, 0.3]}>
          <boxGeometry args={[0.05, 0.42, 0.05]} />
          <meshBasicMaterial
            color={tint}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.38, 0.3]}>
        <boxGeometry args={[spec.width * 0.72, 0.05, 0.05]} />
        <meshBasicMaterial
          color={tint}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function FacadeDetailModules(props: FacadeModulesProps) {
  return (
    <>
      <FacadeGlassInset {...props} />
      <VerticalFin spec={props.spec} profile={props.profile} />
      <MaintenanceCatwalk {...props} />
    </>
  );
}
