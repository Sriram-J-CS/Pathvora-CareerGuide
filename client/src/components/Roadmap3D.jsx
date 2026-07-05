import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D zigzag coordinates calculator based on index
const getCoordinatesForStep = (index, total) => {
  const x = (index % 2 === 0 ? -2 : 2) * (1 - index / (total * 1.5));
  const y = -3 + (index * 6) / (total - 1 || 1);
  const z = Math.sin(index * 2) * 1.5;
  return [x, y, z];
};

// 3D Milestone Node Component
function MilestoneNode({ position, step, index, isHovered, onHover, onClick }) {
  const meshRef = useRef();
  
  // Animate node breathing / rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      
      // Hover scale bounce
      const targetScale = isHovered ? 1.4 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Get color based on milestone status
  const getColor = () => {
    if (step.status === 'Completed') return '#10b981'; // Emerald
    if (step.status === 'In Progress') return '#06b6d4'; // Cyan
    return '#475569'; // Slate
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(step);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(index);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      className="cursor-pointer"
    >
      {/* Dynamic icosahedron sphere for tech aesthetics */}
      <icosahedronGeometry args={[0.45, 1]} />
      <meshStandardMaterial
        color={getColor()}
        roughness={0.2}
        metalness={0.8}
        emissive={isHovered ? getColor() : '#000000'}
        emissiveIntensity={isHovered ? 0.6 : 0}
        wireframe={step.status === 'Pending'}
      />
    </mesh>
  );
}

// 3D Pathway connector wire
function PathwayConnection({ points }) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const pointsOnCurve = curve.getPoints(50);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(pointsOnCurve);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="rgba(255,255,255,0.08)" linewidth={1} />
    </line>
  );
}

// Rotating scene wrapper
function RotatingScene({ children }) {
  const sceneRef = useRef();
  
  // Rotate the whole roadmap path back and forth gently
  useFrame((state) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.25;
    }
  });

  return <group ref={sceneRef}>{children}</group>;
}

export default function Roadmap3D({ steps = [], onSelectStep }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (steps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
        No active roadmap steps. Please complete onboarding.
      </div>
    );
  }

  const positions = steps.map((step, idx) => getCoordinatesForStep(idx, steps.length));

  return (
    <div className="w-full h-[400px] md:h-[500px] glass-card relative overflow-hidden bg-black/45 rounded-3xl border border-border-subtle">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 60 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <RotatingScene>
          {/* Connector Wires */}
          <PathwayConnection points={positions} />

          {/* Milestone Nodes */}
          {steps.map((step, index) => (
            <MilestoneNode
              key={step._id || index}
              position={positions[index]}
              step={step}
              index={index}
              isHovered={hoveredIdx === index}
              onHover={setHoveredIdx}
              onClick={onSelectStep}
            />
          ))}
        </RotatingScene>
      </Canvas>

      {/* Floating 3D Navigation Guide */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none select-none px-2">
        <span className="text-[8px] font-black text-brand-cyan uppercase tracking-widest font-mono">
          Interactive R3F Canvas active
        </span>
        <span className="text-[8px] font-bold text-slate-500 uppercase font-mono">
          Hover node to spotlight • Click to open panel
        </span>
      </div>
    </div>
  );
}
