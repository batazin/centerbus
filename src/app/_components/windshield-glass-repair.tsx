"use client";

import React, { useEffect, useRef, useState } from "react";

interface WindshieldGlassRepairProps {
  className?: string;
}

export function WindshieldGlassRepair({ className = "" }: WindshieldGlassRepairProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gpuStatus, setGpuStatus] = useState<"loading" | "webgpu" | "fallback">("loading");
  const [deviceInfo, setDeviceInfo] = useState<string>("Iniciando WebGPU...");
  const [glassModel, setGlassModel] = useState<"marcopolo" | "caio" | "comil">("marcopolo");
  const [repairRadius, setRepairRadius] = useState<number>(0.35);
  const [crackSeverity, setCrackSeverity] = useState<number>(1.0);
  const [totalRepaired, setTotalRepaired] = useState<number>(15);

  const mousePosRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: 0.5, y: 0.5, isDown: false });
  const impactPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0.0, y: 0.1, time: 0 });
  const trailPointsRef = useRef<Array<{ x: number; y: number; r: number }>>([]);
  const animTimeRef = useRef<number>(0);

  const triggerNewCrack = (nx?: number, ny?: number) => {
    const x = nx !== undefined ? nx : (Math.random() - 0.5) * 0.8;
    const y = ny !== undefined ? ny : (Math.random() - 0.5) * 0.6;
    impactPosRef.current = { x, y, time: animTimeRef.current };
    trailPointsRef.current = [];
    setTotalRepaired(0);
  };

  const repairAll = () => {
    // Fill trail to cover whole screen
    const points: Array<{ x: number; y: number; r: number }> = [];
    for (let x = -1; x <= 1; x += 0.3) {
      for (let y = -1; y <= 1; y += 0.3) {
        points.push({ x, y, r: 0.8 });
      }
    }
    trailPointsRef.current = points;
    setTotalRepaired(100);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanupFn: (() => void) | null = null;
    const targetCanvas = canvas;

    async function startWebGPU() {
      if (typeof window === "undefined" || !("gpu" in navigator) || !navigator.gpu) {
        setGpuStatus("fallback");
        setDeviceInfo("WebGPU indisponível no navegador • Usando Canvas 2D");
        startCanvas2DFallback(targetCanvas);
        return;
      }

      try {
        const { init, surface, effect, frameLoop, clock } = await import("vgpu");
        
        const gpu = await init();
        if (disposed) {
          gpu.dispose();
          return;
        }

        const adapter = await navigator.gpu.requestAdapter();
        const adapterAny = adapter as any;
        const adapterInfo = adapterAny?.info || (await adapterAny?.requestAdapterInfo?.().catch(() => null));
        setDeviceInfo(adapterInfo?.description || adapterInfo?.vendor || adapterInfo?.architecture || "Hardware WebGPU");

        const output = surface(gpu, targetCanvas, { dpr: [1, 2] });
        const timer = clock(gpu);

        // Centerbus Windshield Glass Fracture & Laser Restoration WGSL Shader
        const shaderSource = `
struct Uniforms {
  time: f32,
  aspect: f32,
  mouseX: f32,
  mouseY: f32,
  impactX: f32,
  impactY: f32,
  impactAge: f32,
  repairRadius: f32,
  severity: f32,
  isMouseDown: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

fn hash21(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.xyx) * 0.1031);
  p3 = p3 + dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

@fragment
fn fs_main(@location(0) uv_in: vec2f) -> @location(0) vec4f {
  var uv = uv_in * 2.0 - 1.0;
  uv.x = uv.x * uniforms.aspect;

  let mouse = vec2f(uniforms.mouseX * 2.0 - 1.0, (1.0 - uniforms.mouseY) * 2.0 - 1.0);
  let mouseDist = length(uv - mouse);

  // 1. Perspective Highway & Road Horizon (Seen through the bus windshield)
  let horizon = -0.05;
  var roadUv = uv;
  let skyMask = step(horizon, roadUv.y);
  
  // Sky: Dusk / Night transport atmosphere (Azul Center #122B4A tones)
  let skyColor = mix(vec3f(0.04, 0.08, 0.16), vec3f(0.08, 0.18, 0.32), smoothstep(horizon, 0.8, roadUv.y));
  
  // Road perspective
  let roadDepth = max(0.01, horizon - roadUv.y);
  let roadX = roadUv.x / (roadDepth * 2.5);
  let laneLines = step(0.92, fract(roadX * 1.5 + uniforms.time * 2.0)) * step(abs(roadX), 2.0);
  let asphalt = mix(vec3f(0.06, 0.07, 0.09), vec3f(0.12, 0.14, 0.16), fract(roadX * 8.0));
  let roadColor = asphalt + vec3f(0.8, 0.7, 0.3) * laneLines * 0.6;
  
  var sceneColor = mix(roadColor, skyColor, skyMask);

  // Bus Windshield Wiper Arc & Dashboard reflection
  let dash = smoothstep(-0.65, -0.95, roadUv.y);
  let dashColor = vec3f(0.02, 0.03, 0.04);
  sceneColor = mix(sceneColor, dashColor, dash);

  // 2. Procedural Windshield Glass Crack System
  let impactPos = vec2f(uniforms.impactX * uniforms.aspect, uniforms.impactY);
  let dHit = uv - impactPos;
  let distToImpact = length(dHit);
  let angle = atan2(dHit.y, dHit.x);

  // Spiderweb radial lines
  let radialN = 18.0;
  let radialAng = angle * radialN / 6.28318;
  let radWobble = sin(distToImpact * 35.0 + hash21(vec2f(floor(radialAng), 2.0)) * 10.0) * 0.25;
  let radialLines = abs(fract(radialAng + radWobble) - 0.5);
  let radialCracks = smoothstep(0.08, 0.0, radialLines) * exp(-distToImpact * 1.8);

  // Concentric circular impact ripples
  let rings = sin(distToImpact * 45.0 - hash21(vec2f(floor(angle * 6.0), 1.0)) * 4.0);
  let ringCracks = smoothstep(0.7, 1.0, rings) * exp(-distToImpact * 3.0);

  // Total fracture intensity
  let crackField = (radialCracks * 1.4 + ringCracks * 0.8 + exp(-distToImpact * 12.0) * 2.0) * uniforms.severity;

  // 3. Laser Seam & Restoration Field (Cursor distance / repair brush)
  let repairZone = smoothstep(uniforms.repairRadius, uniforms.repairRadius * 0.7, mouseDist);
  
  // Laser energy ring on the perimeter of the mouse brush
  let laserRing = exp(-pow((mouseDist - uniforms.repairRadius * 0.85) * 35.0, 2.0));
  let laserSeam = laserRing * (0.8 + 0.2 * sin(uniforms.time * 15.0));

  // Glass crack visibility modulated by repair field
  let activeCrack = crackField * (1.0 - repairZone);

  // 4. Optical glass refraction distortion on cracked areas
  let crackNormal = vec2f(cos(angle), sin(angle)) * activeCrack * 0.08;
  let refractedUv = uv + crackNormal;
  
  // Chromatic aberration at the edge of broken glass
  let sceneR = sceneColor.r + activeCrack * 0.45;
  let sceneG = sceneColor.g + activeCrack * 0.35 + laserSeam * 0.3;
  let sceneB = sceneColor.b + activeCrack * 0.55 + laserSeam * 0.9;
  
  var finalGlass = vec3f(sceneR, sceneG, sceneB);

  // 5. Restored Glass Sheen & Coating (Pristine Centerbus Replacement)
  let glassSheen = smoothstep(-0.2, 0.8, uv.x * 0.6 + uv.y * 0.8) * 0.08 * repairZone;
  let cleanGlassBlue = vec3f(0.18, 0.43, 0.64) * glassSheen;
  
  // Seam energy color: Azul Rodagem (#2E6DA4) + Vermelho Sinal (#C8102E)
  let seamGlow = mix(vec3f(0.18, 0.43, 0.64), vec3f(0.784, 0.062, 0.180), sin(uniforms.time * 6.0) * 0.5 + 0.5);
  finalGlass = finalGlass + seamGlow * laserSeam * 2.2 + cleanGlassBlue;

  // Windshield Pillar Frame (Cockpit Border)
  let frameX = smoothstep(1.35 * uniforms.aspect, 1.4 * uniforms.aspect, abs(uv.x));
  let frameY = smoothstep(0.92, 0.98, abs(uv.y));
  let borderFrame = max(frameX, frameY);
  finalGlass = mix(finalGlass, vec3f(0.05, 0.06, 0.08), borderFrame);

  return vec4f(finalGlass, 1.0);
}
`;

        const shader = effect(gpu, shaderSource);

        const loopHandle = frameLoop(gpu, (frame) => {
          animTimeRef.current = timer.time;
          const rect = targetCanvas.getBoundingClientRect();
          const aspect = rect.width > 0 && rect.height > 0 ? rect.width / rect.height : 1;

          shader.set({
            uniforms: {
              time: timer.time,
              aspect,
              mouseX: mousePosRef.current.x,
              mouseY: mousePosRef.current.y,
              impactX: impactPosRef.current.x,
              impactY: impactPosRef.current.y,
              impactAge: timer.time - impactPosRef.current.time,
              repairRadius: repairRadius,
              severity: crackSeverity,
              isMouseDown: mousePosRef.current.isDown ? 1.0 : 0.0,
            },
          });

          frame.pass(output, shader);
        });

        setGpuStatus("webgpu");

        cleanupFn = () => {
          loopHandle.stop();
          gpu.dispose();
        };
      } catch (err) {
        console.warn("WebGPU Windshield init failed, using fallback:", err);
        setGpuStatus("fallback");
        setDeviceInfo("Modo Fallback Canvas 2D");
        startCanvas2DFallback(targetCanvas);
      }
    }

    function startCanvas2DFallback(canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const context = ctx;

      let animId: number;
      let startTime = performance.now();

      function render(now: number) {
        if (disposed) return;
        const time = (now - startTime) / 1000;
        animTimeRef.current = time;
        const width = (canvas.width = canvas.clientWidth * window.devicePixelRatio);
        const height = (canvas.height = canvas.clientHeight * window.devicePixelRatio);

        // Cockpit Dark Scene
        context.fillStyle = "#0B1522";
        context.fillRect(0, 0, width, height);

        // Road horizon
        context.fillStyle = "#122B4A";
        context.fillRect(0, 0, width, height * 0.55);
        context.fillStyle = "#0D1117";
        context.fillRect(0, height * 0.55, width, height * 0.45);

        // Road lanes
        context.strokeStyle = "#F4F4F4";
        context.lineWidth = 4 * window.devicePixelRatio;
        context.setLineDash([30, 20]);
        context.beginPath();
        context.moveTo(width * 0.5, height * 0.55);
        context.lineTo(width * 0.5, height);
        context.stroke();
        context.setLineDash([]);

        // Broken glass lines (Radial)
        const hitX = (impactPosRef.current.x + 0.5) * width;
        const hitY = (impactPosRef.current.y + 0.5) * height;

        context.strokeStyle = "rgba(255, 255, 255, 0.75)";
        context.lineWidth = 1.5 * window.devicePixelRatio;
        for (let i = 0; i < 16; i++) {
          const ang = (i / 16) * Math.PI * 2;
          context.beginPath();
          context.moveTo(hitX, hitY);
          const len = 180 * window.devicePixelRatio;
          context.lineTo(hitX + Math.cos(ang) * len, hitY + Math.sin(ang) * len);
          context.stroke();
        }

        // Concentric rings
        for (let r = 20; r < 140; r += 35) {
          context.beginPath();
          context.arc(hitX, hitY, r * window.devicePixelRatio, 0, Math.PI * 2);
          context.stroke();
        }

        // Mouse Repair Laser
        const mx = mousePosRef.current.x * width;
        const my = mousePosRef.current.y * height;
        const rPix = repairRadius * width * 0.5;

        // Laser seam ring
        context.strokeStyle = "#C8102E";
        context.lineWidth = 4 * window.devicePixelRatio;
        context.beginPath();
        context.arc(mx, my, rPix, 0, Math.PI * 2);
        context.stroke();

        // Clean Glass glow
        const grad = context.createRadialGradient(mx, my, 0, mx, my, rPix);
        grad.addColorStop(0, "rgba(46, 109, 164, 0.4)");
        grad.addColorStop(1, "rgba(46, 109, 164, 0.0)");
        context.fillStyle = grad;
        context.beginPath();
        context.arc(mx, my, rPix, 0, Math.PI * 2);
        context.fill();

        animId = requestAnimationFrame(render);
      }

      animId = requestAnimationFrame(render);
      cleanupFn = () => cancelAnimationFrame(animId);
    }

    startWebGPU();

    return () => {
      disposed = true;
      if (cleanupFn) cleanupFn();
    };
  }, [repairRadius, crackSeverity]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mousePosRef.current = { x, y, isDown: mousePosRef.current.isDown };

      // Increase repair progress
      setTotalRepaired((prev) => Math.min(100, prev + 0.5));
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const nx = ((e.clientX - rect.left) / rect.width) * 2.0 - 1.0;
      const ny = ((e.clientY - rect.top) / rect.height) * 2.0 - 1.0;
      triggerNewCrack(nx, -ny);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-700/60 bg-[#101418] text-white shadow-2xl flex flex-col ${className}`}
    >
      {/* Top Header Bar */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#122B4A]/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 rounded-full bg-[#C8102E] animate-ping" />
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#E4E7EB] font-bold">
              Simulador de Troca e Restauração de Para-brisa • Center Ônibus
            </div>
            <div className="font-mono text-[11px] text-[#2E6DA4]">
              Tecnologia de Cristais Automotivos & Selagem Estrutural PU
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#101418]/80 border border-white/10 text-emerald-400">
            {gpuStatus === "webgpu" ? "⚡ WebGPU Shader Ativo" : "Canvas 2D"}
          </span>
          <div className="font-mono text-xs px-3 py-1 rounded bg-[#101418] border border-white/10 text-white font-semibold">
            Restauração: <span className="text-[#2E6DA4]">{totalRepaired.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Windshield Canvas */}
      <div
        className="relative flex-1 min-h-[460px] sm:min-h-[540px] cursor-crosshair select-none overflow-hidden"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" />

        {/* HUD Overlay Info */}
        <div className="pointer-events-none absolute top-6 left-6 z-10 space-y-1">
          <div className="inline-block rounded bg-[#101418]/80 border border-white/10 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-sm">
            🎯 Posição de Impacto: <span className="text-[#C8102E]">Pedra de Rodovia (Trinca Ativa)</span>
          </div>
          <p className="font-mono text-[10px] text-white/60">
            Clique em qualquer ponto do vidro para simular um novo impacto de pedra.
          </p>
        </div>

        {/* Center Prompt Callout */}
        <div className="pointer-events-none absolute bottom-6 inset-x-6 z-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#101418]/80 p-4 backdrop-blur-md">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#2E6DA4] font-bold">
              Instrução Interativa
            </div>
            <p className="text-sm text-white font-sans">
              👉 <strong className="text-[#C8102E]">Passe o mouse</strong> sobre o vidro quebrado para aplicar o feixe de troca expressa e curar a trinca.
            </p>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              type="button"
              onClick={() => triggerNewCrack()}
              className="rounded border border-[#C8102E]/60 bg-[#C8102E]/20 px-3.5 py-1.5 font-mono text-xs uppercase font-bold text-white hover:bg-[#C8102E] transition-colors"
            >
              💥 Novo Impacto
            </button>
            <button
              type="button"
              onClick={repairAll}
              className="rounded border border-[#2E6DA4]/60 bg-[#2E6DA4]/20 px-3.5 py-1.5 font-mono text-xs uppercase font-bold text-white hover:bg-[#2E6DA4] transition-colors"
            >
              ✨ Troca Imediata 100%
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 bg-[#0B1522] p-4 sm:p-6">
        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-white/70">Modelo de Carroceria:</span>
            <span className="text-[#2E6DA4] font-bold uppercase">{glassModel}</span>
          </div>
          <div className="flex gap-1.5">
            {(["marcopolo", "caio", "comil"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setGlassModel(m)}
                className={`flex-1 py-1 font-mono text-[11px] rounded uppercase transition-colors ${
                  glassModel === m
                    ? "bg-[#C8102E] text-white font-bold shadow"
                    : "bg-[#122B4A]/60 hover:bg-[#122B4A] text-white/70 border border-white/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-white/70">Raio do Laser de Cura:</span>
            <span className="text-[#2E6DA4] font-bold">{(repairRadius * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.15"
            max="0.7"
            step="0.05"
            value={repairRadius}
            onChange={(e) => setRepairRadius(parseFloat(e.target.value))}
            className="w-full accent-[#C8102E] cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-white/70">Severidade da Trinca:</span>
            <span className="text-[#2E6DA4] font-bold">{(crackSeverity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.0"
            step="0.1"
            value={crackSeverity}
            onChange={(e) => setCrackSeverity(parseFloat(e.target.value))}
            className="w-full accent-[#C8102E] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
