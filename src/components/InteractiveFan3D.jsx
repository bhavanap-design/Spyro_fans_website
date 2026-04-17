import { useRef, useMemo, useEffect, useCallback, Suspense } from 'react';
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

// ─── Blade ────────────────────────────────────────────────────────────────────

function Blade({ angle }) {
  const bladeShape  = useMemo(() => getBladeShape(), []);
  const tipShape    = useMemo(() => getTipShape(), []);
  const roughnessMap = useMemo(() => getBrushedAluminumTexture(), []);

  return (
    <group rotation={[0, (angle * Math.PI) / 180, 0]}>
      {/* Blade body — brushed aluminum */}
      <mesh position={[0, 0, 0.9]} rotation={[-Math.PI / 2 + 0.12, 0, 0]} castShadow>
        <extrudeGeometry args={[bladeShape, BLADE_EXTRUDE_SETTINGS]} />
        <meshPhysicalMaterial {...BLADE_MATERIAL_PROPS} roughnessMap={roughnessMap} />
      </mesh>

      {/* Blue tip cap */}
      <mesh position={[0, -0.53, 5.29]} rotation={[-Math.PI / 2 + 0.12, 0, 0]} castShadow>
        <extrudeGeometry args={[tipShape, TIP_EXTRUDE_SETTINGS]} />
        <meshPhysicalMaterial {...TIP_MATERIAL_PROPS} />
      </mesh>
    </group>
  );
}

// ─── Hub ──────────────────────────────────────────────────────────────────────

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
      {/* Brand disc */}
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

// ─── Mounting hardware ────────────────────────────────────────────────────────

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

// ─── Draggable fan assembly ───────────────────────────────────────────────────
//
// Drag events attach to the canvas DOM element (+ window for move/up).
// This is critical: Three.js mesh pointer events lose track when the cursor
// moves off the mesh, breaking drag mid-gesture. DOM-level events don't.

function FanAssembly({ speed, onDragChange }) {
  const groupRef     = useRef();
  const isDragging   = useRef(false);
  const lastX        = useRef(0);
  const dragVel      = useRef(0);
  const smoothSpeed  = useRef(speed);

  const { gl } = useThree();

  const toRate = (s) => (s / 100) * 1.4;

  useFrame((_, dt) => {
    if (!groupRef.current) return;

    smoothSpeed.current = THREE.MathUtils.lerp(
      smoothSpeed.current,
      speed,
      1 - Math.pow(0.01, dt),
    );

    if (isDragging.current) {
      groupRef.current.rotation.y += dragVel.current;
      dragVel.current *= 0.88;
    } else {
      groupRef.current.rotation.y -= dt * toRate(smoothSpeed.current);
    }
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e) => {
      isDragging.current = true;
      lastX.current = e.clientX;
      dragVel.current = 0;
      onDragChange(true);
      canvas.style.cursor = 'grabbing';
    };
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastX.current;
      dragVel.current = dx * 0.008;
      lastX.current = e.clientX;
      if (groupRef.current) groupRef.current.rotation.y += dragVel.current;
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      onDragChange(false);
      canvas.style.cursor = 'grab';
    };

    const onTouchStart = (e) => {
      isDragging.current = true;
      lastX.current = e.touches[0].clientX;
      dragVel.current = 0;
      onDragChange(true);
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - lastX.current;
      dragVel.current = dx * 0.008;
      lastX.current = e.touches[0].clientX;
      if (groupRef.current) groupRef.current.rotation.y += dragVel.current;
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      onDragChange(false);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl, onDragChange]);

  return (
    <group>
      <MountingHardware />
      <group ref={groupRef}>
        <Hub />
        {BLADE_ANGLES.map((angle) => (
          <Blade key={angle} angle={angle} />
        ))}
      </group>
    </group>
  );
}

// ─── Exported canvas component ────────────────────────────────────────────────

export default function InteractiveFan3D({
  speed = 45,
  onDragChange = () => {},
  height = '480px',
}) {
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
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#007BC9" />
      <pointLight position={[0, -3, 0]} intensity={0.4} color="#E52929" />
      <directionalLight position={[-4, 2, -10]} intensity={0.5} />

      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>

      <Float speed={0.8} floatIntensity={0.15} rotationIntensity={0.04}>
        <FanAssembly speed={speed} onDragChange={onDragChange} />
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.2, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
    </Canvas>
  );
}
