"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100; // Reduced from 200 to prevent context loss

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.1 + 0.15, 1, 0.7); // Yellow-gold tones
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  // Cleanup geometry on unmount
  useEffect(() => {
    const pointsRef = particlesRef.current;
    return () => {
      if (pointsRef) {
        pointsRef.geometry?.dispose();
        (pointsRef.material as THREE.Material)?.dispose();
      }
    };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.getElapsedTime() + i) * 0.001;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CrystalSphere({
  mousePositionRef,
}: {
  mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sphereRef.current && groupRef.current) {
      // Mouse tracking - VERY responsive and exaggerated
      const targetRotationY = mousePositionRef.current.x * 1.2; // Increased from 0.5 to 1.2
      const targetRotationX = -mousePositionRef.current.y * 1.2;

      // Fast lerp for immediate response
      sphereRef.current.rotation.y = THREE.MathUtils.lerp(
        sphereRef.current.rotation.y,
        targetRotationY,
        0.15, // Increased from 0.1
      );
      sphereRef.current.rotation.x = THREE.MathUtils.lerp(
        sphereRef.current.rotation.x,
        targetRotationX,
        0.15,
      );

      // Scale based on mouse distance from center - subtle effect
      const distance = Math.sqrt(
        mousePositionRef.current.x ** 2 + mousePositionRef.current.y ** 2,
      );
      const targetScale = 1.0 + distance * 0.1; // Reduced base and growth
      const currentScale = groupRef.current.scale.x;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, targetScale, 0.1),
      );

      // Gentle auto rotation
      sphereRef.current.rotation.z += 0.002;
    }

    // Inner light pulse effect - more dramatic
    if (innerLightRef.current) {
      innerLightRef.current.intensity =
        3 + Math.sin(state.clock.getElapsedTime() * 2) * 1.5; // Increased intensity
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        <mesh ref={sphereRef} scale={1.0}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#4fc3f7"
            transparent
            opacity={0.7}
            metalness={0.8}
            roughness={0.15}
            distort={0.5}
            speed={3}
            envMapIntensity={1.5}
          />

          {/* Inner glowing core - brighter */}
          <mesh scale={0.5}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.9} />
          </mesh>

          {/* Inner point light */}
          <pointLight
            ref={innerLightRef}
            color="#ffd700"
            intensity={3}
            distance={5}
          />
        </mesh>

        {/* Outer glow ring */}
        <mesh scale={1.8}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#4fc3f7"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function AIMascot() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Context loss/restore handlers
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("WebGL context lost, preventing default behavior");
      setHasError(true);
      // Try to restore after a delay
      setTimeout(() => {
        setHasError(false);
        setIsMounted(false);
        requestAnimationFrame(() => setIsMounted(true));
      }, 100);
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored");
      setHasError(false);
    };

    const canvas = canvasRef.current?.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost, false);
      canvas.addEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false,
      );
    }

    // Cleanup function để dispose THREE.js resources khi unmount
    return () => {
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener(
          "webglcontextrestored",
          handleContextRestored,
        );
      }
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      mousePosition.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Không render gì khi chưa mounted (tránh hydration error)
  if (!isMounted) {
    return null;
  }

  // Fallback nếu có lỗi context
  if (hasError) {
    return null;
  }

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          alpha: true,
          antialias: false, // Disable antialiasing to reduce GPU load
          preserveDrawingBuffer: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 1.5]} // Further limit device pixel ratio
        onCreated={({ gl }) => {
          // Track canvas creation
          gl.debug.checkShaderErrors = false; // Disable for performance
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="sunset" />

        <CrystalSphere mousePositionRef={mousePosition} />
        <Particles />
      </Canvas>
    </div>
  );
}
