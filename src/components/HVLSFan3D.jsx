import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Single fan blade — elongated ellipsoid tapered shape
 */
function Blade({ angle }) {
  const bladeRef = useRef();

  // Slight twist/taper using a custom shape
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.3, 0.4, 0.5, 1.8, 0.2, 3.2);
  shape.bezierCurveTo(0.0, 3.6, -0.2, 3.6, -0.2, 3.2);
  shape.bezierCurveTo(-0.5, 1.8, -0.3, 0.4, 0, 0);

  const extrudeSettings = {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.04,
    bevelThickness: 0.02,
  };

  return (
    <group rotation={[0, (angle * Math.PI) / 180, 0]}>
      {/* Position blade radiating outward */}
      <mesh
        ref={bladeRef}
        position={[0, 0, 1.0]}
        rotation={[-Math.PI / 2 + 0.15, 0, 0]}
        castShadow
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color="#c0c8d0"
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

/**
 * The hub / motor housing at the center
 */
function Hub() {
  return (
    <group>
      {/* Main motor cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.35, 32]} />
        <meshStandardMaterial color="#888fa0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Cap top */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.42, 0.55, 0.12, 32]} />
        <meshStandardMaterial color="#a0a8b8" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Cap bottom */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.55, 0.42, 0.12, 32]} />
        <meshStandardMaterial color="#a0a8b8" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Center bolt */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
        <meshStandardMaterial color="#E52929" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Mounting rod / drop rod from ceiling
 */
function MountingRod() {
  return (
    <group>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 2.8, 16]} />
        <meshStandardMaterial color="#777f8c" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Ceiling mount plate */}
      <mesh position={[0, 3.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 24]} />
        <meshStandardMaterial color="#888fa0" metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  );
}

/**
 * The complete fan assembly — hub + 5 blades + rod
 */
function FanAssembly() {
  const groupRef = useRef();

  // Slow, smooth rotation on the Y axis
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.4; // slow HVLS speed
    }
  });

  // 5 blades evenly distributed: 0, 72, 144, 216, 288 degrees
  const bladeAngles = [0, 72, 144, 216, 288];

  return (
    <group>
      <MountingRod />
      {/* Rotating part: hub + blades */}
      <group ref={groupRef}>
        <Hub />
        {bladeAngles.map((angle) => (
          <Blade key={angle} angle={angle} />
        ))}
      </group>
    </group>
  );
}

/**
 * Main exported 3D canvas component
 */
export default function HVLSFan3D() {
  return (
    <Canvas
      shadows
      camera={{ position: [6, 3, 6], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.8} color="#007BC9" />
      <pointLight position={[0, -2, 0]} intensity={0.5} color="#E52929" />

      {/* Environment for reflections */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      {/* Floating animation wrapper */}
      <Float
        speed={1.2}
        rotationIntensity={0.05}
        floatIntensity={0.3}
        floatingRange={[-0.05, 0.05]}
      >
        <FanAssembly />
      </Float>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -3.5, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={6}
        color="#000000"
      />
    </Canvas>
  );
}
