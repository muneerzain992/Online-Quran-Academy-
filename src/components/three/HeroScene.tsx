"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { GlowParticles } from "./GlowParticles";
import { IslamicRing } from "./IslamicRing";
import { Mushaf } from "./Mushaf";

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} color="#E8EEFF" />
      <pointLight position={[-3, 2, 2]} intensity={1.1} color="#1E5AFF" />

      <IslamicRing />
      <Mushaf />
      <GlowParticles count={36} />
    </>
  );
}

/** Pause the WebGL loop when the canvas leaves the viewport. */
function VisibilityGate() {
  const { gl, invalidate, setFrameloop } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setFrameloop("always");
          invalidate();
        } else {
          setFrameloop("never");
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [gl, invalidate, setFrameloop]);

  return null;
}

export function HeroScene() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgb(30_90_255_/_0.35),transparent_65%)] blur-2xl" />
      <Canvas
        className="relative h-full w-full touch-none"
        dpr={[1, 1.25]}
        camera={{ position: [0, 0.15, 4.2], fov: 38 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        aria-hidden
      >
        <Suspense fallback={null}>
          <VisibilityGate />
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
