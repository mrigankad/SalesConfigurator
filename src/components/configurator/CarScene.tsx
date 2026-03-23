import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF, OrbitControls, Environment,
  ContactShadows, Center,
} from '@react-three/drei';
import * as THREE from 'three';
import type { ConfiguratorState } from '../../store/chatStore';

const MODEL_URL = 'https://threejs.org/examples/models/gltf/ferrari.glb';
useGLTF.preload(MODEL_URL);

// ─── Camera preset positions ──────────────────────────────────────────────────
export type CameraAngle = 'front' | 'side' | 'rear' | 'top';

const CAM_POSITIONS: Record<CameraAngle, [number, number, number]> = {
  front: [0,   1.4, 5.5],
  side:  [5.5, 1.4, 0],
  rear:  [0,   1.4, -5.5],
  top:   [0,   6,   2],
};

// ─── Camera animator ─────────────────────────────────────────────────────────
function CameraAnimator({ target }: { target: CameraAngle | null }) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!target) return;
    const [x, y, z] = CAM_POSITIONS[target];
    targetVec.current.set(x, y, z);
  }, [target]);

  useFrame(() => {
    if (!target) return;
    camera.position.lerp(targetVec.current, 0.06);
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}

// ─── Material cache refs ──────────────────────────────────────────────────────
interface MatRefs {
  body:     THREE.MeshStandardMaterial[];
  rims:     THREE.MeshStandardMaterial[];
  leather:  THREE.MeshStandardMaterial[];
  carpet:   THREE.MeshStandardMaterial[];
}

// ─── Car model ───────────────────────────────────────────────────────────────
interface CarModelProps {
  config: ConfiguratorState;
  onInteract: () => void;
}

function CarModel({ config, onInteract }: CarModelProps) {
  const { scene } = useGLTF(MODEL_URL) as any;
  const carRef    = useRef<THREE.Group>(null);
  const rotating  = useRef(true);
  const matRefs   = useRef<MatRefs>({ body: [], rims: [], leather: [], carpet: [] });
  const cloned    = useRef<THREE.Group | null>(null);

  // Clone once + cache material refs by mesh name
  useEffect(() => {
    if (cloned.current) return;
    cloned.current = scene.clone(true);

    const refs: MatRefs = { body: [], rims: [], leather: [], carpet: [] };
    cloned.current!.traverse((child: THREE.Object3D) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      // Clone material so we own it
      mesh.material = (mesh.material as THREE.Material).clone();
      const mat  = mesh.material as THREE.MeshStandardMaterial;
      const name = mesh.name.toLowerCase();

      // CarConcept GLB mesh names
      if (name === 'body')                                                        refs.body.push(mat);
      if (name.startsWith('rim_') || name === 'centre' || name === 'nuts')       refs.rims.push(mat);
      if (name === 'leather' || name === 'steering_leather')                      refs.leather.push(mat);
      if (name === 'carpet')                                                      refs.carpet.push(mat);
    });
    matRefs.current = refs;
  }, [scene]);

  // Apply color changes — only touch cached refs, no traversal
  useEffect(() => {
    const { body, rims, leather, carpet } = matRefs.current;

    body.forEach(m => {
      m.color.set(config.selectedColor);
      m.metalness = 0.85; m.roughness = 0.12; m.needsUpdate = true;
    });

    const rimPresets = [
      { color: '#1a1a1a', metalness: 0.4,  roughness: 0.6  },
      { color: '#d4d4d4', metalness: 1.0,  roughness: 0.05 },
      { color: '#111111', metalness: 0.2,  roughness: 0.15 },
    ];
    const rp = rimPresets[config.selectedWheel] ?? rimPresets[0];
    rims.forEach(m => {
      m.color.set(rp.color); m.metalness = rp.metalness; m.roughness = rp.roughness; m.needsUpdate = true;
    });

    const leatherColors: Record<string, string> = { black: '#1a1a1a', tan: '#C2956C', red: '#8B0000' };
    const carpetColors:  Record<string, string> = { black: '#111111', tan: '#9e7a55', red: '#5a0000' };
    leather.forEach(m => { m.color.set(leatherColors[config.selectedInterior] ?? '#1a1a1a'); m.roughness = 0.8; m.metalness = 0; m.needsUpdate = true; });
    carpet.forEach(m  => { m.color.set(carpetColors[config.selectedInterior]  ?? '#111111'); m.needsUpdate = true; });
  }, [config]);

  // Auto-rotate
  useFrame((_, delta) => {
    if (rotating.current && carRef.current) {
      carRef.current.rotation.y += delta * 0.18;
    }
  });

  const handlePointerDown = () => {
    rotating.current = false;
    onInteract();
  };

  if (!cloned.current) return null;

  return (
    <group ref={carRef} onPointerDown={handlePointerDown}>
      <Center>
        <primitive object={cloned.current} scale={1.2} />
      </Center>
    </group>
  );
}

// ─── Simple dark floor ────────────────────────────────────────────────────────
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.44, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#0d0d18" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

// ─── Loading placeholder ──────────────────────────────────────────────────────
function Loader() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 1.2; });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#005589" wireframe />
    </mesh>
  );
}

// ─── Scene inner (needs canvas context) ──────────────────────────────────────
interface SceneProps {
  config: ConfiguratorState;
  cameraAngle: CameraAngle | null;
}

function Scene({ config, cameraAngle }: SceneProps) {
  const [interacted, setInteracted] = useState(false);

  return (
    <>
      <color attach="background" args={['#0d0d14']} />
      <fog attach="fog" args={['#0d0d14', 14, 26]} />

      <Suspense fallback={<Loader />}>
        <CarModel config={config} onInteract={() => setInteracted(true)} />

        {/* Reflective floor */}
        <Floor />

        {/* Soft contact shadow — cheap, single pass */}
        <ContactShadows
          position={[0, -1.43, 0]}
          opacity={0.55}
          scale={14}
          blur={2}
          far={1.5}
          frames={1}
        />

        {/* HDRI for paint reflections */}
        <Environment preset="warehouse" background={false} />
      </Suspense>

      {/* Key light */}
      <directionalLight position={[-8, 10, 5]} intensity={1.6} castShadow color="#ffffff"
        shadow-mapSize={[512, 512]} shadow-camera-near={1} shadow-camera-far={20}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5}
      />
      {/* Fill */}
      <directionalLight position={[10, 4, -4]} intensity={0.6} color="#e8f3f9" />
      {/* Rim */}
      <directionalLight position={[0, 3, -10]} intensity={0.4} color="#5599ff" />
      {/* Ambient */}
      <ambientLight intensity={0.3} />

      {/* Camera preset animator */}
      <CameraAnimator target={interacted ? cameraAngle : null} />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={8}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0.2, 0]}
        makeDefault
      />
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
interface Props {
  config: ConfiguratorState;
  cameraAngle?: CameraAngle | null;
}

export function CarScene({ config, cameraAngle = null }: Props) {
  return (
    <Canvas
      shadows
      camera={{ position: [5.5, 1.4, 0], fov: 38 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1, powerPreference: 'high-performance' }}
      performance={{ min: 0.5 }}
      style={{ background: '#0d0d14' }}
    >
      <Scene config={config} cameraAngle={cameraAngle} />
    </Canvas>
  );
}
