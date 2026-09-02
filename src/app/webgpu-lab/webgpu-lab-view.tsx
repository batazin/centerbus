"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import { WindshieldGlassRepair } from "../_components/windshield-glass-repair";
import { BusWindshieldGlassFractal } from "../_components/bus-windshield-glass-fractal";
import { GlassFractalShowcase } from "../../../glass-fractal";

export function WebGpuLabView() {
  const [activeLabTab, setActiveLabTab] = useState<"windshield" | "glass-fractal" | "telemetry">("glass-fractal");
  const [glassFrameMode, setGlassFrameMode] = useState<"windshield" | "raw">("windshield");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gpuStatus, setGpuStatus] = useState<"loading" | "webgpu" | "fallback">("loading");
  const [deviceInfo, setDeviceInfo] = useState<string>("Detectando GPU...");
  const [fps, setFps] = useState<number>(60);
  
  // Customization controls
  const [preset, setPreset] = useState<"brand" | "telemetry" | "thermal" | "blueprint">("brand");
  const [speed, setSpeed] = useState<number>(1.2);
  const [gridDensity, setGridDensity] = useState<number>(14.0);
  const [laserIntensity, setLaserIntensity] = useState<number>(1.0);
  const [waveAmplitude, setWaveAmplitude] = useState<number>(1.0);

  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const paramsRef = useRef({ speed, gridDensity, laserIntensity, waveAmplitude, preset });

  useEffect(() => {
    paramsRef.current = { speed, gridDensity, laserIntensity, waveAmplitude, preset };
  }, [speed, gridDensity, laserIntensity, waveAmplitude, preset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanupFn: (() => void) | null = null;
    const targetCanvas = canvas;

    let frameCount = 0;
    let lastFpsCalc = performance.now();

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
        setDeviceInfo(adapterInfo?.description || adapterInfo?.vendor || adapterInfo?.architecture || "WebGPU Hardware Acelerado");

        const output = surface(gpu, targetCanvas, { dpr: [1, 2] });
        const timer = clock(gpu);

        // Centerbus Industrial WGSL Shader
        const shaderSource = `
struct Uniforms {
  time: f32,
  aspect: f32,
  mouseX: f32,
  mouseY: f32,
  speed: f32,
  gridDensity: f32,
  laserIntensity: f32,
  waveAmplitude: f32,
  presetMode: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(@location(0) uv_in: vec2f) -> @location(0) vec4f {
  var uv = uv_in * 2.0 - 1.0;
  uv.x = uv.x * uniforms.aspect;

  let mouse = vec2f(uniforms.mouseX * 2.0 - 1.0, (1.0 - uniforms.mouseY) * 2.0 - 1.0);
  let mouseDist = length(uv - mouse);

  // Background Institutional (Azul Center #122B4A / #08121D)
  var bg = vec3f(0.045, 0.105, 0.180) * (1.0 - length(uv) * 0.38);

  // Technical Telemetry CAD Grid
  let gridScale = max(2.0, uniforms.gridDensity);
  let gridUv = fract(uv * gridScale) - 0.5;
  let gridLine = min(abs(gridUv.x), abs(gridUv.y));
  let gridMask = smoothstep(0.045, 0.0, gridLine);
  var gridColor = vec3f(0.18, 0.427, 0.643) * gridMask * 0.14;

  // Wave / Telemetry stream
  let t = uniforms.time * uniforms.speed;
  let wave1 = sin(uv.x * 2.5 + t + sin(uv.y * 1.5)) * 0.22 * uniforms.waveAmplitude;
  let wave2 = cos(uv.x * 4.0 - t * 0.8 + cos(uv.y * 2.2)) * 0.14 * uniforms.waveAmplitude;
  let beam1 = 0.012 / (abs(uv.y - wave1) + 0.018);
  let beam2 = 0.008 / (abs(uv.y - wave2 - 0.25) + 0.022);

  // Diagonal 45-degree technical laser sweep
  let diag = abs(uv.x * 0.85 + uv.y * 1.15 - sin(t * 0.4) * 0.8);
  let laser = smoothstep(0.04, 0.0, diag) * uniforms.laserIntensity;
  var redSignal = vec3f(0.784, 0.062, 0.180) * laser;

  // Blue Rodagem wave glow
  var blueRodagem = vec3f(0.18, 0.427, 0.643) * (beam1 * 1.4 + beam2 * 0.9);

  // Interactive Cursor radar ping
  let ping = exp(-mouseDist * 6.0) * (0.5 + 0.5 * sin(uniforms.time * 6.0));
  var cursorGlow = vec3f(0.18, 0.55, 0.9) * ping * 0.8;

  // Color preset modifications
  if (uniforms.presetMode > 0.5 && uniforms.presetMode < 1.5) {
    // Telemetry: Higher contrast cyan
    blueRodagem = vec3f(0.0, 0.6, 0.8) * (beam1 * 1.6 + beam2 * 1.0);
    cursorGlow = vec3f(0.0, 0.9, 1.0) * ping;
  } else if (uniforms.presetMode > 1.5 && uniforms.presetMode < 2.5) {
    // Thermal: Heat gradient
    bg = vec3f(0.08, 0.02, 0.02);
    gridColor = vec3f(0.4, 0.1, 0.0) * gridMask * 0.15;
    blueRodagem = vec3f(0.9, 0.4, 0.05) * beam1 * 1.8;
    redSignal = vec3f(1.0, 0.1, 0.0) * laser * 1.5;
  } else if (uniforms.presetMode > 2.5) {
    // Blueprint: Classic schematic white lines on cyan-blue
    bg = vec3f(0.02, 0.12, 0.24);
    gridColor = vec3f(0.6, 0.8, 1.0) * gridMask * 0.25;
    blueRodagem = vec3f(0.4, 0.8, 1.0) * (beam1 + beam2);
    redSignal = vec3f(1.0, 0.3, 0.3) * laser;
  }

  // Final compositing
  var col = bg + gridColor + blueRodagem + redSignal + cursorGlow;

  // Subtle vignette
  let vig = 1.0 - smoothstep(0.6, 1.7, length(uv));
  col = col * vig;

  return vec4f(col, 1.0);
}
`;

        const shader = effect(gpu, shaderSource);

        const loopHandle = frameLoop(gpu, (frame) => {
          frameCount++;
          const now = performance.now();
          if (now - lastFpsCalc >= 500) {
            setFps(Math.round((frameCount * 1000) / (now - lastFpsCalc)));
            frameCount = 0;
            lastFpsCalc = now;
          }

          const rect = targetCanvas.getBoundingClientRect();
          const aspect = rect.width > 0 && rect.height > 0 ? rect.width / rect.height : 1;

          let presetId = 0;
          if (paramsRef.current.preset === "telemetry") presetId = 1;
          if (paramsRef.current.preset === "thermal") presetId = 2;
          if (paramsRef.current.preset === "blueprint") presetId = 3;

          shader.set({
            uniforms: {
              time: timer.time,
              aspect,
              mouseX: mouseRef.current.x,
              mouseY: mouseRef.current.y,
              speed: paramsRef.current.speed,
              gridDensity: paramsRef.current.gridDensity,
              laserIntensity: paramsRef.current.laserIntensity,
              waveAmplitude: paramsRef.current.waveAmplitude,
              presetMode: presetId,
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
        console.warn("WebGPU init failed, using fallback:", err);
        setGpuStatus("fallback");
        setDeviceInfo("Modo de compatibilidade (Canvas 2D)");
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
        frameCount++;
        if (now - lastFpsCalc >= 500) {
          setFps(Math.round((frameCount * 1000) / (now - lastFpsCalc)));
          frameCount = 0;
          lastFpsCalc = now;
        }

        const time = ((now - startTime) / 1000) * paramsRef.current.speed;
        const width = (canvas.width = canvas.clientWidth * window.devicePixelRatio);
        const height = (canvas.height = canvas.clientHeight * window.devicePixelRatio);

        context.fillStyle = "#122B4A";
        context.fillRect(0, 0, width, height);

        // Technical Grid
        context.strokeStyle = "rgba(46, 109, 164, 0.15)";
        context.lineWidth = 1;
        const step = (600 / Math.max(2, paramsRef.current.gridDensity)) * window.devicePixelRatio;
        for (let x = 0; x < width; x += step) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, height);
          context.stroke();
        }
        for (let y = 0; y < height; y += step) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.stroke();
        }

        // Wave
        context.strokeStyle = "#2E6DA4";
        context.lineWidth = 2 * window.devicePixelRatio;
        context.beginPath();
        for (let x = 0; x < width; x += 4) {
          const nx = x / width;
          const y = height / 2 + Math.sin(nx * 8 + time * 2) * (height * 0.15 * paramsRef.current.waveAmplitude);
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();

        // Laser
        context.strokeStyle = "#C8102E";
        context.lineWidth = 3 * window.devicePixelRatio * paramsRef.current.laserIntensity;
        const diagOffset = ((time * 120) % (width + height)) - height;
        context.beginPath();
        context.moveTo(diagOffset, 0);
        context.lineTo(diagOffset + height * 0.8, height);
        context.stroke();

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
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#101418] text-[#E4E7EB] font-sans flex flex-col selection:bg-[#C8102E] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#122B4A]/90 px-4 sm:px-6 backdrop-blur-md gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <Image src="/logo.png" alt="Center Ônibus" width={140} height={36} className="h-7 w-auto object-contain" priority />
          </Link>
          <span className="hidden md:inline-block h-4 w-px bg-white/20" />
          
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-[#101418]/60 p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setActiveLabTab("windshield")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                activeLabTab === "windshield"
                  ? "bg-[#C8102E] text-white font-bold shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🪟 Troca de Para-brisa</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLabTab("glass-fractal")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                activeLabTab === "glass-fractal"
                  ? "bg-purple-700 text-white font-bold shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>💎 Glass Fractal</span>
              <span className="hidden sm:inline text-[10px] opacity-75">(VGPU)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLabTab("telemetry")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                activeLabTab === "telemetry"
                  ? "bg-[#2E6DA4] text-white font-bold shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>⚡ Telemetria CAD</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-white/10 bg-[#101418]/60 px-3 py-1 font-mono text-xs">
            <span className="text-white/60">FPS:</span>
            <span className="font-semibold text-emerald-400">{fps}</span>
          </div>
          <Link
            href="/"
            className="rounded border border-[#2E6DA4]/40 bg-[#122B4A] px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-[#2E6DA4] transition-colors"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      {activeLabTab === "windshield" ? (
        <div className="flex-1 p-4 sm:p-8 flex flex-col justify-center max-w-6xl mx-auto w-full">
          <WindshieldGlassRepair className="flex-1 min-h-[620px]" />
        </div>
      ) : activeLabTab === "glass-fractal" ? (
        <div className="flex-1 p-4 sm:p-8 flex flex-col justify-center max-w-6xl mx-auto w-full">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
                Efeito de Vidro Óptico 3D • Refração & Transmissão
              </h2>
              <p className="text-xs text-[#E4E7EB]/70 font-mono">
                Transmissão screen-space, reflexos de estúdio e iluminação material em tempo real na GPU.
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-[#101418] p-1 rounded-lg border border-white/10 font-mono text-xs">
              <span className="text-white/60 px-2 text-[11px]">Enquadramento:</span>
              <button
                type="button"
                onClick={() => setGlassFrameMode("windshield")}
                className={`px-3 py-1 rounded transition-colors ${
                  glassFrameMode === "windshield"
                    ? "bg-[#C8102E] text-white font-bold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                🪟 Para-brisa de Ônibus
              </button>
              <button
                type="button"
                onClick={() => setGlassFrameMode("raw")}
                className={`px-3 py-1 rounded transition-colors ${
                  glassFrameMode === "raw"
                    ? "bg-[#2E6DA4] text-white font-bold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                📐 Tela Cheia
              </button>
            </div>
          </div>

          {glassFrameMode === "windshield" ? (
            <BusWindshieldGlassFractal className="flex-1 min-h-[620px]" />
          ) : (
            <GlassFractalShowcase className="flex-1 min-h-[620px]" />
          )}
        </div>
      ) : (
        /* Main Experience Layout */
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
          {/* Left: WebGPU Interactive Canvas Canvas */}
          <section
            className="lg:col-span-8 relative min-h-[500px] lg:min-h-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
          >
          {/* Hardware Accelerated Canvas */}
          <div className="absolute inset-0 z-0">
            <canvas ref={canvasRef} className="h-full w-full block" />
          </div>

          {/* Top HUD */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
            <div className="flex items-center gap-3 bg-[#101418]/70 border border-white/10 px-3.5 py-1.5 rounded-md backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
              <span className="font-mono text-xs uppercase tracking-wider text-white">
                Status: {gpuStatus === "webgpu" ? "⚡ WebGPU Nativo Ativo" : "Modo Fallback 2D"}
              </span>
            </div>
            <div className="bg-[#101418]/70 border border-white/10 px-3.5 py-1.5 rounded-md font-mono text-[11px] text-[#E4E7EB]/80 backdrop-blur-sm">
              {deviceInfo}
            </div>
          </div>

          {/* Center Callout */}
          <div className="relative z-10 my-auto py-10 max-w-xl pointer-events-none">
            <div className="inline-block rounded bg-[#C8102E] px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white mb-3">
              Renderizado por WGSL Shaders
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white font-sans leading-none">
              Telemetria e Dinâmica de Rodagem
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#E4E7EB]/90 leading-relaxed max-w-lg">
              Shader WebGPU em tempo real processando vetores de fluxo, varredura laser angular de 45° e malha computacional em coordenadas de chassi.
            </p>
          </div>

          {/* Bottom Prompt Helper */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-[#E4E7EB]/60 border-t border-white/10 pt-3 pointer-events-none">
            <span>Mova o mouse para interagir com o radar de partículas</span>
            <span>WGSL Pipeline • 60 FPS</span>
          </div>
        </section>

        {/* Right: Technical Inspector & Controls Panel */}
        <aside className="lg:col-span-4 bg-[#0B1522] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-8">
          <div>
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#2E6DA4]">Painel de Controle Shader</h2>
              <p className="text-xl font-bold uppercase text-white mt-1">Parâmetros em Tempo Real</p>
            </div>

            {/* Presets */}
            <div className="mt-6 space-y-3">
              <label className="font-mono text-xs uppercase text-white/70 block">1. Preset de Cor e Identidade</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "brand", label: "Center Ônibus", sub: "Azul + Sinal Vermelho" },
                  { id: "telemetry", label: "Telemetria Alta", sub: "Ciano Operação" },
                  { id: "thermal", label: "Sensor Térmico", sub: "Gradiente Calor" },
                  { id: "blueprint", label: "Planta Técnica", sub: "CAD Blueprint" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPreset(p.id as typeof preset)}
                    className={`text-left p-3 rounded border transition-all ${
                      preset === p.id
                        ? "border-[#C8102E] bg-[#C8102E]/15 text-white shadow-lg"
                        : "border-white/10 bg-[#122B4A]/30 hover:border-white/20 text-[#E4E7EB]/70"
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{p.label}</div>
                    <div className="text-[10px] text-white/50">{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="mt-8 space-y-5">
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-white/70">Velocidade da Onda:</span>
                  <span className="text-[#2E6DA4] font-bold">{speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#C8102E] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-white/70">Densidade da Grade CAD:</span>
                  <span className="text-[#2E6DA4] font-bold">{gridDensity}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="2"
                  value={gridDensity}
                  onChange={(e) => setGridDensity(parseFloat(e.target.value))}
                  className="w-full accent-[#C8102E] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-white/70">Intensidade do Laser 45°:</span>
                  <span className="text-[#2E6DA4] font-bold">{(laserIntensity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.1"
                  value={laserIntensity}
                  onChange={(e) => setLaserIntensity(parseFloat(e.target.value))}
                  className="w-full accent-[#C8102E] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-white/70">Amplitude da Onda Estrutural:</span>
                  <span className="text-[#2E6DA4] font-bold">{(waveAmplitude * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.1"
                  value={waveAmplitude}
                  onChange={(e) => setWaveAmplitude(parseFloat(e.target.value))}
                  className="w-full accent-[#C8102E] cursor-pointer"
                />
              </div>
            </div>

            {/* Technical Specs Card */}
            <div className="mt-8 rounded-lg border border-white/10 bg-[#122B4A]/40 p-4 font-mono text-xs space-y-2">
              <div className="text-[#2E6DA4] font-bold uppercase">Especificação da Pipeline</div>
              <div className="flex justify-between text-white/70">
                <span>Biblioteca:</span>
                <span className="text-white font-semibold">vgpu (Vercel WebGPU)</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Linguagem de Shader:</span>
                <span className="text-white font-semibold">WGSL (WebGPU Shading)</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Pass:</span>
                <span className="text-white font-semibold">Fullscreen Quad Effect</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Uniforms Buffer:</span>
                <span className="text-white font-semibold">Refletido dinamicamente</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 font-mono text-[11px] text-white/50 flex justify-between">
            <span>Center Ônibus © {new Date().getFullYear()}</span>
            <span>vgpu.sh integration</span>
          </div>
        </aside>
      </main>
      )}
    </div>
  );
}
