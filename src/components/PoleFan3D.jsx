import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  getBladeShape,
  BLADE_EXTRUDE,
  BLADE_MAT,
  HUB_MAT,
  BRACKET_MAT,
  TIP_CAP_MAT,
  ROD_MAT,
  BOLT_MAT,
  SCREW_MAT,
  BLADE_ANGLES,
  getBrushedAluminumTexture,
} from './fan-geometry';

// ─── Blade (same flat rectangular blade as HVLS ceiling fan) ────────────────

function Blade({ angle }) {
  const shape = useMemo(() => getBladeShape(), []);
  const roughMap = useMemo(() => getBrushedAluminumTexture(), []);

  return (
    <group rotation={[0, (angle * Math.PI) / 180, 0]}>
      <mesh rotation={[-Math.PI / 2 + 0.06, 0, 0]} castShadow>
        <extrudeGeometry args={[shape, BLADE_EXTRUDE]} />
        <meshPhysicalMaterial {...BLADE_MAT} roughnessMap={roughMap} />
      </mesh>

      {/* Blue tip cap */}
      <mesh position={[0, 0.24, -3.82]} rotation={[-Math.PI / 2 + 0.06, 0, 0]}>
        <boxGeometry args={[0.34, 0.18, 0.042]} />
        <meshPhysicalMaterial {...TIP_CAP_MAT} />
      </mesh>
    </group>
  );
}

// ─── Hub (compact motor housing at top of pole) ─────────────────────────────

function Hub() {
  return (
    <group>
      {/* Motor cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.26, 48]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.34, 0.42, 0.08, 48]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Bottom lip ring */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.46, 0.42, 0.04, 48]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Brand disc (bottom face) */}
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.015, 32]} />
        <meshPhysicalMaterial color="#FFFFFF" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Spyro "S" logo — blue half-arc */}
      <mesh position={[-0.035, -0.195, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
        <meshPhysicalMaterial color="#007BC9" roughness={0.4} />
      </mesh>

      {/* Spyro "S" logo — red half-arc */}
      <mesh position={[0.035, -0.195, 0]} rotation={[-Math.PI / 2, Math.PI, 0]}>
        <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
        <meshPhysicalMaterial color="#E52929" roughness={0.4} />
      </mesh>

      {/* Bolt ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.34, -0.19, Math.sin(a) * 0.34]}>
            <cylinderGeometry args={[0.012, 0.012, 0.016, 6]} />
            <meshPhysicalMaterial {...BOLT_MAT} />
          </mesh>
        );
      })}

      {/* Mounting brackets (5, one per blade) */}
      {BLADE_ANGLES.map((angle) => (
        <group key={`br-${angle}`} rotation={[0, (angle * Math.PI) / 180, 0]}>
          <mesh position={[0, 0.03, -0.58]} castShadow>
            <boxGeometry args={[0.24, 0.035, 0.38]} />
            <meshPhysicalMaterial {...BRACKET_MAT} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Pole structure ─────────────────────────────────────────────────────────

function Pole() {
  return (
    <group>
      {/* Main shaft — aluminum pole */}
      <mesh position={[0, -2.75, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 5.0, 20]} />
        <meshPhysicalMaterial {...ROD_MAT} />
      </mesh>

      {/* Transition collar — connects pole to motor hub */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.20, 0.14, 0.35, 24]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Electrical junction box on lower pole */}
      <mesh position={[0.20, -3.5, 0]}>
        <boxGeometry args={[0.32, 0.45, 0.22]} />
        <meshPhysicalMaterial color="#8A9098" metalness={0.75} roughness={0.35} envMapIntensity={1.0} />
      </mesh>

      {/* Junction box mount bracket */}
      <mesh position={[0.08, -3.5, 0]}>
        <boxGeometry args={[0.08, 0.35, 0.16]} />
        <meshPhysicalMaterial {...BRACKET_MAT} />
      </mesh>

      {/* Base flange — tapered collar */}
      <mesh position={[0, -5.32, 0]}>
        <cylinderGeometry args={[0.48, 0.58, 0.14, 24]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Concrete/steel base block */}
      <mesh position={[0, -5.6, 0]}>
        <boxGeometry args={[1.4, 0.48, 1.4]} />
        <meshPhysicalMaterial color="#B0B4B8" metalness={0.35} roughness={0.65} envMapIntensity={0.6} />
      </mesh>

      {/* 4 anchor bolts */}
      {[[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, -5.42, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.28, 8]} />
          <meshPhysicalMaterial {...SCREW_MAT} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Rotating fan assembly ──────────────────────────────────────────────────

function FanAssembly({ speed }) {
  const rotRef = useRef();
  const smoothSpeed = useRef(speed ?? 90);

  // Map RPM to visual rotation rate — proportional like HVLS fan
  const toRate = (rpm) => rpm * 0.04;

  useFrame((_, delta) => {
    if (!rotRef.current) return;

    if (speed != null) {
      smoothSpeed.current = THREE.MathUtils.lerp(
        smoothSpeed.current,
        speed,
        1 - Math.pow(0.01, delta),
      );
      rotRef.current.rotation.y -= delta * toRate(smoothSpeed.current);
    } else {
      rotRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group>
      <Pole />
      <group ref={rotRef}>
        <Hub />
        {BLADE_ANGLES.map((a) => (
          <Blade key={a} angle={a} />
        ))}
      </group>
    </group>
  );
}

// ─── Exported Canvas wrapper ────────────────────────────────────────────────

export default function PoleFan3D({ speed }) {
  return (
    <div
      role="img"
      aria-label="3D rendered SpyroFans pole-mounted HVLS fan"
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
    >
      <Canvas
        shadows
        camera={{
          position: [4, -0.8, 7],
          fov: 38,
          near: 0.1,
          far: 300,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          alpha: true,
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[10, 16, 10]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-6, 5, -6]} intensity={0.55} />
        <directionalLight position={[-3, 2, -8]} intensity={0.5} />
        <directionalLight position={[0, -8, 3]} intensity={0.4} />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, -0.8, 0]}
          minPolarAngle={Math.PI * 0.38}
          maxPolarAngle={Math.PI * 0.52}
          autoRotate
          autoRotateSpeed={0.4}
        />

        <group scale={0.65} position={[0, 0.8, 0]}>
          <FanAssembly speed={speed} />
        </group>
      </Canvas>
    </div>
  );
}
