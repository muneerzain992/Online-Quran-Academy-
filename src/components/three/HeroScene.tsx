"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { CursorParallax } from "./CursorParallax";
import { GlowParticles } from "./GlowParticles";
import { IslamicRing } from "./IslamicRing";
import { Mushaf } from "./Mushaf";

function SceneContent({ particleCount }: { particleCount: number }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} color="#E8EEFF" />
      <pointLight position={[-3, 2, 2]} intensity={1.3} color="#1E5AFF" />
      <pointLight position={[2, -1, 3]} intensity={0.9} color="#22D3EE" />
      <spotLight
        position={[0, 4, 2]}
        angle={0.45}
        penumbra={0.6}
        intensity={0.8}
        color="#38BDF8"
      />

      <CursorParallax>
        <IslamicRing />
        <Mushaf />
        <GlowParticles count={particleCount} />
      </CursorParallax>

      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.35}
        scale={8}
        blur={2.5}
        far={4}
        color="#0A1128"
      />
    </>
  );
}

export function HeroScene() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgb(30_90_255_/_0.35),transparent_65%)] blur-2xl" />
      <Canvas
        className="relative h-full w-full touch-none"
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0.15, 4.2], fov: 38 }}
        gl={{
          antialias: !mobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        aria-hidden
      >
        <Suspense fallback={null}>
          <SceneContent particleCount={mobile ? 60 : 120} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
