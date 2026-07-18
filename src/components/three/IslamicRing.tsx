"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";

export function IslamicRing() {
  const ring = useRef<Group>(null);
  const inner = useRef<Mesh>(null);

  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 1.85, 1.85, 0, Math.PI * 2);
    return curve.getPoints(96).map((p) => new THREE.Vector3(p.x, p.y, 0));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring.current) ring.current.rotation.z = t * 0.08;
    if (inner.current) inner.current.rotation.z = -t * 0.12;
  });

  return (
    <group ref={ring} rotation={[Math.PI / 2.4, 0, 0]} position={[0, 0, -0.2]}>
      <Line points={points} color="#38BDF8" transparent opacity={0.55} lineWidth={1} />

      <mesh ref={inner}>
        <torusGeometry args={[1.55, 0.015, 8, 96]} />
        <meshStandardMaterial
          color="#1E5AFF"
          emissive="#1E5AFF"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.55, Math.sin(a) * 1.55, 0]}
            rotation={[0, 0, a]}
          >
            <octahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#22D3EE" : "#E8B923"}
              emissive={i % 2 === 0 ? "#22D3EE" : "#E8B923"}
              emissiveIntensity={0.35}
            />
          </mesh>
        );
      })}
    </group>
  );
}
