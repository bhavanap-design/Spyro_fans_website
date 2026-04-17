import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
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

/** Single flat rectangular blade with blue tip cap */
function Blade({ angle }) {
  const shape = useMemo(() => getBladeShape(), []);
  const roughMap = useMemo(() => getBrushedAluminumTexture(), []);

  return (
    <group rotation={[0, (angle * Math.PI) / 180, 0]}>
      {/* Flat aluminum blade body */}
      <mesh rotation={[-Math.PI / 2 + 0.06, 0, 0]} castShadow>
        <extrudeGeometry args={[shape, BLADE_EXTRUDE]} />
        <meshPhysicalMaterial {...BLADE_MAT} roughnessMap={roughMap} />
      </mesh>

      {/* Blue plastic tip cap */}
      <mesh position={[0, 0.24, -3.82]} rotation={[-Math.PI / 2 + 0.06, 0, 0]}>
        <boxGeometry args={[0.34, 0.18, 0.042]} />
        <meshPhysicalMaterial {...TIP_CAP_MAT} />
      </mesh>
    </group>
  );
}

/** Rectangular mounting bracket with hex bolt details and gusset */
function MountingBracket({ angle }) {
  return (
    <group rotation={[0, (angle * Math.PI) / 180, 0]}>
      {/* Main bracket plate */}
      <mesh position={[0, 0.03, -0.65]} castShadow>
        <boxGeometry args={[0.30, 0.035, 0.50]} />
        <meshPhysicalMaterial {...BRACKET_MAT} />
      </mesh>
      {/* Gusset reinforcement plate on top */}
      <mesh position={[0, 0.06, -0.55]} castShadow>
        <boxGeometry args={[0.16, 0.02, 0.25]} />
        <meshPhysicalMaterial {...BRACKET_MAT} />
      </mesh>
      {/* 6 hex bolts (3x2 grid) - visible screw heads */}
      {[-0.09, 0, 0.09].flatMap((x) =>
        [-0.48, -0.82].map((z) => (
          <group key={`${x}${z}`} position={[x, 0.055, z]}>
            {/* Hex bolt head */}
            <mesh>
              <cylinderGeometry args={[0.018, 0.018, 0.014, 6]} />
              <meshPhysicalMaterial {...SCREW_MAT} />
            </mesh>
            {/* Bolt shaft */}
            <mesh position={[0, -0.012, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.015, 8]} />
              <meshPhysicalMaterial {...SCREW_MAT} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

/** Central motor hub with brand disc, logo, and bolt ring */
function Hub() {
  return (
    <group>
      {/* Motor cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.26, 48]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Bottom lip ring */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.52, 0.48, 0.04, 48]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Brand disc (bottom face — visible from below) */}
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

      {/* Bolt ring around hub face */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.36, -0.19, Math.sin(a) * 0.36]}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.016, 6]} />
            <meshPhysicalMaterial {...BOLT_MAT} />
          </mesh>
        );
      })}

      {/* Hub rim attachment screws (where blades connect) */}
      {BLADE_ANGLES.map((a) => {
        const aRad = (a * Math.PI) / 180;
        return (
          <group key={`hub-screw-${a}`} position={[Math.sin(aRad) * 0.46, -0.04, -Math.cos(aRad) * 0.46]}>
            <mesh>
              <cylinderGeometry args={[0.016, 0.016, 0.018, 6]} />
              <meshPhysicalMaterial {...SCREW_MAT} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Drop rod with ceiling canopy and collar */
function MountingRod() {
  return (
    <group>
      {/* Drop rod */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 2.0, 16]} />
        <meshPhysicalMaterial {...ROD_MAT} />
      </mesh>
      {/* Ceiling canopy */}
      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.10, 24]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>
      {/* Rod-hub collar */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.07, 16]} />
        <meshPhysicalMaterial {...ROD_MAT} />
      </mesh>
    </group>
  );
}

/** Full fan assembly with slow rotation */
function FanAssembly({ autoRotate = true }) {
  const bladeGroupRef = useRef();

  useFrame((_, delta) => {
    if (bladeGroupRef.current && autoRotate) {
      bladeGroupRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group>
      <MountingRod />
      <group ref={bladeGroupRef}>
        <Hub />
        {BLADE_ANGLES.map((a) => (
          <Blade key={a} angle={a} />
        ))}
        {BLADE_ANGLES.map((a) => (
          <MountingBracket key={`b${a}`} angle={a} />
        ))}
      </group>
    </group>
  );
}

export default function HVLSFan3D({ mode = 'hero' }) {
  const isProduct = mode === 'product';

  return (
    <div
      role="img"
      aria-label="3D rendered SpyroFans HVLS industrial ceiling fan"
      style={{ width: '100%', height: '100%', cursor: isProduct ? 'grab' : 'default' }}
    >
      <Canvas
        shadows
        camera={{
          position: isProduct ? [5, -1.5, 5] : [5, -2, 5],
          fov: isProduct ? 38 : 42,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          alpha: true,
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[8, 10, 5]}
          intensity={2.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, -4, -3]} intensity={0.6} />
        <directionalLight position={[0, -8, 2]} intensity={0.7} />
        <directionalLight position={[-3, 2, -7]} intensity={0.4} />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        {isProduct ? (
          <>
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI * 0.55}
              maxPolarAngle={Math.PI * 0.65}
              autoRotate
              autoRotateSpeed={0.4}
            />
            <group scale={0.75}>
              <FanAssembly autoRotate />
            </group>
          </>
        ) : (
          <Float
            speed={0.8}
            rotationIntensity={0.02}
            floatIntensity={0.1}
            floatingRange={[-0.02, 0.02]}
          >
            <group scale={0.8}>
              <FanAssembly autoRotate />
            </group>
          </Float>
        )}
      </Canvas>
    </div>
  );
}
