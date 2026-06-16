"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function CyberBoxes() {
  const meshRef = useRef();

  // Create an array of random positions for the wireframe cubes
  const boxes = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ],
      scale: Math.random() * 0.8 + 0.2,
    }));
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
      meshRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={meshRef}>
      {boxes.map((props, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={props.position} rotation={props.rotation} scale={props.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#35D07F" wireframe transparent opacity={0.15} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        {/* Starfield with slight rotation via useFrame if wrapped in group, or just native Stars */}
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <CyberBoxes />
      </Canvas>
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay"></div>
    </div>
  );
}
