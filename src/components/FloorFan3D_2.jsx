import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ─── Materials ───────────────────────────────────────────────────────────────

const FRAME_MAT = {
  color: '#1C1C1C',
  metalness: 0.82,
  roughness: 0.28,
  clearcoat: 0.3,
  clearcoatRoughness: 0.2,
  envMapIntensity: 1.6,
};

const BLADE_MAT = {
  color: '#D4440A',
  metalness: 0.2,
  roughness: 0.35,
  clearcoat: 0.2,
  clearcoatRoughness: 0.3,
  envMapIntensity: 0.9,
};

const HUB_MAT = {
  color: '#0E0E0E',
  metalness: 0.88,
  roughness: 0.18,
  clearcoat: 0.4,
  clearcoatRoughness: 0.15,
  envMapIntensity: 1.5,
};

const WIRE_MAT = {
  color: '#2A2A2A',
  metalness: 0.78,
  roughness: 0.3,
  envMapIntensity: 1.3,
};

const RUBBER_MAT = {
  color: '#1A1A1A',
  metalness: 0.05,
  roughness: 0.9,
};

// ─── Blade shape: narrow elongated strip matching real product ───────────────

let _bladeShape = null;
function getBladeShape() {
  if (_bladeShape) return _bladeShape;

  // Real photo: blades are narrow elongated strips, not wide paddles.
  // Narrow at hub root, gradually widens to modest peak at ~60%, slight taper to tip.
  const rootHW = 0.09;     // narrow where it meets the hub
  const midHW = 0.20;      // modest width at widest (~60% of length)
  const tipHW = 0.16;      // slightly narrower toward tip
  const len = 2.05;        // reach ~92% of cage radius (2.22)
  const tipR = 0.10;       // small rounded tip

  const s = new THREE.Shape();
  s.moveTo(-rootHW, 0.44);

  // Left edge: gradual widening from narrow root
  s.bezierCurveTo(
    -rootHW * 1.2, len * 0.28,
    -midHW, len * 0.48,
    -midHW, len * 0.60,
  );
  // Hold width then taper gently to tip
  s.bezierCurveTo(
    -midHW, len * 0.75,
    -tipHW, len * 0.88,
    -tipHW, len - tipR,
  );

  // Rounded tip
  s.bezierCurveTo(
    -tipHW * 0.3, len + tipR * 0.08,
    tipHW * 0.3, len + tipR * 0.08,
    tipHW, len - tipR,
  );

  // Right edge: mirror
  s.bezierCurveTo(
    tipHW, len * 0.88,
    midHW, len * 0.75,
    midHW, len * 0.60,
  );
  s.bezierCurveTo(
    midHW, len * 0.48,
    rootHW * 1.2, len * 0.28,
    rootHW, 0.44,
  );

  s.closePath();

  _bladeShape = s;
  return s;
}

// ─── Wire guard ring (front or back cage face) ─────────────────────────────

function WireGuard({ zPos, ringCount = 14, outerR = 2.22, innerR = 0.5 }) {
  const wireR = 0.012;
  const radialCount = 4;

  return (
    <group position={[0, 0, zPos]}>
      {/* Concentric rings */}
      {Array.from({ length: ringCount }).map((_, i) => {
        const r = innerR + ((outerR - innerR) * (i + 1)) / ringCount;
        return (
          <mesh key={`r-${i}`}>
            <torusGeometry args={[r, wireR, 8, 64]} />
            <meshPhysicalMaterial {...WIRE_MAT} />
          </mesh>
        );
      })}

      {/* 6 radial bars */}
      {Array.from({ length: radialCount }).map((_, i) => {
        const angle = (i / radialCount) * Math.PI * 2;
        const midR = (outerR + innerR) / 2;
        const barLen = outerR - innerR;
        return (
          <mesh
            key={`rd-${i}`}
            position={[Math.cos(angle) * midR, Math.sin(angle) * midR, 0]}
            rotation={[0, 0, angle]}
          >
            <cylinderGeometry args={[0.018, 0.018, barLen, 6]} />
            <meshPhysicalMaterial {...WIRE_MAT} />
          </mesh>
        );
      })}

      {/* Two structural cross bars */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, outerR * 2, 8]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, outerR * 2, 8]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>
    </group>
  );
}

// ─── Single blade with pitch (tilted to push air) ──────────────────────────

function Blade({ angle }) {
  const shape = useMemo(() => getBladeShape(), []);

  return (
    <group rotation={[0, 0, (angle * Math.PI) / 180]}>
      {/* Blade is pitched ~8.6° around its radial axis (X) to look 3D */}
      <group rotation={[0.15, 0, 0]}>
        <mesh castShadow receiveShadow>
          <extrudeGeometry
            args={[
              shape,
              {
                depth: 0.05,
                bevelEnabled: true,
                bevelSegments: 2,
                bevelSize: 0.008,
                bevelThickness: 0.005,
              },
            ]}
          />
          <meshPhysicalMaterial {...BLADE_MAT} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Rotating assembly (motor hub + pitched blades + logo) ──────────────────

const BLADE_ANGLES = [0, 72, 144, 216, 288];

function RotatingAssembly() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z -= delta * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.05]}>
      {/* Motor housing — main body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.55, 32]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Motor housing — front stepped ring */}
      <mesh position={[0, 0, 0.29]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.47, 0.42, 0.08, 32]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* Motor housing — back cap */}
      <mesh position={[0, 0, -0.29]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.42, 0.06, 32]} />
        <meshPhysicalMaterial {...HUB_MAT} />
      </mesh>

      {/* White brand disc (front face) */}
      <mesh position={[0, 0, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} />
        <meshPhysicalMaterial color="#F0F0F0" metalness={0.15} roughness={0.5} />
      </mesh>

      {/* Spyro "S" logo — blue half-arc */}
      <mesh position={[-0.03, 0, 0.36]}>
        <torusGeometry args={[0.06, 0.02, 8, 14, Math.PI]} />
        <meshPhysicalMaterial color="#007BC9" roughness={0.35} />
      </mesh>

      {/* Spyro "S" logo — red half-arc */}
      <mesh position={[0.03, 0, 0.36]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.06, 0.02, 8, 14, Math.PI]} />
        <meshPhysicalMaterial color="#E52929" roughness={0.35} />
      </mesh>

      {/* Hub bolt ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={`bolt-${i}`}
            position={[Math.cos(a) * 0.35, Math.sin(a) * 0.35, 0.34]}
          >
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshPhysicalMaterial color="#555" metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}

      {/* 5 pitched blades */}
      {BLADE_ANGLES.map((a) => (
        <Blade key={a} angle={a} />
      ))}
    </group>
  );
}

// ─── Barrel frame (drum housing) ────────────────────────────────────────────

function BarrelFrame() {
  const outerR = 2.42;
  const depth = 0.9;
  const rimR = 0.09;
  const barCount = 20;

  return (
    <group>
      {/* Front rim — thick torus */}
      <mesh position={[0, 0, depth / 2]}>
        <torusGeometry args={[outerR, rimR, 16, 64]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>

      {/* Back rim */}
      <mesh position={[0, 0, -depth / 2]}>
        <torusGeometry args={[outerR, rimR * 0.8, 16, 64]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>

      {/* Mid-barrel reinforcement ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[outerR + 0.01, 0.055, 10, 64]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>

      {/* Depth bars — cylindrical tubes around circumference */}
      {Array.from({ length: barCount }).map((_, i) => {
        const angle = (i / barCount) * Math.PI * 2;
        return (
          <mesh
            key={`db-${i}`}
            position={[
              Math.cos(angle) * outerR,
              Math.sin(angle) * outerR,
              0,
            ]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            {/* Tube oriented along Z (barrel depth) — rotated via parent */}
            <cylinderGeometry args={[0.02, 0.02, depth, 6]} />
            <meshPhysicalMaterial {...FRAME_MAT} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Stand with casters ─────────────────────────────────────────────────────

function CasterWheel({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.08, 0.18, 0.06]} />
        <meshPhysicalMaterial color="#2A2A2A" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.06, 12]} />
        <meshPhysicalMaterial {...RUBBER_MAT} />
      </mesh>
    </group>
  );
}

function Stand() {
  const barrelR = 2.42;
  const footY = -barrelR - 0.65;
  const footSpread = 1.45;

  const attachL = Math.PI * 1.28;
  const attachR = Math.PI * 1.72;
  const ax1 = Math.cos(attachL) * barrelR;
  const ay1 = Math.sin(attachL) * barrelR;
  const ax2 = Math.cos(attachR) * barrelR;
  const ay2 = Math.sin(attachR) * barrelR;

  const ldx = -footSpread - ax1;
  const ldy = footY - ay1;
  const lLen = Math.sqrt(ldx * ldx + ldy * ldy);
  const lAng = Math.atan2(-ldx, -ldy);

  const rdx = footSpread - ax2;
  const rdy = footY - ay2;
  const rLen = Math.sqrt(rdx * rdx + rdy * rdy);
  const rAng = Math.atan2(-rdx, -rdy);

  return (
    <group>
      {/* Left leg — tube */}
      <mesh position={[ax1 + ldx / 2, ay1 + ldy / 2, -0.1]} rotation={[0, 0, lAng]}>
        <cylinderGeometry args={[0.065, 0.065, lLen, 8]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>

      {/* Right leg — tube */}
      <mesh position={[ax2 + rdx / 2, ay2 + rdy / 2, -0.1]} rotation={[0, 0, rAng]}>
        <cylinderGeometry args={[0.065, 0.065, rLen, 8]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>

      {/* Left foot */}
      <mesh position={[-footSpread, footY, -0.1]}>
        <boxGeometry args={[0.95, 0.1, 0.14]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>

      {/* Right foot */}
      <mesh position={[footSpread, footY, -0.1]}>
        <boxGeometry args={[0.95, 0.1, 0.14]} />
        <meshPhysicalMaterial {...FRAME_MAT} />
      </mesh>

      {/* 4 caster wheels */}
      <CasterWheel position={[-footSpread - 0.35, footY - 0.15, -0.1]} />
      <CasterWheel position={[-footSpread + 0.35, footY - 0.15, -0.1]} />
      <CasterWheel position={[footSpread - 0.35, footY - 0.15, -0.1]} />
      <CasterWheel position={[footSpread + 0.35, footY - 0.15, -0.1]} />
    </group>
  );
}

// ─── Full assembly ──────────────────────────────────────────────────────────

function FloorFanAssembly() {
  return (
    <group rotation={[0.06, -0.3, 0]}>
      <BarrelFrame />
      {/* Front cage */}
      <WireGuard zPos={0.46} ringCount={14} />
      {/* Back cage (slightly fewer rings) */}
      <WireGuard zPos={-0.46} ringCount={10} outerR={2.2} innerR={0.5} />
      <RotatingAssembly />
      <Stand />
    </group>
  );
}

// ─── Exported Canvas wrapper ────────────────────────────────────────────────

export default function FloorFan3D() {
  return (
    <div
      role="img"
      aria-label="3D rendered SpyroFans portable floor drum fan — drag to rotate"
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas
        shadows
        camera={{
          position: [3, -1.5, 7],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          alpha: true,
        }}
        style={{ background: 'transparent' }}
      >
        {/* Key light */}
        <directionalLight
          position={[6, 8, 8]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* Fill light */}
        <directionalLight position={[-5, 3, 4]} intensity={0.7} />
        {/* Rim/back light — defines edges */}
        <directionalLight position={[-3, 1, -8]} intensity={1.2} />
        {/* Under fill */}
        <directionalLight position={[1, -7, 3]} intensity={0.45} />
        <ambientLight intensity={0.3} />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        {/* Contact shadow grounds the model */}
        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.35}
          scale={8}
          blur={2.5}
          far={5}
        />

        {/* OrbitControls — drag to rotate */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI * 0.45}
          maxPolarAngle={Math.PI * 0.55}
          autoRotate
          autoRotateSpeed={0.5}
        />

        <group scale={0.65} position={[0, 0.3, 0]}>
          <FloorFanAssembly />
        </group>
      </Canvas>
    </div>
  );
}
