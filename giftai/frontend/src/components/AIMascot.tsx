"use client";
import { useRef, useMemo } from "react";
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
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      // Auto rotation
      sphereRef.current.rotation.y += 0.002;
      sphereRef.current.rotation.x += 0.001;

      // Mouse tracking - smooth follow
      const targetRotationY = mousePosition.x * 0.3;
      const targetRotationX = -mousePosition.y * 0.3;

      sphereRef.current.rotation.y +=
        (targetRotationY - sphereRef.current.rotation.y) * 0.05;
      sphereRef.current.rotation.x +=
        (targetRotationX - sphereRef.current.rotation.x) * 0.05;
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

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { width, height } = currentTarget.getBoundingClientRect();

    mousePosition.current = {
      x: (clientX / width) * 2 - 1,
      y: (clientY / height) * 2 - 1,
    };
  };

  return (
    <div
      className="absolute inset-0 w-full h-full"
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: "none", zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ width: "100%", height: "100%", background: "transparent", position: "absolute", top: 0, left: 0 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="sunset" />

        <CrystalSphere mousePosition={mousePosition.current} />
        <Particles />
      </Canvas>
    </div>
  );
}
