"use client";

import { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { Html, RoundedBox, Float } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useTranslation } from "react-i18next";

// ============================================
// TYPES
// ============================================
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
  totalCards: number;
  rotation: number;
  onSelect: (index: number) => void;
  isSelected: boolean;
}

interface CarouselProps {
  posts: BlogPost[];
  onSelectPost: (index: number) => void;
  selectedIndex: number;
  setNeedsRender: (value: boolean) => void;
}

// ============================================
// CONSTANTS
// ============================================
const CAROUSEL_RADIUS = 7; // Wider carousel for better spacing
const CARD_WIDTH = 2.4; // Reduced size for better fit
const CARD_HEIGHT = 3.2; // Reduced size for better fit
const CARD_DEPTH = 0.15; // Thinner cards
const ROTATION_SPEED = 0.0015; // Slightly slower for smoother rotation
const SNAP_DURATION = 800;
const STAR_COUNT = 500; // Reduced for performance

// ============================================
// RESOURCE CLEANUP HELPER
// ============================================
function disposeObject(obj: THREE.Object3D) {
  if (obj instanceof THREE.Mesh) {
    obj.geometry?.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  }
}

// ============================================
// BLOG CARD 3D COMPONENT (Optimized)
// ============================================
const BlogCard3D = memo(function BlogCard3D({
  post,
  index,
  totalCards,
  rotation,
  onSelect,
  isSelected,
}: BlogCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate position on the cylinder with dynamic scaling - memoized
  const { x, z, angle, opacity, dynamicScale } = useMemo(() => {
    const ang = (index / totalCards) * Math.PI * 2 + rotation;
    const xPos = Math.sin(ang) * CAROUSEL_RADIUS;
    const zPos = Math.cos(ang) * CAROUSEL_RADIUS;
    const normalizedZ = (zPos + CAROUSEL_RADIUS) / (2 * CAROUSEL_RADIUS);

    // Dynamic Scaling: Counter perspective distortion
    // When card is closer to camera (higher z), reduce scale to 0.45
    // When card is farther (lower z), keep scale at 1.0
    // This compensates for perspective making near objects appear too large
    const distanceFromBack = (zPos + CAROUSEL_RADIUS) / (2 * CAROUSEL_RADIUS); // 0 at back, 1 at front
    const perspectiveCompensation = 1.0 - distanceFromBack * 0.55; // 1.0 at back, 0.45 at front

    return {
      x: xPos,
      z: zPos,
      angle: ang,
      opacity: 0.5 + normalizedZ * 0.5,
      dynamicScale: perspectiveCompensation,
    };
  }, [index, totalCards, rotation]);

  // Spring animation with dynamic scaling to counter perspective distortion
  const { scale, emissiveIntensity } = useSpring({
    scale: (hovered && !isSelected ? 1.03 : 1) * dynamicScale,
    emissiveIntensity: hovered || isSelected ? 0.3 : 0.1,
    config: { mass: 1, tension: 280, friction: 24 },
  });

  // Update cursor on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  return (
    <animated.group
      ref={groupRef}
      position={[x, 0, z]}
      rotation={[0, -angle, 0]}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
    >
      {/* Glassmorphism Card Background */}
      <RoundedBox
        args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]}
        radius={0.15}
        smoothness={2}
      >
        <animated.meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.1}
          roughness={0.15}
          transmission={0.7}
          thickness={0.5}
          transparent
          opacity={0.4}
          emissive="#FFD700"
          emissiveIntensity={emissiveIntensity}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* Gold Border Frame - Outer glow */}
      <mesh position={[0, 0, CARD_DEPTH / 2 + 0.005]}>
        <planeGeometry args={[CARD_WIDTH + 0.12, CARD_HEIGHT + 0.12]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.15} />
      </mesh>

      {/* Gold Border Frame - Inner */}
      <mesh position={[0, 0, CARD_DEPTH / 2 + 0.01]}>
        <planeGeometry args={[CARD_WIDTH + 0.04, CARD_HEIGHT + 0.04]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.35} />
      </mesh>

      {/* Content Background */}
      <mesh position={[0, 0, CARD_DEPTH / 2 + 0.015]}>
        <planeGeometry args={[CARD_WIDTH - 0.08, CARD_HEIGHT - 0.08]} />
        <meshBasicMaterial color="#0a0a15" transparent opacity={0.92} />
      </mesh>

      {/* HTML Content - Billboard to always face camera */}
      <Html
        position={[0, 0, CARD_DEPTH / 2 + 0.01]}
        center
        occlude={false}
        distanceFactor={8.5}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "260px",
            height: "340px",
            padding: "8px",
          }}
        >
          <div
            className="flex flex-col rounded-xl overflow-hidden w-full h-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,26,46,0.98) 0%, rgba(10,10,21,0.98) 100%)",
              border: "2px solid rgba(255,215,0,0.35)",
              boxShadow:
                "0 0 15px rgba(255,215,0,0.1), 0 6px 24px rgba(0,0,0,0.5)",
            }}
          >
            {/* Thumbnail with rounded corners */}
            <div
              className="relative overflow-hidden"
              style={{ height: "130px", borderRadius: "10px 10px 0 0" }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full"
                style={{ objectFit: "cover", filter: "brightness(0.9)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
              <span
                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(255,215,0,0.3)",
                  color: "#FFD700",
                  border: "1px solid rgba(255,215,0,0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {post.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h3
                className="text-base font-bold mb-2 line-clamp-2 leading-snug"
                style={{ color: "#FFFFFF" }}
              >
                {post.title}
              </h3>
              <p
                className="text-sm line-clamp-4 flex-1 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {post.excerpt}
              </p>

              {/* Meta */}
              <div
                className="flex items-center justify-between mt-3 pt-3"
                style={{ borderTop: "1px solid rgba(255,215,0,0.2)" }}
              >
                <span
                  className="text-xs font-medium"
                  style={{ color: "#FFD700" }}
                >
                  📖 {post.readTime}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {post.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </animated.group>
  );
});

// ============================================
// CAROUSEL CONTROLLER (Optimized)
// ============================================
function CarouselController({
  posts,
  onSelectPost,
  selectedIndex,
  setNeedsRender,
}: CarouselProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  // State for rotation and drag
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, rotation: 0 });
  const [velocity, setVelocity] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const lastMouseX = useRef(0);
  const lastTime = useRef(Date.now());
  const animationRef = useRef<number | null>(null);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Request render when rotating
  useFrame(() => {
    let needsUpdate = false;

    if (autoRotate && !isDragging) {
      setRotation((prev) => prev + ROTATION_SPEED);
      needsUpdate = true;
    }

    // Apply momentum when not dragging
    if (!isDragging && Math.abs(velocity) > 0.0001) {
      setRotation((prev) => prev + velocity);
      setVelocity((prev) => prev * 0.95);
      needsUpdate = true;
    }

    if (needsUpdate) {
      invalidate();
    }
  });

  // Magnetic snap to nearest card
  const snapToNearest = useCallback(() => {
    const cardAngle = (Math.PI * 2) / posts.length;
    const currentAngle = rotation % (Math.PI * 2);
    const nearestIndex = Math.round(currentAngle / cardAngle);
    const targetRotation = nearestIndex * cardAngle;

    const startRotation = rotation;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / SNAP_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const newRotation =
        startRotation + (targetRotation - startRotation) * eased;
      setRotation(newRotation);
      invalidate();

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  }, [rotation, posts.length]);

  // Mouse/Touch handlers
  const handlePointerDown = useCallback(
    (e: THREE.Event) => {
      setIsDragging(true);
      setAutoRotate(false);
      setVelocity(0);
      const clientX = (e as unknown as PointerEvent).clientX;
      setDragStart({ x: clientX, rotation });
      lastMouseX.current = clientX;
      lastTime.current = Date.now();
      setNeedsRender(true);
    },
    [rotation, setNeedsRender],
  );

  const handlePointerMove = useCallback(
    (e: THREE.Event) => {
      if (!isDragging) return;

      const clientX = (e as unknown as PointerEvent).clientX;
      const deltaX = clientX - dragStart.x;
      const rotationDelta = (deltaX / size.width) * Math.PI * 2;
      setRotation(dragStart.rotation + rotationDelta);

      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        const dx = clientX - lastMouseX.current;
        setVelocity((dx / dt) * 0.05);
      }
      lastMouseX.current = clientX;
      lastTime.current = now;
      invalidate();
    },
    [isDragging, dragStart, size.width],
  );

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => {
        if (Math.abs(velocity) < 0.001) {
          snapToNearest();
        }
      }, 500);
    }
  }, [isDragging, velocity, snapToNearest]);

  // Memoized ring geometry
  const ringGeometry = useMemo(
    () =>
      new THREE.RingGeometry(CAROUSEL_RADIUS - 0.8, CAROUSEL_RADIUS + 0.8, 48),
    [],
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#FFD700",
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
      }),
    [],
  );

  // Cleanup geometries and materials
  useEffect(() => {
    return () => {
      ringGeometry.dispose();
      ringMaterial.dispose();
    };
  }, [ringGeometry, ringMaterial]);

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Simplified light */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <pointLight position={[0, 6, 0]} intensity={50} color="#FFD700" />
      </Float>

      {/* Cards */}
      {posts.map((post, index) => (
        <BlogCard3D
          key={post.id}
          post={post}
          index={index}
          totalCards={posts.length}
          rotation={rotation}
          onSelect={onSelectPost}
          isSelected={selectedIndex === index}
        />
      ))}

      {/* Center decoration */}
      <mesh
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={ringGeometry}
        material={ringMaterial}
      />
    </group>
  );
}

// ============================================
// STAR FIELD BACKGROUND (Optimized)
// ============================================
const StarField = memo(function StarField() {
  const pointsRef = useRef<THREE.Points>(null);

  // Create geometry and material once
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const golden = 1.618033988749895;

    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = 2 * Math.PI * i * golden;
      const phi = Math.acos(1 - 2 * ((i + 0.5) / STAR_COUNT));
      const radius = 15 + (i % 20);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.08,
      color: "#ffffff",
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, []);

  // Slow rotation
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

// ============================================
// WEBGL CONTEXT HANDLER
// ============================================
function WebGLContextHandler({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("WebGL context lost. Attempting recovery...");
      onContextLost();
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored.");
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl, onContextLost]);

  return null;
}

// ============================================
// SCENE CONTENT (Isolated for cleanup)
// ============================================
function SceneContent({
  posts,
  selectedIndex,
  onSelectPost,
  onContextLost,
  setNeedsRender,
}: {
  posts: BlogPost[];
  selectedIndex: number;
  onSelectPost: (index: number) => void;
  onContextLost: () => void;
  setNeedsRender: (value: boolean) => void;
}) {
  return (
    <>
      {/* Context handler */}
      <WebGLContextHandler onContextLost={onContextLost} />

      {/* Lighting - enhanced for larger cards */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 8, 8]} intensity={0.8} color="#FFD700" />
      <pointLight position={[-8, -5, -8]} intensity={0.4} color="#4169E1" />

      {/* Star background */}
      <StarField />

      {/* Main carousel */}
      <CarouselController
        posts={posts}
        onSelectPost={onSelectPost}
        selectedIndex={selectedIndex}
        setNeedsRender={setNeedsRender}
      />
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function BlogCarousel3D() {
  const { t, ready } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [contextLost, setContextLost] = useState(false);
  const [needsRender, setNeedsRender] = useState(true);
  const canvasKey = useRef(0);

  // Client-side only mounting - single mount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Handle context lost - attempt recovery
  const handleContextLost = useCallback(() => {
    setContextLost(true);
    // Attempt auto-recovery after 2 seconds
    setTimeout(() => {
      canvasKey.current += 1;
      setContextLost(false);
    }, 2000);
  }, []);

  // Blog posts data (using i18n) - memoized
  const blogPosts: BlogPost[] = useMemo(() => {
    if (!ready) return [];
    return [
      {
        id: 1,
        title: t("blog.posts.0.title", "AI Gift Recommendations"),
        excerpt: t(
          "blog.posts.0.excerpt",
          "Discover how AI can help you find the perfect gift...",
        ),
        image:
          "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: t("blog.posts.0.category", "AI"),
        readTime: t("blog.posts.0.readTime", "5 min"),
        date: t("blog.posts.0.date", "2024"),
      },
      {
        id: 2,
        title: t("blog.posts.1.title", "Gift Wrapping Ideas"),
        excerpt: t(
          "blog.posts.1.excerpt",
          "Creative ways to wrap your presents...",
        ),
        image:
          "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: t("blog.posts.1.category", "Tips"),
        readTime: t("blog.posts.1.readTime", "3 min"),
        date: t("blog.posts.1.date", "2024"),
      },
      {
        id: 3,
        title: t("blog.posts.2.title", "Sustainable Gifting"),
        excerpt: t(
          "blog.posts.2.excerpt",
          "Eco-friendly gift options for conscious consumers...",
        ),
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: t("blog.posts.2.category", "Lifestyle"),
        readTime: t("blog.posts.2.readTime", "4 min"),
        date: t("blog.posts.2.date", "2024"),
      },
      {
        id: 4,
        title: t("blog.posts.3.title", "Holiday Gift Guide"),
        excerpt: t(
          "blog.posts.3.excerpt",
          "The ultimate guide to holiday shopping...",
        ),
        image:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: t("blog.posts.3.category", "Guide"),
        readTime: t("blog.posts.3.readTime", "6 min"),
        date: t("blog.posts.3.date", "2024"),
      },
      {
        id: 5,
        title: t("blog.posts.4.title", "Personalized Gifts"),
        excerpt: t(
          "blog.posts.4.excerpt",
          "How to add a personal touch to any gift...",
        ),
        image:
          "https://images.unsplash.com/photo-1761839256545-4268b03606c0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=80",
        category: t("blog.posts.4.category", "Ideas"),
        readTime: t("blog.posts.4.readTime", "4 min"),
        date: t("blog.posts.4.date", "2024"),
      },
      {
        id: 6,
        title: t("blog.posts.5.title", "Budget-Friendly Gifts"),
        excerpt: t(
          "blog.posts.5.excerpt",
          "Amazing gift ideas that won't break the bank...",
        ),
        image:
          "https://images.unsplash.com/photo-1512909006721-3d6018887383?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: t("blog.posts.5.category", "Budget"),
        readTime: t("blog.posts.5.readTime", "5 min"),
        date: t("blog.posts.5.date", "2024"),
      },
    ];
  }, [t, ready]);

  const handleSelectPost = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // Loading state
  if (!isMounted || !ready) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Blog & Insights
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our latest articles
            </p>
          </div>
          <div className="h-[500px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Context lost state
  if (contextLost) {
    return (
      <section className="relative py-20 overflow-hidden" id="blog">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {t("blog.title", "Blog & Insights")}
            </h2>
          </div>
          <div className="h-[500px] flex items-center justify-center flex-col gap-4">
            <div className="text-yellow-500 text-lg">
              🔄 {t("blog.recovering", "Recovering 3D view...")}
            </div>
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden" id="blog">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            {t("blog.title", "Blog & Insights")}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-4">
            {t("blog.subtitle", "Explore our latest articles and gift guides")}
          </p>
          <p className="text-sm text-yellow-500/70">
            ✨ {t("blog.dragHint", "Drag to rotate • Click to select")}
          </p>
        </div>

        {/* 3D Canvas - with key for recovery */}
        <div className="h-[600px] md:h-[700px] w-full cursor-grab active:cursor-grabbing">
          <Canvas
            key={canvasKey.current}
            camera={{ position: [0, 1.5, 14], fov: 42 }}
            frameloop={needsRender ? "always" : "demand"}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              failIfMajorPerformanceCaveat: false,
              preserveDrawingBuffer: false,
            }}
            dpr={[1, 1.5]} // Reduced max DPR for performance
            onCreated={({ gl }) => {
              // Limit pixel ratio for performance
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            }}
          >
            <SceneContent
              posts={blogPosts}
              selectedIndex={selectedIndex}
              onSelectPost={handleSelectPost}
              onContextLost={handleContextLost}
              setNeedsRender={setNeedsRender}
            />
          </Canvas>
        </div>

        {/* Selected post detail */}
        {selectedIndex >= 0 && blogPosts[selectedIndex] && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div
              className="p-6 rounded-2xl backdrop-blur-xl"
              style={{
                background: "rgba(26,26,46,0.8)",
                border: "1px solid rgba(255,215,0,0.3)",
              }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={blogPosts[selectedIndex].image}
                  alt={blogPosts[selectedIndex].title}
                  className="w-24 h-24 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                    style={{
                      background: "rgba(255,215,0,0.2)",
                      color: "#FFD700",
                    }}
                  >
                    {blogPosts[selectedIndex].category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {blogPosts[selectedIndex].title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {blogPosts[selectedIndex].excerpt}
                  </p>
                  <button
                    className="px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      color: "#1a1a2e",
                    }}
                  >
                    {t("blog.readMore", "Read More")} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View all button */}
        <div className="text-center mt-8">
          <button
            className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
            style={{
              background: "transparent",
              border: "2px solid #FFD700",
              color: "#FFD700",
            }}
          >
            {t("blog.viewAll", "View All Articles")}
          </button>
        </div>
      </div>
    </section>
  );
}
