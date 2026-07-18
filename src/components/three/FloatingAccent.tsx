"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Crystal() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.4;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <Float speed={2} floatIntensity={0.8} rotationIntensity={0.4}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#1E5AFF"
          emissive="#38BDF8"
          emissiveIntensity={0.45}
          metalness={0.55}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh scale={1.15}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.25} />
      </mesh>
    </Float>
  );
}

/** Small lazy accent for section decoration — not used on low-power paths. */
export function FloatingAccent({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={1} color="#38BDF8" />
        <Suspense fallback={null}>
          <Crystal />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default FloatingAccent;
