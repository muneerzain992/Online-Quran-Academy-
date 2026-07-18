"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export function Mushaf() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.35) * 0.25;
    group.current.rotation.x = Math.sin(t * 0.22) * 0.08;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.55}>
      <group ref={group} position={[0, 0.05, 0]} scale={1.15}>
        {/* Cover */}
        <RoundedBox args={[1.55, 2.05, 0.18]} radius={0.06} smoothness={4}>
          <meshStandardMaterial
            color="#0D1B3E"
            metalness={0.35}
            roughness={0.35}
          />
        </RoundedBox>
        {/* Gold spine accent */}
        <mesh position={[-0.72, 0, 0.01]}>
          <boxGeometry args={[0.08, 2.0, 0.2]} />
          <meshStandardMaterial
            color="#E8B923"
            metalness={0.7}
            roughness={0.25}
            emissive="#E8B923"
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Pages */}
        <RoundedBox
          args={[1.35, 1.85, 0.12]}
          radius={0.04}
          position={[0.04, 0, 0.12]}
        >
          <meshStandardMaterial color="#E8EEFF" roughness={0.85} />
        </RoundedBox>
        {/* Verse lines */}
        {[-0.35, -0.15, 0.05, 0.25, 0.45].map((y, i) => (
          <mesh key={y} position={[0.08, y, 0.19]}>
            <boxGeometry args={[0.85 - i * 0.06, 0.035, 0.01]} />
            <meshStandardMaterial
              color="#1E5AFF"
              emissive="#38BDF8"
              emissiveIntensity={0.35}
              transparent
              opacity={0.75}
            />
          </mesh>
        ))}
        {/* Corner medallion */}
        <mesh position={[0.45, 0.7, 0.2]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial
            color="#22D3EE"
            emissive="#22D3EE"
            emissiveIntensity={0.4}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}
