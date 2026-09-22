"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./united-bus-showcase.css";

interface Chapter {
  id: string;
  code: string;
  badge: string;
  kicker: string;
  title: string;
  copy: string;
  specs: [string, string][];
  telemetry: {
    pressao: string;
    temperatura: string;
    tolerancia: string;
    homologacao: string;
    velocidade: string;
  };
  modelPath: string;
  targetSize: number;
  yOffset: number;
  actionText: string;
  actionHref: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "farol",
    code: "01 / FARÓIS & PROJETORES",
    badge: "MARCOPOLO G7/G8 • CAIO • COMIL",
    kicker: "Óptica Automotiva Pesada",
    title: "Bloco Óptico Dianteiro com Faróis Triplos",
    copy: "Conjunto óptico principal com canhões circulares de alta profundidade, projetores bi-LED/halógenos, pisca âmbar integrado e lente frontal em policarbonato curvo anti-impacto. Conexão original plug-and-play.",
    specs: [
      ["Configuração", "Farol Principal + Farol Alto + Pisca Âmbar"],
      ["Tensão / Potência", "24V Heavy Duty Automotivo"],
      ["Lente Externa", "Policarbonato Curvo com Proteção UV"],
      ["Disponibilidade", "Pronta-Entrega no Armazém Central"],
    ],
    telemetry: {
      pressao: "1.0 ATM",
      temperatura: "42°C",
      tolerancia: "IP68 VEDAÇÃO",
      homologacao: "CONTRAN / ECE",
      velocidade: "110 KM/H",
    },
    modelPath: "/models/farol_dianteiro_triplo.glb",
    targetSize: 3.8,
    yOffset: 0.0,
    actionText: "Ver Linha de Faróis",
    actionHref: "/produtos",
  },
  {
    id: "lanterna",
    code: "02 / LANTERNAS MODULARES",
    badge: "LEDS MODULARES • G7/G8",
    kicker: "Visibilidade Noturna e Sinalização",
    title: "Lanterna Traseira Vertical Modular em LED",
    copy: "Bloco vertical aerodinâmico com matriz de LEDs de alto brilho para luz de posição, freio e ré com lente acrílica em Vermelho Sinal. Resistente a lavagens de alta pressão e trepidação severa de estrada.",
    specs: [
      ["Tecnologia", "Matriz LED SMD de Alta Eficiência"],
      ["Carcaça", "ABS Termoplástico com Vedação NBR"],
      ["Aplicação", "Ônibus Rodoviários e Frotas de Turismo"],
      ["Garantia", "Rastreabilidade Técnica ISO 9001"],
    ],
    telemetry: {
      pressao: "1.0 ATM",
      temperatura: "34°C",
      tolerancia: "IP67 SELADO",
      homologacao: "INMETRO OEM",
      velocidade: "105 KM/H",
    },
    modelPath: "/models/lanterna_traseira_led.glb",
    targetSize: 4.2,
    yOffset: 0.0,
    actionText: "Cotar Linha de Lanternas",
    actionHref: "/fale-conosco",
  },
  {
    id: "pantografico",
    code: "03 / LIMPADORES & PANTOGRÁFICOS",
    badge: "24V HEAVY-DUTY • CINPAL/DYNA",
    kicker: "Varredura Panorâmica Contínua",
    title: "Mecanismo Pantográfico de Limpador 24V",
    copy: "Motor elétrico de alto torque acoplado a redutor blindado com braços paralelos articulados pantográficos em aço zincado. Garante varredura limpa em parabrisas panorâmicos sob chuva torrencial.",
    specs: [
      ["Motorização", "Motor 24V Heavy-Duty com Redutor Integrado"],
      ["Braços", "Pantográficos Duplos em Aço Bicromatizado"],
      ["Palheta", "Perfil Aerodinâmico de Alta Duração"],
      ["Despacho", "Envio Imediato para todo Brasil"],
    ],
    telemetry: {
      pressao: "2.4 Nm TORQUE",
      temperatura: "58°C",
      tolerancia: "± 0.1 mm",
      homologacao: "PADRÃO MONTADORA",
      velocidade: "95 KM/H",
    },
    modelPath: "/models/mecanismo_pantografico_limpador.glb",
    targetSize: 3.8,
    yOffset: -0.2,
    actionText: "Ver Sistemas de Limpador",
    actionHref: "/produtos",
  },
  {
    id: "alcapao",
    code: "04 / ESCOTILHAS & TETO",
    badge: "VENTILAÇÃO & SEGURANÇA ANTT",
    kicker: "Conforto de Cabine e Saída Rápida",
    title: "Alçapão de Teto com Exaustão e Emergência",
    copy: "Escotilha superior aerodinâmica com grelha central de circulação de ar, guarnição perimetral hermética e travas de segurança em Vermelho Sinal para abertura emergencial rápida conforme norma regulamentar.",
    specs: [
      ["Material", "Composto SMC Reforçado Anti-UV"],
      ["Função Dupla", "Exaustão Contínua + Saída de Emergência"],
      ["Vedação", "Guarnição de Borracha Esponjosa NBR"],
      ["Homologação", "Normas Regulamentadoras ANTT / ABNT"],
    ],
    telemetry: {
      pressao: "1.0 ATM",
      temperatura: "30°C",
      tolerancia: "ABNT NBR 14040",
      homologacao: "HOMOLOGADO ANTT",
      velocidade: "100 KM/H",
    },
    modelPath: "/models/alcapao_teto_emergencia.glb",
    targetSize: 3.6,
    yOffset: 0.0,
    actionText: "Consultar Linha de Escotilhas",
    actionHref: "/produtos",
  },
  {
    id: "retrovisor",
    code: "05 / RETROVISORES & CABINE",
    badge: "FIBRA REFORÇADA • BIPARTIDO",
    kicker: "Campo Visual Sem Pontos Cegos",
    title: "Espelho Retrovisor com Braço Aerodinâmico",
    copy: "Braço carenado com curvatura aerodinâmica em Vermelho Sinal, coifa sanfonada flexível e espelho bipartido com lente plana superior e lente convexa inferior para eliminação total de pontos cegos.",
    specs: [
      ["Design", "Braço Carenado em Vermelho Sinal Oficial"],
      ["Vidro", "Bipartido com Lente Convexa Ampla"],
      ["Articulação", "Coifa Sanfonada com Mola de Retenção"],
      ["Aplicação", "Marcopolo Paradiso, Comil Campione e Caio"],
    ],
    telemetry: {
      pressao: "1.0 ATM",
      temperatura: "28°C",
      tolerancia: "RAIO R1200",
      homologacao: "CONTRAN RES. 226",
      velocidade: "110 KM/H",
    },
    modelPath: "/models/espelho_retrovisor_rodoviario.glb",
    targetSize: 3.7,
    yOffset: -0.1,
    actionText: "Cotar Retrovisores de Ônibus",
    actionHref: "/fale-conosco",
  },
];

type RenderMode = "solid" | "wireframe";

export function UnitedBusShowcase() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [renderMode, setRenderMode] = useState<RenderMode>("solid");
  const [isLoading, setIsLoading] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelsMapRef = useRef<Map<number, THREE.Group>>(new Map());
  const solidMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
  const wireMaterialsRef = useRef<Map<THREE.Mesh, THREE.MeshBasicMaterial>>(new Map());
  const rigRef = useRef<THREE.Group | null>(null);

  // Drag rotation states
  const rotRef = useRef({ yaw: -0.2, pitch: 0.08, targetYaw: -0.2, targetPitch: 0.08 });
  const activeIdxRef = useRef(0);
  const renderModeRef = useRef<RenderMode>("solid");

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    renderModeRef.current = renderMode;
    applyRenderMode(renderMode);
  }, [renderMode]);

  const applyRenderMode = (mode: RenderMode) => {
    const currentModel = modelsMapRef.current.get(activeIdxRef.current);
    if (!currentModel) return;

    currentModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mode === "wireframe") {
          const wireMat = wireMaterialsRef.current.get(mesh);
          if (wireMat) mesh.material = wireMat;
        } else {
          const solidMat = solidMaterialsRef.current.get(mesh);
          if (solidMat) mesh.material = solidMat;
        }
      }
    });
  };

  const switchChapter = (nextIdx: number) => {
    if (nextIdx === activeIdxRef.current) return;
    const prevIdx = activeIdxRef.current;
    setActiveIdx(nextIdx);

    const prevModel = modelsMapRef.current.get(prevIdx);
    const nextModel = modelsMapRef.current.get(nextIdx);

    if (prevModel) {
      prevModel.visible = false;
    }

    if (nextModel) {
      nextModel.visible = true;
      nextModel.scale.setScalar(0.01);
      
      // Animate entry with clean lerp
      let p = 0;
      const step = () => {
        p += 0.08;
        const s = THREE.MathUtils.lerp(0.01, 1, Math.min(p, 1));
        nextModel.scale.setScalar(s);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);

      // Reset base rotation
      rotRef.current.targetYaw = -0.2;
      rotRef.current.targetPitch = 0.08;
    }

    applyRenderMode(renderModeRef.current);
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animId: number;

    // 1. Scene setup with technical dark fog matching Preto Técnico (#101418)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101418, 0.035);
    sceneRef.current = scene;

    // 2. Perspective Camera
    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.15, 8.6);
    cameraRef.current = camera;

    // 3. WebGL Renderer with ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Studio - Automotivo Sóbrio
    const ambientLight = new THREE.AmbientLight(0x122b4a, 2.6);
    scene.add(ambientLight);

    // Keylight principal branca de alta definição
    const keyLight = new THREE.DirectionalLight(0xf4f4f4, 4.4);
    keyLight.position.set(5, 7, 7);
    scene.add(keyLight);

    // Rim light técnica em Azul Rodagem (#2E6DA4)
    const rimBlue = new THREE.DirectionalLight(0x2e6da4, 4.8);
    rimBlue.position.set(-7, 3, -6);
    scene.add(rimBlue);

    // Luz frontal suave técnica
    const frontFill = new THREE.DirectionalLight(0x2e6da4, 2.2);
    frontFill.position.set(0, -2, 7);
    scene.add(frontFill);

    // Ponto de luz Vermelho Sinal (#C8102E)
    const signalLight = new THREE.PointLight(0xc8102e, 16, 14, 2);
    signalLight.position.set(-3.5, -0.4, 2.8);
    scene.add(signalLight);

    // Grade técnica de piso
    const grid = new THREE.GridHelper(22, 22, 0x2e6da4, 0x122b4a);
    grid.position.set(0, -2.2, 0);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.24;
    scene.add(grid);

    // 5. Rig mestre para os modelos
    const rig = new THREE.Group();
    scene.add(rig);
    rigRef.current = rig;

    // 6. Carregamento dos Modelos GLB Autênticos do Catálogo
    const loader = new GLTFLoader();
    let loadedCount = 0;

    CHAPTERS.forEach((ch, idx) => {
      loader.load(
        ch.modelPath,
        (gltf) => {
          if (disposed) return;
          const rootGroup = gltf.scene;
          rootGroup.name = ch.id;

          // Normalização matemática de proporção e centralização
          const bounds = new THREE.Box3().setFromObject(rootGroup);
          const center = bounds.getCenter(new THREE.Vector3());
          const size = bounds.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z, 0.001);
          const scale = ch.targetSize / maxDim;

          rootGroup.position.copy(center).multiplyScalar(-scale);
          rootGroup.position.y += ch.yOffset;
          rootGroup.scale.setScalar(scale);

          // Suavização das superfícies e preparação dos materiais
          rootGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              // Garante que normais sejam perfeitamente interpoladas e curvas
              if (mesh.geometry) {
                mesh.geometry.computeVertexNormals();
              }

              // Salva material original sólido
              solidMaterialsRef.current.set(mesh, mesh.material);

              // Cria material técnico Raio-X limpo em Azul Rodagem / Vermelho Sinal
              const wireMat = new THREE.MeshBasicMaterial({
                color: idx === 1 || idx === 4 ? 0xc8102e : 0x2e6da4,
                wireframe: true,
                transparent: true,
                opacity: 0.8,
              });
              wireMaterialsRef.current.set(mesh, wireMat);
            }
          });

          const wrapper = new THREE.Group();
          wrapper.add(rootGroup);
          wrapper.visible = idx === 0;
          rig.add(wrapper);
          modelsMapRef.current.set(idx, wrapper);

          loadedCount++;
          if (loadedCount === CHAPTERS.length) {
            setIsLoading(false);
          }
        },
        undefined,
        (err) => {
          console.error("Erro ao carregar modelo GLB:", ch.modelPath, err);
          loadedCount++;
          if (loadedCount === CHAPTERS.length) setIsLoading(false);
        }
      );
    });

    // 7. Controles de Arraste / Rotação 360° Suavizada
    let isDown = false;
    let startX = 0;
    let startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      setIsInteracting(true);
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;

      rotRef.current.targetYaw += dx * 0.007;
      rotRef.current.targetPitch = THREE.MathUtils.clamp(
        rotRef.current.targetPitch + dy * 0.005,
        -0.45,
        0.45
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      isDown = false;
      setIsInteracting(false);
      renderer.domElement.style.cursor = "grab";
      try {
        if (renderer.domElement.hasPointerCapture(e.pointerId)) {
          renderer.domElement.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    };

    const dom = renderer.domElement;
    dom.style.cursor = "grab";
    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("pointercancel", onPointerUp);

    // 8. Resize Handler
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("resize", handleResize);

    // 9. Loop de Renderização 60 FPS
    let clock = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (disposed) return;
      clock += 0.016;

      // Suavização da rotação manual (damped lerp)
      rotRef.current.yaw += (rotRef.current.targetYaw - rotRef.current.yaw) * 0.08;
      rotRef.current.pitch += (rotRef.current.targetPitch - rotRef.current.pitch) * 0.08;

      // Auto-rotação sutil contínua
      if (!isDown) {
        rotRef.current.targetYaw += 0.002;
      }

      if (rig) {
        rig.rotation.y = rotRef.current.yaw;
        rig.rotation.x = rotRef.current.pitch;
      }

      // Efeito de respiração sutil na câmera
      camera.position.y = 0.15 + Math.sin(clock * 0.8) * 0.03;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("pointercancel", onPointerUp);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const currentChapter = CHAPTERS[activeIdx];

  return (
    <section className="ubs-section" aria-label="Showcase de Engenharia de Peças de Carroceria">
      {/* HUD Superior: Seletor de Capítulos das Peças do Catálogo */}
      <div className="ubs-nav-tabs-bar">
        <div className="ubs-tabs-track">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              className={`ubs-tab-item ${activeIdx === idx ? "is-active" : ""}`}
              onClick={() => switchChapter(idx)}
            >
              <span className="ubs-tab-dot" />
              <span className="ubs-tab-label">{ch.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cockpit Principal: 3D Viewport Curvo + Painel Editorial Integrado */}
      <div className="ubs-cockpit-grid">
        {/* Painel Esquerdo: Conteúdo Editorial e Dados de Homologação */}
        <div className="ubs-editorial-panel">
          <div className="ubs-meta-badge">
            <span className="ubs-badge-dot" />
            <span>{currentChapter.badge}</span>
          </div>

          <span className="ubs-kicker">{currentChapter.kicker}</span>
          <h2 className="ubs-panel-title">{currentChapter.title}</h2>
          <p className="ubs-panel-copy">{currentChapter.copy}</p>

          {/* Tabela de Especificações Técnicas Milimétricas */}
          <dl className="ubs-specs-table">
            {currentChapter.specs.map(([label, val]) => (
              <div key={label} className="ubs-spec-item">
                <dt>{label}</dt>
                <dd>{val}</dd>
              </div>
            ))}
          </dl>

          {/* Ações Diretas */}
          <div className="ubs-actions-row">
            <Link className="home-2-btn-primary" href={currentChapter.actionHref}>
              {currentChapter.actionText} →
            </Link>
            <button
              type="button"
              className="ubs-btn-mode"
              onClick={() =>
                setRenderMode((m) => (m === "wireframe" ? "solid" : "wireframe"))
              }
            >
              {renderMode === "wireframe" ? "Ver Superfície Sólida PBR" : "Modo Raio-X Técnico"}
            </button>
          </div>
        </div>

        {/* Palco Central: Visualizador WebGL 3D em Tempo Real */}
        <div className="ubs-viewport-container">
          <div ref={mountRef} className="ubs-canvas-mount" />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="ubs-loading-overlay">
              <div className="ubs-spinner" />
              <span>CARREGANDO MODELO CAD 3D...</span>
            </div>
          )}

          {/* Dica de Interação 360° */}
          <div className={`ubs-interact-badge ${isInteracting ? "is-active" : ""}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            <span>Peça do Catálogo Oficial • Arraste 360°</span>
          </div>

          {/* HUD de Telemetria Inferior Estilo United Carriers */}
          <div className="ubs-telemetry-strip">
            <div className="ubs-telemetry-col">
              <span className="ubs-tele-label">PRESSÃO / TORQUE</span>
              <strong className="ubs-tele-val">{currentChapter.telemetry.pressao}</strong>
            </div>
            <div className="ubs-telemetry-col">
              <span className="ubs-tele-label">TEMPERATURA</span>
              <strong className="ubs-tele-val">{currentChapter.telemetry.temperatura}</strong>
            </div>
            <div className="ubs-telemetry-col">
              <span className="ubs-tele-label">TOLERÂNCIA</span>
              <strong className="ubs-tele-val">{currentChapter.telemetry.tolerancia}</strong>
            </div>
            <div className="ubs-telemetry-col">
              <span className="ubs-tele-label">HOMOLOGAÇÃO</span>
              <strong className="ubs-tele-val ubs-tele-iso">{currentChapter.telemetry.homologacao}</strong>
            </div>
          </div>

          {/* Controles de Renderização (Solid / Wireframe) */}
          <div className="ubs-render-toggles">
            <button
              type="button"
              className={`ubs-toggle-btn ${renderMode === "solid" ? "is-active" : ""}`}
              onClick={() => setRenderMode("solid")}
            >
              Sólido PBR
            </button>
            <button
              type="button"
              className={`ubs-toggle-btn ${renderMode === "wireframe" ? "is-active" : ""}`}
              onClick={() => setRenderMode("wireframe")}
            >
              Raio-X CAD
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
