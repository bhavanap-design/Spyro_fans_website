import { useRef, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Fan geometry helpers ──────────────────────────────────────────────────

/**
 * A single slender HVLS blade.
 * Modelled after the real fan in the reference image:
 *   - narrow at root, widens slightly, tapers to rounded tip
 *   - very slight upward pitch (anhedral)
 *   - blue tip cap like the reference image
 */
function Blade({ angle }) {
  // Blade profile — slender aerofoil-ish outline
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0.0,  0.0);
  bladeShape.bezierCurveTo( 0.18, 0.3,   0.32, 1.4,  0.28, 3.8);
  bladeShape.bezierCurveTo( 0.26, 4.2,   0.10, 4.45, 0.0,  4.5);
  bladeShape.bezierCurveTo(-0.10, 4.45, -0.26, 4.2, -0.28, 3.8);
  bladeShape.bezierCurveTo(-0.32, 1.4,  -0.18, 0.3,  0.0,  0.0);

  const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.025,
    bevelThickness: 0.015,
  };

  // Tip cap shape (smaller, rounded)
  const tipShape = new THREE.Shape();
  tipShape.absarc(0, 0, 0.3, 0, Math.PI * 2, false);

  return (
    <group rotation={[0, (angle * Math.PI) / 180, 0]}>
      {/* Blade body — metallic silver */}
      <mesh
        position={[0, 0, 0.9]}
        rotation={[-Math.PI / 2 + 0.12, 0, 0]}
        castShadow
      >
        <extrudeGeometry args={[bladeShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#C8D0D8"
          metalness={0.88}
          roughness={0.12}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Blue tip cap — matches reference image */}
      <mesh
        position={[0, 0, 5.42]}
        rotation={[-Math.PI / 2 + 0.12, 0, 0]}
        castShadow
      >
        <extrudeGeometry args={[tipShape, { depth: 0.12, bevelEnabled: false }]} />
        <meshStandardMaterial
          color="#007BC9"
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

/**
 * Central hub and motor housing — chrome-finished cylinder with brand mark.
 */
function Hub() {
  return (
    <group>
      {/* Outer motor ring */}
      <mesh castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.28, 48]} />
        <meshStandardMaterial color="#8A9298" metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Top taper */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.46, 0.62, 0.14, 48]} />
        <meshStandardMaterial color="#A0A8B0" metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Bottom taper */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.62, 0.46, 0.14, 48]} />
        <meshStandardMaterial color="#A0A8B0" metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Brand disc — red/white logo area */}
      <mesh position={[0, -0.30, 0]}>
        <cylinderGeometry args={[0.30, 0.30, 0.06, 32]} />
        <meshStandardMaterial color="#E52929" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Center bolt */}
      <mesh position={[0, -0.37, 0]}>
        <cylinderGeometry args={[0.10, 0.10, 0.06, 12]} />
        <meshStandardMaterial color="#555f68" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

/**
 * Drop rod + ceiling bracket — matches reference image hardware.
 */
function MountingHardware() {
  return (
    <group>
      {/* Main drop rod */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 2.4, 16]} />
        <meshStandardMaterial color="#72808c" metalness={0.88} roughness={0.18} />
      </mesh>
      {/* U-bracket at top */}
      <mesh position={[0, 2.68, 0]}>
        <boxGeometry args={[0.5, 0.28, 0.18]} />
        <meshStandardMaterial color="#8a9298" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[-0.2, 2.82, 0]}>
        <boxGeometry args={[0.08, 0.28, 0.18]} />
        <meshStandardMaterial color="#8a9298" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 2.82, 0]}>
        <boxGeometry args={[0.08, 0.28, 0.18]} />
        <meshStandardMaterial color="#8a9298" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─── Draggable rotating fan assembly ──────────────────────────────────────

const BLADE_ANGLES = [0, 72, 144, 216, 288]; // 5 blades

/**
 * The full fan assembly with:
 *   - Drag-to-rotate (mouse + touch via pointer events)
 *   - Smooth lerp speed interpolation
 *   - Auto-rotation when idle
 *
 * Props:
 *   speed        {number}  target speed (40–100)
 *   onDragChange {fn}      reports isDragging boolean to parent
 */
function FanAssembly({ speed, onDragChange }) {
  const rotatingRef = useRef();
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const manualVelocity = useRef(0);   // velocity added by drag
  const smoothedSpeed = useRef(speed);

  const { gl } = useThree();

  // Map speed slider (40–100) → rotation rate (rad/s)
  const speedToRate = (s) => (s / 100) * 1.4;

  useFrame((_, delta) => {
    if (!rotatingRef.current) return;

    // Lerp smoothedSpeed toward target
    smoothedSpeed.current = THREE.MathUtils.lerp(
      smoothedSpeed.current,
      speed,
      1 - Math.pow(0.01, delta)   // exponential smoothing
    );

    if (isDragging.current) {
      // Apply manual velocity while dragging; decay it
      rotatingRef.current.rotation.y += manualVelocity.current;
      manualVelocity.current *= 0.88; // friction
    } else {
      // Auto-rotate at smoothed speed
      const rate = speedToRate(smoothedSpeed.current);
      rotatingRef.current.rotation.y -= delta * rate;
    }
  });

  // ── Pointer event handlers ──
  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    isDragging.current = true;
    lastPointerX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    onDragChange(true);
    gl.domElement.style.cursor = 'grabbing';
  }, [gl, onDragChange]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const dx = clientX - lastPointerX.current;
    manualVelocity.current = dx * 0.008; // scale drag delta to rotation
    lastPointerX.current = clientX;
    if (rotatingRef.current) {
      rotatingRef.current.rotation.y += manualVelocity.current;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    onDragChange(false);
    gl.domElement.style.cursor = 'grab';
  }, [gl, onDragChange]);

  return (
    <group>
      <MountingHardware />

      {/* Rotating hub + blades */}
      <group
        ref={rotatingRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Hub />
        {BLADE_ANGLES.map((angle) => (
          <Blade key={angle} angle={angle} />
        ))}
      </group>
    </group>
  );
}

// ─── Exported canvas component ─────────────────────────────────────────────

/**
 * Drop-in 3D interactive fan viewer.
 *
 * Props:
 *   speed        {number}  fan speed from slider (40–100)
 *   onDragChange {fn}      optional callback(isDragging: boolean)
 *   height       {string}  CSS height of canvas container
 */
export default function InteractiveFan3D({ speed = 45, onDragChange = () => {}, height = '480px' }) {
  return (
    <Canvas
      shadows
      camera={{ position: [7, 2.5, 7], fov: 38, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
        alpha: true,
      }}
      style={{ width: '100%', height, cursor: 'grab' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 12, 8]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#007BC9" />
      <pointLight position={[0, -3, 0]} intensity={0.4} color="#E52929" />

      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>

      <Float speed={0.8} floatIntensity={0.15} rotationIntensity={0.04}>
        <FanAssembly speed={speed} onDragChange={onDragChange} />
      </Float>

      <ContactShadows
        position={[0, -4.2, 0]}
        opacity={0.35}
        scale={16}
        blur={3}
        far={8}
      />
    </Canvas>
  );
}
