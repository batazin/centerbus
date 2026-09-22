"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface Waypoint {
  progress: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  rotY: number;
  rotX: number;
  modelIndex: number;
}

// Trajetória cinematográfica em Zigue-Zague
// Ao cruzar o centro da tela, o objeto mergulha em profundidade (-Z)
// e reduz de tamanho para nunca obstruir os textos!
const WAYPOINTS: Waypoint[] = [
  // 0. Hero: À direita, imponente, visão 3/4 frontal
  { progress: 0.0, x: 2.5, y: 0.15, z: 0.2, scale: 1.15, rotY: -0.7, rotX: 0.08, modelIndex: 0 },
  // Transição 0 -> 1: Mergulho central em profundidade
  { progress: 0.12, x: 0.0, y: -0.4, z: -3.8, scale: 0.55, rotY: 0.1, rotX: 0.0, modelIndex: 0 },
  // 1. Carroceria: À esquerda, foco nos fechamentos e para-brisa
  { progress: 0.24, x: -2.5, y: 0.05, z: 0.3, scale: 1.25, rotY: 0.75, rotX: 0.06, modelIndex: 0 },
  // Transição 1 -> 2: Mergulho central em profundidade
  { progress: 0.36, x: 0.0, y: -0.3, z: -3.5, scale: 0.6, rotY: 1.5, rotX: 0.0, modelIndex: 1 },
  // 2. Suspensão Pneumática: À direita, fole de alta pressão
  { progress: 0.48, x: 2.4, y: 0.05, z: 0.4, scale: 1.75, rotY: -0.55, rotX: 0.12, modelIndex: 1 },
  // Transição 2 -> 3: Mergulho central em profundidade
  { progress: 0.6, x: 0.0, y: -0.35, z: -3.5, scale: 0.62, rotY: 0.7, rotX: 0.0, modelIndex: 2 },
  // 3. Climatização Spheros: À esquerda, compressor e aletas
  { progress: 0.72, x: -2.4, y: 0.05, z: 0.4, scale: 1.65, rotY: 0.7, rotX: 0.1, modelIndex: 2 },
  // Transição 3 -> 4: Mergulho central em profundidade
  { progress: 0.84, x: 0.0, y: -0.3, z: -3.2, scale: 0.65, rotY: -0.8, rotX: 0.0, modelIndex: 3 },
  // 4. Farol Bi-LED: À direita, canhão óptico e guia DRL
  { progress: 0.92, x: 2.3, y: 0.05, z: 0.5, scale: 1.7, rotY: -0.45, rotX: 0.08, modelIndex: 3 },
  // 5. Freio Autoventilado: Centro inferior com destaque de fechamento
  { progress: 1.0, x: 0.0, y: -0.2, z: 0.6, scale: 1.6, rotY: 0.25, rotX: 0.05, modelIndex: 4 },
];

const MODEL_FILES = [
  { path: "/models/bus_coach_heavy_duty.glb", name: "Ônibus Heavy Duty" },
  { path: "/models/air_suspension_bellow.glb", name: "Suspensão a Ar" },
  { path: "/models/ac_compressor_heavy.glb", name: "Compressor AC" },
  { path: "/models/led_projector_headlight.glb", name: "Farol Bi-LED" },
  { path: "/models/ventilated_disc_brake_pro.glb", name: "Freio Ventilado" },
];

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function MasterTravelerScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const scrollPosRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animId: number;

    // 1. Cena com atmosfera cinematográfica profunda
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090d, 0.032);

    // 2. Câmera
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9.4);

    // 3. Renderizador WebGL de Alto Desempenho
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // 4. Estúdio de Iluminação Automotiva Premium
    // Luz ambiente fria
    const ambientLight = new THREE.AmbientLight(0x0f1722, 2.5);
    scene.add(ambientLight);

    // Keylight principal de teto (ilumina o contorno superior do ônibus)
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.0);
    keyLight.position.set(4, 9, 7);
    scene.add(keyLight);

    // Rim light azul técnico (Azul Rodagem Center Ônibus)
    const rimBlue = new THREE.DirectionalLight(0x2e6da4, 5.8);
    rimBlue.position.set(-8, 4, -6);
    scene.add(rimBlue);

    // Luz de recorte frontal (brilho no para-brisa e lentes)
    const frontFill = new THREE.DirectionalLight(0x70bbff, 3.2);
    frontFill.position.set(0, -3, 8);
    scene.add(frontFill);

    // Ponto de luz vermelha técnica (Vermelho Sinal)
    const signalLight = new THREE.PointLight(0xc8102e, 26, 18, 2);
    signalLight.position.set(-4, -1, 3.5);
    scene.add(signalLight);

    // Grade de chão técnica em perspectiva
    const grid = new THREE.GridHelper(30, 30, 0x2e6da4, 0x122b4a);
    grid.position.set(0, -2.8, 0);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.16;
    scene.add(grid);

    // 5. Constelação 3D de Partículas e Anéis Técnicos
    const particleCount = 50;
    const particleGeometry = new THREE.BoxGeometry(0.04, 0.04, 0.04);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x70bbff,
      transparent: true,
      opacity: 0.5,
    });
    const particlesGroup = new THREE.Group();
    const particleData: { x: number; y: number; z: number; speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const mesh = new THREE.Mesh(particleGeometry, particleMaterial);
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 10 - 2;
      mesh.position.set(x, y, z);
      particlesGroup.add(mesh);
      particleData.push({ x, y, z, speed: 0.002 + Math.random() * 0.005 });
    }
    scene.add(particlesGroup);

    // 6. Grupo Mestre que carrega o modelo ativo
    const masterTravelerGroup = new THREE.Group();
    scene.add(masterTravelerGroup);

    const loadedModels: THREE.Group[] = [];
    const loader = new GLTFLoader();
    let loadedCount = 0;

    MODEL_FILES.forEach((file, index) => {
      loader.load(
        file.path,
        (gltf) => {
          if (disposed) return;
          const group = gltf.scene;

          // Centralização matemática da geometria
          const box = new THREE.Box3().setFromObject(group);
          const center = box.getCenter(new THREE.Vector3());
          group.position.sub(center);

          group.visible = index === 0;
          masterTravelerGroup.add(group);
          loadedModels[index] = group;

          loadedCount++;
          if (loadedCount === MODEL_FILES.length) {
            setIsReady(true);
          }
        },
        undefined,
        (err) => console.error("Erro no modelo", file.path, err)
      );
    });

    // 7. Rastreamento de Scroll e Velocidade Dinâmica
    const onScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollYRef.current;
      scrollVelocityRef.current = deltaY;
      lastScrollYRef.current = currentY;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollPosRef.current = maxScroll > 0 ? Math.min(Math.max(currentY / maxScroll, 0), 1) : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // 8. Rastreamento do Mouse para Paralaxe
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 9. Resize
    const onResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // 10. Loop de Animação com Física e Interpolação Hermite
    let clock = 0;
    let currentX = WAYPOINTS[0].x;
    let currentY = WAYPOINTS[0].y;
    let currentZ = WAYPOINTS[0].z;
    let currentScale = WAYPOINTS[0].scale;
    let currentRotY = WAYPOINTS[0].rotY;
    let currentRotX = WAYPOINTS[0].rotX;
    let activeModelIdx = 0;

    const animate = () => {
      if (disposed) return;
      animId = requestAnimationFrame(animate);

      clock += 0.016;

      // Desaceleração suave da velocidade de scroll
      scrollVelocityRef.current *= 0.91;

      // Interpolação suave do mouse (Lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Localização do segmento de waypoint
      const progress = scrollPosRef.current;
      let pA = WAYPOINTS[0];
      let pB = WAYPOINTS[1];

      for (let i = 0; i < WAYPOINTS.length - 1; i++) {
        if (progress >= WAYPOINTS[i].progress && progress <= WAYPOINTS[i + 1].progress) {
          pA = WAYPOINTS[i];
          pB = WAYPOINTS[i + 1];
          break;
        }
      }

      // Fator de interpolação t (0 a 1) com curva Hermite (smoothstep)
      const segSpan = pB.progress - pA.progress;
      const rawT = segSpan > 0 ? (progress - pA.progress) / segSpan : 0;
      const t = smoothstep(Math.max(0, Math.min(1, rawT)));

      // Posições e rotações alvo
      const targetX = pA.x + (pB.x - pA.x) * t;
      const targetY = pA.y + (pB.y - pA.y) * t;
      const targetZ = pA.z + (pB.z - pA.z) * t;
      const targetScale = pA.scale + (pB.scale - pA.scale) * t;
      const targetRotY = pA.rotY + (pB.rotY - pA.rotY) * t;
      const targetRotX = pA.rotX + (pB.rotX - pA.rotX) * t;

      // Troca suave do modelo 3D ativo
      const nextModelIdx = t > 0.5 ? pB.modelIndex : pA.modelIndex;
      if (nextModelIdx !== activeModelIdx) {
        activeModelIdx = nextModelIdx;
        loadedModels.forEach((m, idx) => {
          if (m) m.visible = idx === activeModelIdx;
        });
      }

      // Respiração orgânica contínua (flutuação senoidal)
      const breathingY = Math.sin(clock * 1.5) * 0.07;
      const breathingRot = Math.cos(clock * 1.1) * 0.035;

      // Tilt lateral aerodinâmico (inclina ativamente para o lado do movimento)
      const deltaFlightX = targetX - currentX;
      const aerodynamicTilt = deltaFlightX * 0.42;

      // Pitch vinculado à velocidade do scroll
      const velocityPitch = Math.max(-0.28, Math.min(0.28, scrollVelocityRef.current * 0.009));

      // LERP contínuo de aproximação
      currentX += (targetX + mouseRef.current.x * 0.45 - currentX) * 0.085;
      currentY += (targetY + breathingY - mouseRef.current.y * 0.35 - currentY) * 0.085;
      currentZ += (targetZ - currentZ) * 0.085;
      currentScale += (targetScale - currentScale) * 0.085;

      currentRotY += (targetRotY + breathingRot + mouseRef.current.x * 0.35 - currentRotY) * 0.08;
      currentRotX += (targetRotX + velocityPitch - mouseRef.current.y * 0.25 - currentRotX) * 0.08;

      // Atualização dos parâmetros 3D no grupo mestre
      masterTravelerGroup.position.set(currentX, currentY, currentZ);
      masterTravelerGroup.scale.setScalar(currentScale);
      masterTravelerGroup.rotation.set(currentRotX, currentRotY, aerodynamicTilt);

      // Flutuação das partículas de profundidade
      particlesGroup.children.forEach((p, i) => {
        const data = particleData[i];
        p.position.y += Math.sin(clock + i) * data.speed;
        p.position.x += Math.cos(clock * 0.5 + i) * (data.speed * 0.5);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
