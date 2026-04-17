import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// ─── Blade (same shape as main HVLS fan — long slender) ─────────────────────

function PBlade({ angle }) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo( 0.3,  0.76,  0.5,  3.42,  0.2,  6.08);
  shape.bezierCurveTo( 0.0,  6.84, -0.2,  6.84, -0.2,  6.08);
  shape.bezierCurveTo(-0.5,  3.42, -0.3,  0.76,  0.0,  0.0);

  return (
    <group rotation={[0, (angle * Math.PI) / 180, 0]}>
      <mesh rotation={[-Math.PI / 2 + 0.15, 0, 0]} position={[0, 0, 0.52]} castShadow>
        <extrudeGeometry args={[shape, { depth: 0.06, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.04, bevelThickness: 0.02 }]} />
        <meshStandardMaterial color="#c0c8d0" metalness={0.85} roughness={0.15} envMapIntensity={1.5} />
      </mesh>
    </group>
  );
}

// ─── Hub ─────────────────────────────────────────────────────────────────────

function PHubSmall() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.28, 32]} />
        <meshStandardMaterial color="#888fa0" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.20, 0]}>
        <cylinderGeometry args={[0.34, 0.48, 0.10, 32]} />
        <meshStandardMaterial color="#a0a8b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.20, 0]}>
        <cylinderGeometry args={[0.48, 0.34, 0.10, 32]} />
        <meshStandardMaterial color="#a0a8b8" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// ─── Pole structure ───────────────────────────────────────────────────────────
// Based on reference image: long aluminium pole with square concrete/steel base

function Pole() {
  return (
    <group>
      {/* Main shaft */}
      <mesh position={[0, -4.0, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 7.5, 20]} />
        <meshStandardMaterial color="#8a9298" metalness={0.85} roughness={0.22} />
      </mesh>
      {/* Transition collar — connects pole to motor */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.55, 24]} />
        <meshStandardMaterial color="#778088" metalness={0.85} roughness={0.22} />
      </mesh>
      {/* Electrical box on lower pole (like reference image) */}
      <mesh position={[0.22, -5.2, 0]}>
        <boxGeometry args={[0.36, 0.50, 0.24]} />
        <meshStandardMaterial color="#6a7278" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Base flange */}
      <mesh position={[0, -7.82, 0]}>
        <cylinderGeometry args={[0.58, 0.68, 0.14, 24]} />
        <meshStandardMaterial color="#778088" metalness={0.80} roughness={0.28} />
      </mesh>
      {/* Concrete/steel base block */}
      <mesh position={[0, -8.1, 0]}>
        <boxGeometry args={[1.4, 0.48, 1.4]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.55} roughness={0.60} />
      </mesh>
      {/* Anchor bolts */}
      {[[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, -7.92, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.28, 8]} />
          <meshStandardMaterial color="#555c62" metalness={0.88} roughness={0.18} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Fan assembly ─────────────────────────────────────────────────────────────

const ANGLES = [0, 72, 144, 216, 288];

function PFanAssembly({ speed, onDragChange }) {
  const rotRef    = useRef();
  const isDrag    = useRef(false);
  const lastX     = useRef(0);
  const vel       = useRef(0);
  const smoothSpd = useRef(speed);
  const { gl }    = useThree();

  useFrame((_, dt) => {
    if (!rotRef.current) return;
    smoothSpd.current = THREE.MathUtils.lerp(smoothSpd.current, speed, 1 - Math.pow(0.01, dt));
    if (isDrag.current) {
      rotRef.current.rotation.y += vel.current;
      vel.current *= 0.88;
    } else {
      rotRef.current.rotation.y -= dt * (smoothSpd.current / 100) * 1.1;
    }
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const down = (e) => { isDrag.current = true; lastX.current = e.clientX; vel.current = 0; onDragChange(true); canvas.style.cursor = 'grabbing'; };
    const move = (e) => { if (!isDrag.current) return; const dx = e.clientX - lastX.current; vel.current = dx * 0.008; lastX.current = e.clientX; if (rotRef.current) rotRef.current.rotation.y += vel.current; };
    const up   = () => { isDrag.current = false; onDragChange(false); canvas.style.cursor = 'grab'; };
    const tDown = (e) => { isDrag.current = true; lastX.current = e.touches[0].clientX; onDragChange(true); };
    const tMove = (e) => { if (!isDrag.current) return; const dx = e.touches[0].clientX - lastX.current; vel.current = dx * 0.008; lastX.current = e.touches[0].clientX; if (rotRef.current) rotRef.current.rotation.y += vel.current; };
    const tUp   = () => { isDrag.current = false; onDragChange(false); };
    canvas.addEventListener('mousedown', down); window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', tDown, { passive: true }); window.addEventListener('touchmove', tMove, { passive: true }); window.addEventListener('touchend', tUp);
    return () => { canvas.removeEventListener('mousedown', down); window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); canvas.removeEventListener('touchstart', tDown); window.removeEventListener('touchmove', tMove); window.removeEventListener('touchend', tUp); };
  }, [gl, onDragChange]);

  return (
    <group>
      <Pole />
      <group ref={rotRef}>
        <PHubSmall />
        {ANGLES.map((a) => <PBlade key={a} angle={a} />)}
      </group>
    </group>
  );
}

export default function PoleFan3D({ speed = 45, onDragChange = () => {}, height = '480px' }) {
  return (
    <Canvas
      shadows
      // Camera positioned to show full pole height + blade span
      camera={{ position: [16, 2, 16], fov: 40, near: 0.1, far: 300 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15, alpha: true }}
      style={{ width: '100%', height, cursor: 'grab' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 16, 10]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-far={60} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} />
      <directionalLight position={[-6, 5, -6]} intensity={0.55} />
      <Suspense fallback={null}>
        <Environment preset="dawn" />
      </Suspense>
      <PFanAssembly speed={speed} onDragChange={onDragChange} />
    </Canvas>
  );
}
