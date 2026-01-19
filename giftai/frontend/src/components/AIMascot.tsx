"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

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

  useFrame((state) => {
    if (sphereRef.current) {
      // Mouse tracking - smooth follow
      const targetRotationY = mousePositionRef.current.x * 0.5;
      const targetRotationX = -mousePositionRef.current.y * 0.5;

      // Lerp rotation based on mouse position
      sphereRef.current.rotation.y = THREE.MathUtils.lerp(
        sphereRef.current.rotation.y,
        targetRotationY,
        0.1
      );
      sphereRef.current.rotation.x = THREE.MathUtils.lerp(
        sphereRef.current.rotation.x,
        targetRotationX,
        0.1
      );

      // Add gentle auto rotation on top
      sphereRef.current.rotation.y += 0.001;
    }

    // Inner light pulse effect
    if (innerLightRef.current) {
      innerLightRef.current.intensity =
        2 + Math.sin(state.clock.getElapsedTime() * 2) * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={sphereRef} scale={1.5}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#4fc3f7"
          transparent
          opacity={0.6}
          metalness={0.7}
          roughness={0.2}
          distort={0.4}
          speed={2}
          envMapIntensity={1}
        />

        {/* Inner glowing core */}
        <mesh scale={0.5}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.8} />
        </mesh>

        {/* Inner point light */}
        <pointLight
          ref={innerLightRef}
          color="#ffd700"
          intensity={2}
          distance={3}
        />
      </mesh>
    </Float>
  );
}

export default function AIMascot() {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      mousePosition.current = { x, y };
      
      // Debug log (remove later)
      if (Math.random() < 0.01) {
        console.log('Mouse position:', { x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
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
