"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const particleModels = [
  "/particles/engine_radiator.glb",
  "/particles/onibus.glb",
  "/particles/disk_brake.glb",
  "/particles/battery.glb",
];

const fallbackModel = "/particles/onibus.glb";
const modelViewRotations = [
  { x: -0.06, y: 0 },
  { x: 0, y: Math.PI / 2.15 },
  { x: 0.18, y: 0.12 },
  { x: 0.02, y: -0.18 },
];

const vertexShader = `
uniform float uTime;
uniform float uDeltaTime;
uniform vec3 uMouse;
uniform float uRepulsion;
uniform float uTransition;
uniform float uScrollProgress;
uniform float uPointScale;

attribute vec3 shape0Position;
attribute vec3 shape1Position;
attribute vec3 shape2Position;
attribute vec3 shape3Position;
attribute vec3 targetPosition;
attribute float aRandom;

varying vec2 vUv;
varying float vProgress;

vec3 fakeNoise(vec3 x) {
  float s  = sin(x.x * 2.0 + uTime) * cos(x.y * 2.0 + uTime);
  float s2 = sin(x.y * 2.5 + uTime) * cos(x.z * 2.5 + uTime);
  float s3 = sin(x.z * 3.0 + uTime) * cos(x.x * 3.0 + uTime);
  return vec3(s, s2, s3);
}

void main() {
  vUv = uv;
  float travel = smoothstep(0.0, 1.0, uTransition);
  float shapeProgress = clamp(uScrollProgress * 4.0 - 0.5, 0.0, 3.0);
  vec3 shapePosition = shape0Position;

  if (shapeProgress < 1.0) {
    shapePosition = mix(shape0Position, shape1Position, smoothstep(0.0, 1.0, shapeProgress));
  } else if (shapeProgress < 2.0) {
    shapePosition = mix(shape1Position, shape2Position, smoothstep(0.0, 1.0, shapeProgress - 1.0));
  } else if (shapeProgress < 3.0) {
    shapePosition = mix(shape2Position, shape3Position, smoothstep(0.0, 1.0, shapeProgress - 2.0));
  } else {
    shapePosition = shape3Position;
  }

  vec3 pos = mix(shapePosition, targetPosition, travel);
  
  // Reduced noise to avoid scrambling the bus shape
  vec3 flow = fakeNoise(pos * 1.5 + vec3(aRandom * 4.0)) * mix(0.004, 0.045, travel);
  pos += flow;
  pos.y -= travel * 1.7;
  pos.x += sin(uTime * 1.4 + aRandom * 9.0) * travel * 0.18;

  float dist = distance(pos, uMouse);
  if(uRepulsion > 0.0 && dist < 2.4) {
    vec3 dir = normalize(pos - uMouse);
    float force = (2.4 - dist) * uRepulsion;
    pos += dir * force;
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  gl_PointSize = (3.4 * aRandom + 2.8) * uPointScale * mix(1.0, 0.82, travel) * (5.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  vProgress = aRandom;
}
`;

const fragmentShader = `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying vec2 vUv;
varying float vProgress;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float dist = length(uv - vec2(0.5));

  if (dist > 0.5) {
    discard;
  }

  float alpha = smoothstep(0.5, 0.04, dist) * uOpacity;
  vec3 color = mix(uColorA, uColorB, vProgress);
  color = mix(color, vec3(1.0), 0.16);
  
  gl_FragColor = vec4(color, alpha);
}
`;

type BusParticlesProps = {
  activeChapterIndex: number;
  activeChapterProgress: number;
  scrollProgress: number;
  transitionProgress: number;
  variant?: "hero" | "journey";
};

export function BusParticles({ activeChapterIndex, activeChapterProgress, scrollProgress, transitionProgress, variant = "journey" }: BusParticlesProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const baseRotationRef = useRef(modelViewRotations[0]);
  const uniformsRef = useRef<Partial<{ uScrollProgress: { value: number }; uTransition: { value: number } }> | null>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;

    const mountElement = mountRef.current;
    const width = mountElement.clientWidth;
    const height = mountElement.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, variant === "hero" ? 13.2 : 14.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";
    mountElement.appendChild(renderer.domElement);

    const timer = new THREE.Timer();
    timer.connect(document);
    
    const uniforms = {
      uTime: { value: 0 },
      uDeltaTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 999) },
      uRepulsion: { value: 0 },
      uColorA: { value: new THREE.Color(variant === "hero" ? "#ff4a5f" : "#f14d65") },
      uColorB: { value: new THREE.Color(variant === "hero" ? "#9dd8ff" : "#8fd1ff") },
      uOpacity: { value: variant === "hero" ? 1.28 : 1.42 },
      uPointScale: { value: width < 768 ? 1.12 : variant === "hero" ? 1.16 : 1.04 },
      uScrollProgress: { value: 0 },
      uTransition: { value: 0 }
    };
    uniformsRef.current = uniforms;

    let particles: THREE.Points | null = null;
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    const particleCount = typeof window !== "undefined" && window.innerWidth < 768 ? 7600 : 30000;

    const loadModelPositions = (path: string) =>
      new Promise<Float32Array>((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(path, (gltf) => {
          const geometries: THREE.BufferGeometry[] = [];
      
          gltf.scene.updateMatrixWorld(true);
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              const position = mesh.geometry.getAttribute("position");
              if (!position) return;

              const positionArray = new Float32Array(position.count * 3);
              for (let i = 0; i < position.count; i++) {
                positionArray[i * 3] = position.getX(i);
                positionArray[i * 3 + 1] = position.getY(i);
                positionArray[i * 3 + 2] = position.getZ(i);
              }

              const geom = new THREE.BufferGeometry();
              geom.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
              geom.applyMatrix4(mesh.matrixWorld);
              geometries.push(geom);
            }
          });

          if (geometries.length === 0) {
            reject(new Error(`No mesh found in ${path}`));
            return;
          }
      
          const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
          if (!mergedGeometry) {
            reject(new Error(`Could not merge geometry from ${path}`));
            return;
          }

          const sourceMesh = new THREE.Mesh(mergedGeometry);
      
          sourceMesh.geometry.computeBoundingBox();
          const bounds = sourceMesh.geometry.boundingBox!;
          const center = bounds.getCenter(new THREE.Vector3());
          const size = bounds.getSize(new THREE.Vector3());
          const scale = (variant === "hero" ? 15.8 : 15.2) / Math.max(size.x, size.y, size.z);

          sourceMesh.geometry.translate(-center.x, -center.y, -center.z);
          sourceMesh.geometry.scale(scale, scale, scale);

          const sampler = new MeshSurfaceSampler(sourceMesh).build();
          const positions = new Float32Array(particleCount * 3);
          const tempPosition = new THREE.Vector3();

          for (let i = 0; i < particleCount; i++) {
            sampler.sample(tempPosition);
        
            positions[i * 3] = tempPosition.x;
            positions[i * 3 + 1] = tempPosition.y;
            positions[i * 3 + 2] = tempPosition.z;
          }

          resolve(positions);
        }, undefined, reject);
      });

    loadModelPositions(fallbackModel).then((fallbackPositions) => {
      Promise.all(
        particleModels.map((model) =>
          loadModelPositions(model).catch((error: unknown) => {
            console.error(`Could not load ${model}; using fallback particles`, error);
            return fallbackPositions.slice();
          })
        )
      ).then((modelPositions) => {
      const targetPositions = new Float32Array(particleCount * 3);
      const randoms = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const random = Math.random();
        const lane = (Math.random() - 0.5) * 1.15;
        const progress = i / Math.max(1, particleCount - 1);
        const wave = Math.sin(progress * Math.PI * 4.0 + random * 3.0);

        targetPositions[i * 3] = -7.0 + progress * 14.0;
        targetPositions[i * 3 + 1] = -2.4 + wave * 0.28 + lane * 0.16;
        targetPositions[i * 3 + 2] = lane + (random - 0.5) * 0.34;
        randoms[i] = random;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(modelPositions[0], 3));
      geometry.setAttribute("shape0Position", new THREE.BufferAttribute(modelPositions[0], 3));
      geometry.setAttribute("shape1Position", new THREE.BufferAttribute(modelPositions[1], 3));
      geometry.setAttribute("shape2Position", new THREE.BufferAttribute(modelPositions[2], 3));
      geometry.setAttribute("shape3Position", new THREE.BufferAttribute(modelPositions[3], 3));
      geometry.setAttribute("targetPosition", new THREE.BufferAttribute(targetPositions, 3));
      geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      particles = new THREE.Points(geometry, material);
      
      modelGroup.add(particles);
      });
    }).catch((error: unknown) => {
      console.error("Could not load particle models", error);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const pointerRotation = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      dragX: 0,
      dragY: 0,
      isDragging: false,
      lastX: 0,
      lastY: 0,
    };
    
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    const updatePointerField = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(plane);
      
      if (intersects.length > 0) {
        uniforms.uMouse.value.copy(intersects[0].point);
        uniforms.uRepulsion.value = pointerRotation.isDragging ? 0.9 : 0.45;
      }

      if (!pointerRotation.isDragging) {
        pointerRotation.targetX = mouse.x * 0.34;
        pointerRotation.targetY = mouse.y * 0.18;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointerField(event.clientX, event.clientY);

      if (!pointerRotation.isDragging) return;

      const deltaX = event.clientX - pointerRotation.lastX;
      const deltaY = event.clientY - pointerRotation.lastY;

      pointerRotation.dragX += deltaX * 0.01;
      pointerRotation.dragY += deltaY * 0.007;
      pointerRotation.targetX = pointerRotation.dragX;
      pointerRotation.targetY = gsapClamp(pointerRotation.dragY, -0.6, 0.6);
      pointerRotation.lastX = event.clientX;
      pointerRotation.lastY = event.clientY;
    };
    
    const onPointerDown = (event: PointerEvent) => {
      pointerRotation.isDragging = true;
      pointerRotation.lastX = event.clientX;
      pointerRotation.lastY = event.clientY;
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(event.pointerId);
      mountElement.classList.add("is-grabbing");
    };

    const onPointerUp = (event: PointerEvent) => {
      pointerRotation.isDragging = false;
      pointerRotation.dragX = pointerRotation.targetX;
      pointerRotation.dragY = pointerRotation.targetY;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      renderer.domElement.style.cursor = "grab";
      mountElement.classList.remove("is-grabbing");
    };

    const onPointerLeave = () => {
      if (pointerRotation.isDragging) return;
      uniforms.uRepulsion.value = 0;
      pointerRotation.targetX = pointerRotation.dragX;
      pointerRotation.targetY = pointerRotation.dragY;
    };

    const gsapClamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    mountElement.addEventListener("pointermove", onPointerMove);
    mountElement.addEventListener("pointerdown", onPointerDown);
    mountElement.addEventListener("pointerup", onPointerUp);
    mountElement.addEventListener("pointercancel", onPointerUp);
    mountElement.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      uniforms.uPointScale.value = newWidth < 768 ? 1.12 : variant === "hero" ? 1.16 : 1.04;
    };
    window.addEventListener("resize", onResize);

    let animationId: number;
    const animate = (timestamp?: number) => {
      timer.update(timestamp);

      const delta = timer.getDelta();
      const elapsedTime = timer.getElapsed();
      
      uniforms.uTime.value = elapsedTime;
      uniforms.uDeltaTime.value = delta;
      
      if (modelGroupRef.current) {
        modelGroupRef.current.position.y = Math.sin(elapsedTime * 1.2) * 0.2;
        pointerRotation.currentX += (pointerRotation.targetX - pointerRotation.currentX) * 0.12;
        pointerRotation.currentY += (pointerRotation.targetY - pointerRotation.currentY) * 0.12;
        modelGroupRef.current.rotation.y = baseRotationRef.current.y + pointerRotation.currentX;
        modelGroupRef.current.rotation.x = baseRotationRef.current.x + pointerRotation.currentY;
      }

      if(uniforms.uRepulsion.value > 0.0) {
        uniforms.uRepulsion.value = Math.max(0, uniforms.uRepulsion.value - delta * 3.0);
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      mountElement.removeEventListener("pointermove", onPointerMove);
      mountElement.removeEventListener("pointerdown", onPointerDown);
      mountElement.removeEventListener("pointerup", onPointerUp);
      mountElement.removeEventListener("pointercancel", onPointerUp);
      mountElement.removeEventListener("pointerleave", onPointerLeave);
      if (renderer.domElement.parentElement === mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
      timer.dispose();
      renderer.dispose();
      uniformsRef.current = null;
      modelGroupRef.current = null;
    };
  }, [variant]);

  useEffect(() => {
    if (uniformsRef.current?.uScrollProgress) {
      uniformsRef.current.uScrollProgress.value = activeChapterProgress;
    }
  }, [activeChapterProgress]);

  useEffect(() => {
    baseRotationRef.current = modelViewRotations[activeChapterIndex] ?? modelViewRotations[0];
  }, [activeChapterIndex, scrollProgress]);

  useEffect(() => {
    if (uniformsRef.current?.uTransition) {
      uniformsRef.current.uTransition.value = transitionProgress;
    }
  }, [transitionProgress]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} aria-label="Nuvem de partículas 3D interativa" />;
}
