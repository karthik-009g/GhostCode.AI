import * as THREE from "three";

import type { TowerSpec } from "../shared";
import type { ArchitectureProfile } from "./ArchitectureProfiles";

type RoofAccessoriesProps = {
  spec: TowerSpec;
  tint: string;
  profile: ArchitectureProfile;
};

export function RoofAccessories({
  spec,
  tint,
  profile,
}: RoofAccessoriesProps) {
  return (
    <group position={[0, 0.26, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[spec.width * 0.28, spec.width * 0.31, 4]} />
        <meshStandardMaterial
          color="#3a4650"
          roughness={0.42}
          metalness={0.62}
        />
      </mesh>
      {profile.roof === "antenna" &&
        [-0.24, 0.24].map((offset) => (
          <group key={offset} position={[spec.width * offset, 0.56, 0]}>
            <mesh>
              <cylinderGeometry args={[0.035, 0.06, 1.4, 8]} />
              <meshStandardMaterial color="#b9d5df" roughness={0.26} metalness={0.86} />
            </mesh>
            <mesh position={[0, 0.74, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial
                color={tint}
                transparent
                opacity={0.64}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      {profile.roof === "utility" && (
        <>
          <mesh position={[0, 0.38, 0]}>
            <boxGeometry args={[spec.width * 0.46, 0.08, 0.1]} />
            <meshStandardMaterial color="#3c4650" roughness={0.46} metalness={0.62} />
          </mesh>
          <mesh position={[spec.width * 0.22, 0.62, 0]} rotation={[0, 0, -0.46]}>
            <boxGeometry args={[spec.width * 0.5, 0.08, 0.08]} />
            <meshStandardMaterial color="#303b46" roughness={0.48} metalness={0.58} />
          </mesh>
        </>
      )}
      {profile.roof === "radome" && (
        <mesh position={[-spec.width * 0.23, 0.4, 0]} rotation={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.08, 12]} />
          <meshStandardMaterial
            color="#a6c0ca"
            roughness={0.34}
            metalness={0.5}
            emissive={tint}
            emissiveIntensity={0.06}
          />
        </mesh>
      )}
    </group>
  );
}
