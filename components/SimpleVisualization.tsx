'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Simple 3D Globe Component (Original Design)
function SimpleGlobe({ isMouseMoving }: { isMouseMoving: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // Dynamic rotation speed based on mouse movement
    const baseSpeed = 0.02;
    const mouseSpeed = isMouseMoving ? 0.05 : baseSpeed;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * mouseSpeed;
      meshRef.current.rotation.x += delta * (baseSpeed * 0.5);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color="#0066cc"
        wireframe={true}
        emissive="#0066cc"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Enhanced data points (keeping the good features)
function DataPoints() {
  const pointsGroupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useFrame((_, delta) => {
    // Dynamic rotation speed based on mouse movement
    const baseSpeed = 0.008;
    const mouseSpeed = hoveredNode ? 0.02 : baseSpeed;

    if (pointsGroupRef.current) {
      pointsGroupRef.current.rotation.y += delta * mouseSpeed;
    }
  });

  const dataPoints = [
    {
      position: [2.8, 1.2, 0] as [number, number, number],
      color: '#00FF88',
      size: 0.12,
      name: 'Traffic Control',
    },
    {
      position: [-2.2, 1.8, 0] as [number, number, number],
      color: '#FF6B35',
      size: 0.15,
      name: 'Power Grid',
    },
    {
      position: [1.5, -2.1, 0] as [number, number, number],
      color: '#FFD700',
      size: 0.18,
      name: 'Data Center',
    },
    {
      position: [-1.8, -2.3, 0] as [number, number, number],
      color: '#9D4EDD',
      size: 0.14,
      name: 'IoT Network',
    },
    {
      position: [2.5, -1.8, 0] as [number, number, number],
      color: '#00D9FF',
      size: 0.16,
      name: 'Smart Sensors',
    },
    {
      position: [0, 2.5, 0] as [number, number, number],
      color: '#FF006E',
      size: 0.13,
      name: 'Command Center',
    },
  ];

  return (
    <group ref={pointsGroupRef}>
      {dataPoints.map((point, index) => (
        <group
          key={index}
          position={point.position}
          onPointerOver={() => setHoveredNode(point.name)}
          onPointerOut={() => setHoveredNode(null)}
        >
          {/* Main data point */}
          <mesh>
            <octahedronGeometry args={[point.size, 0]} />
            <meshBasicMaterial color={hoveredNode === point.name ? '#FFFFFF' : point.color} />
          </mesh>

          {/* Rotating ring around point */}
          <mesh>
            <ringGeometry args={[point.size * 2, point.size * 2.5, 8]} />
            <meshBasicMaterial
              color={point.color}
              transparent={true}
              opacity={hoveredNode === point.name ? 0.6 : 0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Urban grid overlay (contained within globe)
function UrbanGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <group ref={gridRef}>
      {/* Latitude lines - contained within globe */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <lineSegments key={`lat-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    Math.cos(angle) * 1.9,
                    -1.9,
                    Math.sin(angle) * 1.9,
                    Math.cos(angle) * 1.9,
                    1.9,
                    Math.sin(angle) * 1.9,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#0066cc" transparent={true} opacity={0.15} />
          </lineSegments>
        );
      })}

      {/* Longitude lines - contained within globe */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = ((i + 0.5) / 6) * Math.PI * 2;
        return (
          <lineSegments key={`lon-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -1.9,
                    Math.cos(angle) * 1.9,
                    Math.sin(angle) * 1.9,
                    1.9,
                    Math.cos(angle) * 1.9,
                    Math.sin(angle) * 1.9,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#00D9FF" transparent={true} opacity={0.1} />
          </lineSegments>
        );
      })}
    </group>
  );
}

// Scene component
function Scene({ isMouseMoving }: { isMouseMoving: boolean }) {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.3} color="#404040" />

      {/* Main directional light */}
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#FFF8DC" castShadow />

      {/* Blue accent light */}
      <pointLight position={[-5, 3, 5]} intensity={0.6} color="#00D9FF" />

      {/* Green accent light */}
      <pointLight position={[5, -3, 5]} intensity={0.5} color="#00FF88" />

      <SimpleGlobe isMouseMoving={isMouseMoving} />
      <DataPoints />
      <UrbanGrid />

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={false}
        minDistance={5}
        maxDistance={20}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.3}
      />
    </>
  );
}

interface SimpleVisualizationProps {
  className?: string;
}

export default function SimpleVisualization({ className }: SimpleVisualizationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMouseMoving, setIsMouseMoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Mouse movement detection for globe rotation speed
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setIsMouseMoving(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMouseMoving(false), 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className={`glass relative flex h-[400px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 sm:h-[500px] lg:h-[600px] ${className || ''}`}
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <div className="text-blue-500">Loading 3D Visualization...</div>
          <div className="text-sm text-gray-400">Preparing your smart city experience</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass relative h-[400px] overflow-hidden rounded-2xl border border-white/10 sm:h-[500px] lg:h-[600px] ${className || ''}`}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.7,
        }}
      >
        <Scene isMouseMoving={isMouseMoving} />
      </Canvas>

      {/* Enhanced overlay with good animations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Status indicators */}
        <div className="absolute top-1/4 left-1/4 h-4 w-4 animate-pulse rounded-full bg-blue-500 shadow-lg shadow-blue-500/50">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-20"></div>
        </div>
        <div className="absolute top-1/3 right-1/3 h-4 w-4 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/3 h-4 w-4 animate-pulse rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50">
          <div className="absolute inset-0 animate-ping rounded-full bg-yellow-500 opacity-20"></div>
        </div>
        <div className="absolute right-1/4 bottom-1/3 h-4 w-4 animate-pulse rounded-full bg-red-500 shadow-lg shadow-red-500/50">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-20"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 h-4 w-4 animate-pulse rounded-full bg-purple-500 shadow-lg shadow-purple-500/50">
          <div className="absolute inset-0 animate-ping rounded-full bg-purple-500 opacity-20"></div>
        </div>

        {/* Status labels */}
        <div className="absolute top-8 left-8 animate-pulse font-mono text-xs text-blue-500">
          STATUS ACTIVE
        </div>
        <div className="absolute top-8 right-8 animate-pulse font-mono text-xs text-green-500">
          SENSORS ONLINE
        </div>
        <div className="absolute bottom-8 left-8 animate-pulse font-mono text-xs text-yellow-500">
          POWER GRID
        </div>
        <div className="absolute right-8 bottom-8 animate-pulse font-mono text-xs text-red-500">
          NETWORK LINK
        </div>
        <div className="absolute top-1/2 left-1/2 animate-pulse font-mono text-xs text-purple-500">
          CONTROL HUB
        </div>

        {/* Status indicators */}
        <div className="absolute top-1/4 right-1/4 animate-pulse rounded bg-black/50 px-2 py-1 text-xs text-white">
          3D GLOBE
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-pulse rounded bg-black/50 px-2 py-1 text-xs text-white">
          REAL-TIME
        </div>
        <div className="absolute top-1/3 left-1/4 animate-pulse rounded bg-black/50 px-2 py-1 text-xs text-white">
          6 NODES
        </div>
      </div>
    </div>
  );
}
