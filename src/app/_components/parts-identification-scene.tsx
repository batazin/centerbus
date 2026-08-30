"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { brandColors } from "../_lib/brand-tokens";

const models = [
  { path: "/particles/onibus.glb", label: "Carroceria", code: "CAR 01", color: brandColors.chassisGray, title: "Explore o conjunto.", copy: "Arraste para girar o ônibus. Abra a vista explodida e selecione um componente para inspecionar." },
  { path: "/particles/engine_radiator.glb", label: "Climatização", code: "CLI 04", color: brandColors.roadBlue, title: "Sistema de climatização.", copy: "Seleção técnica por fabricante, aplicação e configuração do equipamento instalado." },
  { path: "/particles/disk_brake.glb", label: "Freio", code: "FRE 02", color: brandColors.signalRed, title: "Conjunto de freio.", copy: "A conferência considera medidas, montagem e aplicação antes da separação da peça." },
  { path: "/particles/battery.glb", label: "Elétrica", code: "ELE 03", color: brandColors.chassisGray, title: "Sistema elétrico.", copy: "Modelo, capacidade e posição dos terminais orientam a identificação correta do componente." },
] as const;

type ViewMode = "assembled" | "exploded";

export function PartsIdentificationScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(0);
  const viewModeRef = useRef<ViewMode>("exploded");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("exploded");
  const [isReady, setIsReady] = useState(false);
  const [shouldInitialize, setShouldInitialize] = useState(false);

  const selectModel = (index: number) => {
    selectedRef.current = index;
    setSelectedIndex(index);
    if (index > 0 && viewModeRef.current === "assembled") {
      viewModeRef.current = "exploded";
      setViewMode("exploded");
    }
  };

  const changeView = (mode: ViewMode) => {
    viewModeRef.current = mode;
    setViewMode(mode);
    if (mode === "assembled") {
      selectedRef.current = 0;
      setSelectedIndex(0);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldInitialize(true);
      observer.disconnect();
    }, { rootMargin: "700px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldInitialize) return;
    const mount = canvasRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(brandColors.centerBlue, 0.034);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.1, 10.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1.25 : 1.8));
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(brandColors.chassisGray, brandColors.technicalBlack, 2.4));
    const keyLight = new THREE.DirectionalLight(brandColors.centerWhite, 4.4);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);
    const signalLight = new THREE.PointLight(brandColors.signalRed, 22, 16, 2);
    signalLight.position.set(-4, 1, 4);
    scene.add(signalLight);

    const rig = new THREE.Group();
    scene.add(rig);
    const loaded: THREE.Group[] = [];
    const edgesByModel: THREE.LineBasicMaterial[][] = models.map(() => []);
    let disposed = false;

    const floor = new THREE.GridHelper(18, 18, brandColors.roadBlue, brandColors.centerBlue);
    floor.position.set(0, -2.85, -1.1);
    floor.material.transparent = true;
    floor.material.opacity = 0.24;
    scene.add(floor);

    const scanMaterial = new THREE.MeshBasicMaterial({ color: brandColors.signalRed, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false });
    const scanBeam = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 0.035), scanMaterial);
    scanBeam.position.set(1.55, 2.8, 2.15);
    scene.add(scanBeam);

    const normalizeModel = (group: THREE.Group, index: number) => {
      const bounds = new THREE.Box3().setFromObject(group);
      const center = bounds.getCenter(new THREE.Vector3());
      const size = bounds.getSize(new THREE.Vector3());
      const targetSize = index === 0 ? 5.4 : index === 2 ? 2.1 : 2.55;
      const scale = targetSize / Math.max(size.x, size.y, size.z, 0.001);
      group.position.copy(center).multiplyScalar(-scale);
      group.scale.setScalar(scale);

      group.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry = child.geometry.clone();
        child.material = new THREE.MeshStandardMaterial({ color: models[index].color, metalness: index === 0 ? 0.5 : 0.72, roughness: index === 0 ? 0.42 : 0.3, emissive: new THREE.Color(brandColors.technicalBlack), transparent: true });
        const edgeMaterial = new THREE.LineBasicMaterial({ color: index === 2 ? brandColors.signalRed : brandColors.roadBlue, transparent: true, opacity: index === 0 ? 0.18 : 0.34, depthWrite: false });
        child.add(new THREE.LineSegments(new THREE.EdgesGeometry(child.geometry, 28), edgeMaterial));
        edgesByModel[index].push(edgeMaterial);
      });

      const wrapper = new THREE.Group();
      wrapper.userData.modelIndex = index;
      wrapper.add(group);
      wrapper.scale.setScalar(index === 0 ? 0.72 : 0.01);
      rig.add(wrapper);
      loaded[index] = wrapper;
    };

    const loader = new GLTFLoader();
    Promise.all(models.map((model, index) => new Promise<void>((resolve) => {
      loader.load(model.path, (gltf) => {
        if (!disposed) normalizeModel(gltf.scene, index);
        resolve();
      }, undefined, () => resolve());
    }))).then(() => {
      if (!disposed) setIsReady(true);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let didDrag = false;
    let lastX = 0;
    let lastY = 0;
    let targetYaw = -0.18;
    let targetPitch = 0.02;
    let explodeAmount = 1;

    const updatePointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const pickModel = () => {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(loaded.filter(Boolean), true)[0];
      if (!hit) return -1;
      let object: THREE.Object3D | null = hit.object;
      while (object && object.parent !== rig) object = object.parent;
      return object?.userData.modelIndex ?? -1;
    };

    const onPointerDown = (event: PointerEvent) => {
      updatePointer(event);
      isDragging = true;
      didDrag = false;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event);
      if (isDragging) {
        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;
        if (Math.abs(deltaX) + Math.abs(deltaY) > 2) didDrag = true;
        targetYaw = THREE.MathUtils.clamp(targetYaw + deltaX * 0.006, -0.52, 0.38);
        targetPitch = THREE.MathUtils.clamp(targetPitch + deltaY * 0.004, -0.24, 0.24);
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }
      renderer.domElement.style.cursor = pickModel() >= 0 ? "pointer" : "grab";
    };

    const onPointerUp = (event: PointerEvent) => {
      updatePointer(event);
      if (!didDrag) {
        const index = pickModel();
        if (index >= 0) {
          selectedRef.current = index;
          setSelectedIndex(index);
          if (index > 0 && viewModeRef.current === "assembled") {
            viewModeRef.current = "exploded";
            setViewMode("exploded");
          }
        }
      }
      isDragging = false;
      renderer.domElement.style.cursor = pickModel() >= 0 ? "pointer" : "grab";
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const explodedPositions = [new THREE.Vector3(0.1, 0.95, -0.8), new THREE.Vector3(2.75, 1.35, 0.15), new THREE.Vector3(2.9, -1.2, 0.75), new THREE.Vector3(0.65, -1.8, -0.15)];
    const assembledPosition = new THREE.Vector3(0.65, 0, -1.4);
    const focusPosition = new THREE.Vector3(0.45, -0.08, 1.45);
    let frame = 0;

    const render = (time: number) => {
      const mobile = window.innerWidth < 760;
      const selected = selectedRef.current;
      explodeAmount += ((viewModeRef.current === "exploded" ? 1 : 0) - explodeAmount) * 0.075;

      loaded.forEach((object, index) => {
        if (!object) return;
        const exploded = explodedPositions[index].clone();
        if (mobile) {
          exploded.x = exploded.x * 0.57 + 0.2;
          exploded.y = index === 0 ? -0.1 : index === 1 ? 0.65 : index === 2 ? -0.8 : -2.05;
        }
        const desired = assembledPosition.clone().lerp(exploded, explodeAmount);
        if (selected === index && index > 0 && explodeAmount > 0.5) desired.lerp(mobile ? new THREE.Vector3(0.35, -0.75, 2.2) : focusPosition, 0.72);
        object.position.lerp(desired, 0.085);

        const baseScale = index === 0 ? (mobile ? 0.56 : 0.7) : (mobile ? 0.6 : 0.82);
        const visibleScale = index === 0 ? baseScale : baseScale * explodeAmount;
        const selectedScale = selected === index ? visibleScale * (index === 0 ? 1.06 : 1.16) : visibleScale;
        const currentScale = object.scale.x + (selectedScale - object.scale.x) * 0.09;
        object.scale.setScalar(Math.max(0.001, currentScale));

        object.traverse((child) => {
          if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshStandardMaterial)) return;
          const isSelected = selected === index;
          const targetOpacity = isSelected ? 1 : selected > 0 ? 0.42 : 0.88;
          child.material.opacity += (targetOpacity - child.material.opacity) * 0.08;
          child.material.emissive.set(isSelected ? models[index].color : brandColors.technicalBlack);
          child.material.emissiveIntensity += ((isSelected ? 0.1 : 0) - child.material.emissiveIntensity) * 0.08;
        });
        edgesByModel[index].forEach((material) => {
          const targetOpacity = selected === index ? 0.72 : selected > 0 ? 0.16 : 0.32;
          material.opacity += (targetOpacity - material.opacity) * 0.08;
        });
      });

      rig.rotation.y += (targetYaw - rig.rotation.y) * 0.09;
      rig.rotation.x += (targetPitch - rig.rotation.x) * 0.09;
      floor.rotation.y = rig.rotation.y * 0.18;
      scanBeam.position.y = THREE.MathUtils.lerp(2.55, -2.5, (time * 0.00016) % 1);
      scanMaterial.opacity = selected > 0 ? 0.72 : 0.28;
      camera.position.z += ((selected > 0 ? (mobile ? 11.5 : 9.8) : (mobile ? 12.4 : 10.6)) - camera.position.z) * 0.05;
      camera.lookAt(0.45, -0.2, 0);
      signalLight.position.x = selected > 0 ? 2.8 : -3.5;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      rig.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
      floor.geometry.dispose();
      floor.material.dispose();
      scanBeam.geometry.dispose();
      scanMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, [shouldInitialize]);

  const selectedModel = models[selectedIndex];
  return (
    <section id="identificacao-3d" ref={sectionRef} className="home-parts-story" aria-labelledby="parts-story-title">
      <div className="home-parts-stage">
        <div ref={canvasRef} className="home-parts-canvas" role="application" aria-label="Explorador tridimensional de componentes. Arraste para girar e clique em uma peça para selecionar." />
        <div className="home-parts-grid" aria-hidden="true" />
        <div className="home-container home-parts-content">
          <div className="home-parts-copy" key={selectedIndex} aria-live="polite">
            <p className="home-kicker">{selectedModel.code} / {selectedModel.label}</p>
            <h2 id="parts-story-title">{selectedModel.title}</h2>
            <p>{selectedModel.copy}</p>
          </div>

          <div className="home-parts-controls" aria-label="Modo de visualização">
            <button type="button" className={viewMode === "assembled" ? "is-active" : ""} onClick={() => changeView("assembled")}>Montado</button>
            <button type="button" className={viewMode === "exploded" ? "is-active" : ""} onClick={() => changeView("exploded")}>Explodido</button>
          </div>

          <div className="home-parts-picker" aria-label="Selecionar componente">
            {models.map((model, index) => (
              <button type="button" className={selectedIndex === index ? "is-active" : ""} aria-pressed={selectedIndex === index} onClick={() => selectModel(index)} key={model.code}>
                <span>{model.code}</span>
                <strong>{model.label}</strong>
              </button>
            ))}
          </div>

          <div className={`home-parts-status${isReady ? " is-ready" : ""}`}>
            <span>{isReady ? "Explorador ativo" : "Preparando objetos"}</span>
            <strong>Arraste para girar. Clique para inspecionar.</strong>
          </div>

          <div className="home-parts-footer">
            <span>{String(selectedIndex + 1).padStart(2, "0")}</span>
            <i aria-hidden="true"><b style={{ transform: `scaleX(${(selectedIndex + 1) / models.length})` }} /></i>
            <span>04</span>
            <Link href="/fale-conosco">Enviar referência <b aria-hidden="true">→</b></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
