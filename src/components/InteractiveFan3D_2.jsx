import { useRef, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import {
  getBladeShape,
  getTipShape,
  BLADE_EXTRUDE_SETTINGS,
  TIP_EXTRUDE_SETTINGS,
  BLADE_MATERIAL_PROPS,
  TIP_MATERIAL_PROPS,
  HUB_MATERIAL_PROPS,
  HUB_CAP_MATERIAL_PROPS,
  ROD_MATERIAL_PROPS,
  BRAND_DISC_PROPS,
  BLADE_ANGLES,
  getBrushedAluminumTexture,
} from './fan-geometry';

// ─── Fan geometry helpers ──────────────────────────────────────────────────

/**
 * A single slender HVLS blade with blue tip cap.
 */
function Blade({ angle }) {
  const bladeShape = useMemo(() => getBladeShape(), []);
  const tipShape = useMemo(() => getTipShape(), []);
  const roughnessMap = useMemo(() => getBrushedAluminumTexture(), []);

  return (
    <group rotation={[0, (angle * Math.PI) / 180, 0]}>
      {/* Blade body -- metallic silver */}
      <mesh position={[0, 0, 0.9]} rotation={[-Math.PI / 2 + 0.12, 0, 0]} castShadow>
        <extrudeGeometry args={[bladeShape, BLADE_EXTRUDE_SETTINGS]} />
        <meshPhysicalMaterial {...BLADE_MATERIAL_PROPS} roughnessMap={roughnessMap} />
      </mesh>
      {/* Blue tip cap -- matches reference image */}
      <mesh position={[0, 0, 5.42]} rotation={[-Math.PI / 2 + 0.12, 0, 0]} castShadow>
        <extrudeGeometry args={[tipShape, TIP_EXTRUDE_SETTINGS]} />
        <meshPhysicalMaterial {...TIP_MATERIAL_PROPS} />
      </mesh>
    </group>
  );
}

/**
 * Central hub and motor housing -- chrome-finished cylinder with brand mark.
 */
function Hub() {
  return (
    <group>
      {/* Outer motor ring */}
      <mesh castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.28, 48]} />
        <meshPhysicalMaterial {...HUB_MATERIAL_PROPS} />
      </mesh>
      {/* Top taper */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.46, 0.62, 0.14, 48]} />
        <meshPhysicalMaterial {...HUB_CAP_MATERIAL_PROPS} />
      </mesh>
      {/* Bottom taper */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.62, 0.46, 0.14, 48]} />
        <meshPhysicalMaterial {...HUB_CAP_MATERIAL_PROPS} />
      </mesh>
      {/* Brand disc -- red logo area */}
      <mesh position={[0, -0.30, 0]}>
        <cylinderGeometry args={[0.30, 0.30, 0.06, 32]} />
        <meshPhysicalMaterial {...BRAND_DISC_PROPS} />
      </mesh>
      {/* Center bolt */}
      <mesh position={[0, -0.37, 0]}>
        <cylinderGeometry args={[0.10, 0.10, 0.06, 12]} />
        <meshPhysicalMaterial {...ROD_MATERIAL_PROPS} />
      </mesh>
      {/* Collar ring detail */}
      <mesh position={[0, 0.18, 0]}>
        <torusGeometry args={[0.5, 0.02, 8, 32]} />
        <meshPhysicalMaterial {...HUB_MATERIAL_PROPS} />
      </mesh>
    </group>
  );
}

/**
 * Drop rod + ceiling bracket -- matches reference image hardware.
 */
function MountingHardware() {
  return (
    <group>
      {/* Main drop rod */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 2.4, 16]} />
        <meshPhysicalMaterial {...ROD_MATERIAL_PROPS} />
      </mesh>
      {/* U-bracket at top */}
      <mesh position={[0, 2.68, 0]}>
        <boxGeometry args={[0.5, 0.28, 0.18]} />
        <meshPhysicalMaterial {...HUB_MATERIAL_PROPS} />
      </mesh>
      <mesh position={[-0.2, 2.82, 0]}>
        <boxGeometry args={[0.08, 0.28, 0.18]} />
        <meshPhysicalMaterial {...HUB_MATERIAL_PROPS} />
      </mesh>
      <mesh position={[0.2, 2.82, 0]}>
        <boxGeometry args={[0.08, 0.28, 0.18]} />
        <meshPhysicalMaterial {...HUB_MATERIAL_PROPS} />
      </mesh>
    </group>
  );
}

// ─── Draggable rotating fan assembly ──────────────────────────────────────

/**
 * The full fan assembly with:
 *   - Drag-to-rotate (mouse + touch via pointer events)
 *   - Smooth lerp speed interpolation
 *   - Auto-rotation when idle
 *
 * Props:
 *   speed        {number}  target speed (40-100)
 *   onDragChange {fn}      reports isDragging boolean to parent
 */
function FanAssembly({ speed, onDragChange }) {
  const rotatingRef = useRef();
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const manualVelocity = useRef(0);   // velocity added by drag
  const smoothedSpeed = useRef(speed);

  const { gl } = useThree();

  // Map speed slider (40-100) -> rotation rate (rad/s)
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
 *   speed        {number}  fan speed from slider (40-100)
 *   onDragChange {fn}      optional callback(isDragging: boolean)
 *   height       {string}  CSS height of canvas container
 */
export default function InteractiveFan3D({ speed = 45, onDragChange = () => {}, height = '480px' }) {
  return (
    <div
      role="img"
      aria-label="Interactive 3D HVLS fan -- drag to rotate, use speed slider to adjust"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
        }
      }}
    >
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
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#007BC9" />
      <pointLight position={[0, -3, 0]} intensity={0.4} color="#E52929" />
      {/* Rim light for edge definition */}
      <directionalLight position={[-4, 2, -10]} intensity={0.5} color="#ffffff" />

      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>

      <Float speed={0.8} floatIntensity={0.15} rotationIntensity={0.04}>
        <FanAssembly speed={speed} onDragChange={onDragChange} />
      </Float>

      {/* Simple ground shadow plane instead of ContactShadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.2, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
    </Canvas>
    </div>
  );
}
