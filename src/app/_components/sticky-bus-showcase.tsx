"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { brandColors } from "../_lib/brand-tokens";
import "./sticky-bus-showcase.css";

interface StageInfo {
  tag: string;
  title: string;
  copy: string;
  specs: { label: string; value: string }[];
  actionText: string;
  actionHref: string;
  align: "align-left" | "align-right" | "align-center";
  modelIndex: number;
}

const STAGES: StageInfo[] = [
  {
    tag: "CARROCERIA & ESTRUTURA",
    title: "Engenharia de Carroceria Heavy-Duty",
    copy: "Identificação precisa de componentes para frotas rodoviárias e urbanas. Compatível com Caio, Marcopolo, Comil e Neobus.",
    specs: [
      { label: "Aplicação", value: "Marcopolo / Caio / Comil" },
      { label: "Linha", value: "Rodoviário & Urbano G8/BRT" },
      { label: "Conferência", value: "Por Chassi, Foto e Código" },
      { label: "Disponibilidade", value: "Pronta-Entrega Imediata" },
    ],
    actionText: "Consultar Peças de Carroceria",
    actionHref: "/produtos",
    align: "align-left",
    modelIndex: 0,
  },
  {
    tag: "SISTEMA DE SUSPENSÃO PNEUMÁTICA",
    title: "Fole de Suspensão com Anéis de Aço",
    copy: "Bolsa de ar vulcanizada com tripla lona de reforço estrutural e pratos usinados. Absorção máxima de impacto para manter a estabilidade da rota.",
    specs: [
      { label: "Código", value: "CO-SUS 8841-P" },
      { label: "Construção", value: "Borracha vulcanizada NBR" },
      { label: "Pressão de Teste", value: "Até 16 bar contínuos" },
      { label: "Compatibilidade", value: "Scania, Volvo, Mercedes-Benz" },
    ],
    actionText: "Solicitar Cotação de Suspensão",
    actionHref: "/fale-conosco",
    align: "align-right",
    modelIndex: 1,
  },
  {
    tag: "CLIMATIZAÇÃO & CONFORTO TÉRMICO",
    title: "Compressor Heavy-Duty Spheros / Denso",
    copy: "Unidade de refrigeração para ar-condicionado de teto com embreagem eletromagnética de duplo rolamento e aletas de alto rendimento.",
    specs: [
      { label: "Código OEM", value: "CO-CLI 9030-S" },
      { label: "Capacidade", value: "Linha CC305 / CC355" },
      { label: "Polia", value: "Multi-V estriada balanceada" },
      { label: "Garantia", value: "Certificação ISO 9001" },
    ],
    actionText: "Ver Peças de Climatização",
    actionHref: "/produtos",
    align: "align-left",
    modelIndex: 2,
  },
  {
    tag: "ILUMINAÇÃO & BLOCO ÓPTICO",
    title: "Farol Dianteiro Bi-LED com DRL Integrado",
    copy: "Bloco óptico automotivo com projetor bi-led duplo e guia de luz em acrílico óptico. Encaixe original milimétrico para reposição sem retrabalho.",
    specs: [
      { label: "Código", value: "CO-ILU 4410-LED" },
      { label: "Tecnologia", value: "Bi-LED Projetor 6000K" },
      { label: "Lente", value: "Policarbonato anti-amarelamento" },
      { label: "Tensão", value: "24V automotivo pesado" },
    ],
    actionText: "Consultar Linha de Iluminação",
    actionHref: "/produtos",
    align: "align-right",
    modelIndex: 3,
  },
  {
    tag: "FRENAGEM & PRONTA-ENTREGA",
    title: "Disco Autoventilado com Pinça Dupla",
    copy: "Rotor de freio com canais de ventilação radial para dissipação imediata de temperatura. Segurança operacional comprovada.",
    specs: [
      { label: "Código", value: "CO-FRE 2205-HD" },
      { label: "Material", value: "Ferro fundido nodular GG25" },
      { label: "Acabamento", value: "Balanceamento dinâmico G2.5" },
      { label: "Despacho", value: "Embarque no mesmo dia" },
    ],
    actionText: "Falar com Especialista Agora",
    actionHref: "/fale-conosco",
    align: "align-center",
    modelIndex: 4,
  },
];

const MODEL_CONFIGS = [
  { path: "/models/bus_coach_heavy_duty.glb", name: "Ônibus Completo", scale: 0.85, yOffset: -0.8 },
  { path: "/models/air_suspension_bellow.glb", name: "Suspensão a Ar", scale: 1.55, yOffset: 0.1 },
  { path: "/models/ac_compressor_heavy.glb", name: "Compressor AC", scale: 1.45, yOffset: 0.0 },
  { path: "/models/led_projector_headlight.glb", name: "Farol Bi-LED", scale: 1.5, yOffset: 0.0 },
  { path: "/models/ventilated_disc_brake_pro.glb", name: "Freio a Disco", scale: 1.4, yOffset: 0.0 },
];

type RenderMode = "pbr" | "wireframe" | "exploded";

export function StickyBusShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [renderMode, setRenderMode] = useState<RenderMode>("pbr");
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Referências mutáveis para Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const loadedGroupsRef = useRef<THREE.Group[]>([]);
  const materialsMapRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
  const wireframeMaterialsRef = useRef<Map<THREE.Mesh, THREE.MeshBasicMaterial>>(new Map());

  // Controle de rotação com arrasto
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const manualRotationRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  // Inicialização do Three.js e carregamento dos modelos 3D
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    let disposed = false;
    let animationFrameId: number;

    // 1. Criação da Cena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Névoa para transição perfeita de profundidade
    scene.fog = new THREE.FogExp2(0x0a0d12, 0.04);

    // 2. Câmera
    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.8, 8.5);
    cameraRef.current = camera;

    // 3. Renderizador WebGL
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Iluminação Industrial Dramática
    const ambientLight = new THREE.AmbientLight(0x122b4a, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf4f4f4, 3.8);
    keyLight.position.set(5, 7, 7);
    scene.add(keyLight);

    const rimBlueLight = new THREE.DirectionalLight(0x2e6da4, 3.5);
    rimBlueLight.position.set(-6, 4, -5);
    scene.add(rimBlueLight);

    const signalRedLight = new THREE.PointLight(brandColors.signalRed, 18, 14, 2);
    signalRedLight.position.set(-3.5, -0.5, 3.5);
    scene.add(signalRedLight);

    // Grade de solo técnica sutil
    const grid = new THREE.GridHelper(24, 24, 0x2e6da4, 0x122b4a);
    grid.position.set(0, -2.4, 0);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.22;
    scene.add(grid);

    // 5. Carregamento dos 5 Modelos 3D
    const loader = new GLTFLoader();
    const loadedGroups: THREE.Group[] = [];
    let loadedCount = 0;

    MODEL_CONFIGS.forEach((config, idx) => {
      loader.load(
        config.path,
        (gltf) => {
          if (disposed) return;
          const modelGroup = gltf.scene;
          modelGroup.name = config.name;

          // Normaliza e centraliza o modelo
          const box = new THREE.Box3().setFromObject(modelGroup);
          const center = box.getCenter(new THREE.Vector3());
          modelGroup.position.sub(center);
          modelGroup.position.y += config.yOffset;
          modelGroup.scale.setScalar(config.scale);

          // Salva materiais originais para modo wireframe
          modelGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              materialsMapRef.current.set(mesh, mesh.material);
              
              const wireMat = new THREE.MeshBasicMaterial({
                color: 0x70bbff,
                wireframe: true,
                transparent: true,
                opacity: 0.75,
              });
              wireframeMaterialsRef.current.set(mesh, wireMat);
            }
          });

          // Apenas o modelo inicial visível por padrão
          modelGroup.visible = idx === 0;
          scene.add(modelGroup);
          loadedGroups[idx] = modelGroup;

          loadedCount++;
          setLoadProgress(Math.round((loadedCount / MODEL_CONFIGS.length) * 100));

          if (loadedCount === MODEL_CONFIGS.length) {
            loadedGroupsRef.current = loadedGroups;
            setIsLoaded(true);
          }
        },
        undefined,
        (err) => {
          console.error(`Erro ao carregar modelo ${config.path}:`, err);
        }
      );
    });

    // 6. Redimensionamento da Janela
    const handleResize = () => {
      if (!mount || !camera || !renderer) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // 7. Loop de Renderização e Animação Fluida (LERP)
    let angle = 0;
    const animate = () => {
      if (disposed) return;
      animationFrameId = requestAnimationFrame(animate);

      angle += 0.004;

      // Animação do modelo ativo
      const activeIdx = activeModelIndex;
      const currentModel = loadedGroupsRef.current[activeIdx];

      if (currentModel) {
        // Interpolação suave de rotação automática + manual pelo usuário
        const targetRotY = isDraggingRef.current
          ? manualRotationRef.current.y
          : manualRotationRef.current.y + (activeIdx === 0 ? Math.sin(angle * 0.5) * 0.35 + 0.6 : angle * 0.8);

        const targetRotX = manualRotationRef.current.x;

        currentModel.rotation.y += (targetRotY - currentModel.rotation.y) * 0.08;
        currentModel.rotation.x += (targetRotX - currentModel.rotation.x) * 0.08;

        // Efeito de levitação suave
        const floatOffset = Math.sin(angle * 1.5) * 0.06;
        const baseOffset = MODEL_CONFIGS[activeIdx]?.yOffset ?? 0;
        currentModel.position.y += (baseOffset + floatOffset - currentModel.position.y) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [activeModelIndex]);

  // Atualiza visibilidade entre os modelos
  useEffect(() => {
    loadedGroupsRef.current.forEach((group, index) => {
      if (group) {
        group.visible = index === activeModelIndex;
      }
    });
  }, [activeModelIndex]);

  // Alternância de modo de renderização (PBR vs Wireframe vs Vista Explodida)
  useEffect(() => {
    const activeGroup = loadedGroupsRef.current[activeModelIndex];
    if (!activeGroup) return;

    activeGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (renderMode === "wireframe") {
          const wireMat = wireframeMaterialsRef.current.get(mesh);
          if (wireMat) mesh.material = wireMat;
        } else {
          const origMat = materialsMapRef.current.get(mesh);
          if (origMat) mesh.material = origMat;
        }
      }
    });

    // Efeito de vista explodida afastando peças filhas
    if (renderMode === "exploded") {
      let childIdx = 0;
      activeGroup.children.forEach((child) => {
        childIdx++;
        const factor = (childIdx % 2 === 0 ? 1 : -1) * (0.2 + (childIdx * 0.06));
        child.position.x = factor;
        child.position.y += Math.sin(childIdx) * 0.15;
      });
    } else {
      activeGroup.children.forEach((child) => {
        // Retorna peças para posição neutra
        child.position.x = 0;
      });
    }
  }, [renderMode, activeModelIndex]);

  // Sincronização com o Scroll da Página (Scrollytelling contínuo)
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || isManualOverride) return;

      const rect = container.getBoundingClientRect();
      const scrollHeight = container.offsetHeight - window.innerHeight;
      
      if (scrollHeight <= 0) return;

      // Progresso normalizado de 0 a 1 dentro da seção
      const progress = Math.min(Math.max(-rect.top / scrollHeight, 0), 1);
      scrollProgressRef.current = progress;

      // Determina qual estágio está ativo com base no progresso
      const stageIdx = Math.min(
        Math.floor(progress * STAGES.length),
        STAGES.length - 1
      );

      setCurrentStageIndex(stageIdx);
      setActiveModelIndex(STAGES[stageIdx].modelIndex);

      // Câmera interpola de acordo com o estágio
      if (cameraRef.current) {
        const cam = cameraRef.current;
        if (stageIdx === 0) {
          cam.position.set(0, 0.8, 8.5);
        } else if (stageIdx === 1) {
          cam.position.set(1.2, 0.4, 5.8);
        } else if (stageIdx === 2) {
          cam.position.set(-1.0, 0.2, 6.2);
        } else if (stageIdx === 3) {
          cam.position.set(0.8, 0.1, 5.5);
        } else {
          cam.position.set(0, 0.5, 6.0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isManualOverride]);

  // Controle de Arrasto Manual (Mouse / Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    manualRotationRef.current.y += deltaX * 0.012;
    manualRotationRef.current.x = Math.max(-0.6, Math.min(0.6, manualRotationRef.current.x + deltaY * 0.012));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Seleção manual de modelo pela barra de botões
  const selectModelManually = (index: number) => {
    setIsManualOverride(true);
    setActiveModelIndex(index);
    setCurrentStageIndex(index);
    manualRotationRef.current = { x: 0, y: 0 };
  };

  return (
    <section ref={containerRef} className="sticky-bus-container" aria-label="Showcase 3D Interativo de Ônibus e Peças">
      {/* Viewport Travado (Sticky) */}
      <div 
        className="sticky-bus-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Camadas de Iluminação e Grid */}
        <div className="sticky-bus-grid-overlay" aria-hidden="true" />
        <div className="sticky-bus-vignette" aria-hidden="true" />

        {/* Canvas WebGL */}
        <div ref={canvasMountRef} className="sticky-bus-canvas-host" />

        {/* Barra Superior do HUD */}
        <div className="sticky-bus-hud-bar">
          <div className="sticky-bus-hud-badge">
            <span className="sticky-bus-hud-dot" />
            <span>Center 3D Studio • {isLoaded ? "SISTEMA SINCRONIZADO" : `CARREGANDO ${loadProgress}%`}</span>
          </div>

          <div className="sticky-bus-controls">
            {MODEL_CONFIGS.map((cfg, idx) => (
              <button
                key={cfg.name}
                type="button"
                className={`sticky-bus-control-btn ${activeModelIndex === idx ? "is-active" : ""}`}
                onClick={() => selectModelManually(idx)}
              >
                {cfg.name}
              </button>
            ))}

            <button
              type="button"
              className={`sticky-bus-control-btn ${renderMode === "wireframe" ? "is-active" : ""}`}
              onClick={() => setRenderMode((m) => (m === "wireframe" ? "pbr" : "wireframe"))}
              title="Modo Blueprint Raio-X"
            >
              Raio-X
            </button>

            <button
              type="button"
              className={`sticky-bus-control-btn ${renderMode === "exploded" ? "is-active" : ""}`}
              onClick={() => setRenderMode((m) => (m === "exploded" ? "pbr" : "exploded"))}
              title="Vista Explodida Técnica"
            >
              Vista Explodida
            </button>
          </div>
        </div>

        {/* Dica de Rotação 3D */}
        <div className="sticky-bus-drag-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          <span>Arraste com o mouse para inspecionar em 360°</span>
        </div>

        {/* Indicador de Etapas Vertical */}
        <div className="sticky-bus-progress-track">
          {STAGES.map((stg, i) => (
            <span
              key={stg.tag}
              className={`sticky-bus-step-node ${currentStageIndex === i ? "is-active" : ""}`}
              title={stg.title}
            />
          ))}
        </div>

        {/* Cartões Deslizantes com Informações Técnicas */}
        {STAGES.map((stage, idx) => {
          const isVisible = currentStageIndex === idx;
          return (
            <article
              key={stage.tag}
              className={`sticky-bus-stage-card ${stage.align} ${isVisible ? "is-visible" : "is-hidden"}`}
              aria-hidden={!isVisible}
            >
              <span className="sticky-bus-card-tag">{stage.tag}</span>
              <h3 className="sticky-bus-card-title">{stage.title}</h3>
              <p className="sticky-bus-card-copy">{stage.copy}</p>

              <div className="sticky-bus-specs-grid">
                {stage.specs.map((spec) => (
                  <div key={spec.label} className="sticky-bus-spec-item">
                    <span className="sticky-bus-spec-label">{spec.label}</span>
                    <strong className="sticky-bus-spec-value">{spec.value}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <Link className="sticky-bus-card-action" href={stage.actionHref}>
                  {stage.actionText} →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
