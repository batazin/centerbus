"use client";

import React, { useEffect, useRef, useState } from "react";

interface VgpuTelemetryProps {
  className?: string;
}

export function VgpuTelemetryBanner({ className = "" }: VgpuTelemetryProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gpuStatus, setGpuStatus] = useState<"loading" | "webgpu" | "fallback" | "unsupported">("loading");
  const [activeMode, setActiveMode] = useState<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanupFn: (() => void) | null = null;

    const targetCanvas = canvas;
    async function startWebGPU() {
      if (typeof window === "undefined" || !("gpu" in navigator) || !navigator.gpu) {
        setGpuStatus("fallback");
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

        const output = surface(gpu, targetCanvas, { dpr: [1, 2] });
        const timer = clock(gpu);

        // Centerbus Rebrand WGSL Shader
        // Palette: Azul Center (#122B4A), Azul Rodagem (#2E6DA4), Vermelho Sinal (#C8102E)
        const shaderSource = `
struct Uniforms {
  time: f32,
  aspect: f32,
  mouseX: f32,
  mouseY: f32,
  mode: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(@location(0) uv_in: vec2f) -> @location(0) vec4f {
  var uv = uv_in * 2.0 - 1.0;
  uv.x = uv.x * uniforms.aspect;

  let mouse = vec2f(uniforms.mouseX * 2.0 - 1.0, (1.0 - uniforms.mouseY) * 2.0 - 1.0);
  let mouseDist = length(uv - mouse);

  // Background Institutional Dark Base (Azul Center #122B4A / #0B192C)
  let bg = vec3f(0.045, 0.105, 0.180) * (1.0 - length(uv) * 0.35);

  // Technical Telemetry Grid lines
  let gridScale = 14.0;
  let gridUv = fract(uv * gridScale) - 0.5;
  let gridLine = min(abs(gridUv.x), abs(gridUv.y));
  let gridMask = smoothstep(0.05, 0.0, gridLine);
  let gridColor = vec3f(0.18, 0.427, 0.643) * gridMask * 0.12;

  // Wave / Telemetry stream
  let t = uniforms.time * 1.5;
  let wave1 = sin(uv.x * 2.5 + t + sin(uv.y * 1.5)) * 0.22;
  let wave2 = cos(uv.x * 4.0 - t * 0.8 + cos(uv.y * 2.2)) * 0.14;
  let beam1 = 0.012 / (abs(uv.y - wave1) + 0.02);
  let beam2 = 0.008 / (abs(uv.y - wave2 - 0.25) + 0.025);

  // Dynamic Centerbus signature 45-degree diagonal laser
  let diag = abs(uv.x * 0.85 + uv.y * 1.15 - sin(t * 0.4) * 0.8);
  let laser = smoothstep(0.04, 0.0, diag) * 0.9;
  let redSignal = vec3f(0.784, 0.062, 0.180) * laser;

  // Blue Rodagem wave glow
  let blueRodagem = vec3f(0.18, 0.427, 0.643) * (beam1 * 1.4 + beam2 * 0.9);

  // Interactive Cursor radar ping
  let ping = exp(-mouseDist * 6.0) * (0.5 + 0.5 * sin(uniforms.time * 6.0));
  let cursorGlow = vec3f(0.18, 0.55, 0.9) * ping * 0.8;

  // Final compositing
  var col = bg + gridColor + blueRodagem + redSignal + cursorGlow;

  // Subtle vignette
  let vig = 1.0 - smoothstep(0.7, 1.8, length(uv));
  col = col * vig;

  return vec4f(col, 1.0);
}
`;

        const shader = effect(gpu, shaderSource);

        const loopHandle = frameLoop(gpu, (frame) => {
          const rect = targetCanvas.getBoundingClientRect();
          const aspect = rect.width > 0 && rect.height > 0 ? rect.width / rect.height : 1;

          shader.set({
            uniforms: {
              time: timer.time,
              aspect,
              mouseX: mouseRef.current.x,
              mouseY: mouseRef.current.y,
              mode: activeMode,
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
        console.warn("WebGPU initialization failed, falling back to Canvas 2D:", err);
        setGpuStatus("fallback");
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
        const width = (canvas.width = canvas.clientWidth * window.devicePixelRatio);
        const height = (canvas.height = canvas.clientHeight * window.devicePixelRatio);

        context.fillStyle = "#122B4A";
        context.fillRect(0, 0, width, height);

        // Technical Grid
        context.strokeStyle = "rgba(46, 109, 164, 0.15)";
        context.lineWidth = 1;
        const step = 40 * window.devicePixelRatio;
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

        // Animated Telemetry Wave
        context.strokeStyle = "#2E6DA4";
        context.lineWidth = 2 * window.devicePixelRatio;
        context.beginPath();
        for (let x = 0; x < width; x += 4) {
          const nx = x / width;
          const y = height / 2 + Math.sin(nx * 8 + time * 2) * (height * 0.15);
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();

        // Diagonal Signal
        context.strokeStyle = "#C8102E";
        context.lineWidth = 3 * window.devicePixelRatio;
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
  }, [activeMode]);

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
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-700/50 bg-[#101418] p-6 text-white shadow-2xl ${className}`}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 z-0 opacity-85">
        <canvas ref={canvasRef} className="h-full w-full block" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[340px] pointer-events-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#C8102E] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#E4E7EB]">
              Centerbus WebGPU Engine • Telemetria VGPU
            </span>
          </div>
          <div className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#122B4A]/80 border border-[#2E6DA4]/40 text-[#E4E7EB]">
            {gpuStatus === "webgpu" ? "⚡ WebGPU Nativo (WGSL)" : gpuStatus === "fallback" ? "Canvas 2D Fallback" : "Iniciando GPU..."}
          </div>
        </div>

        <div className="my-auto py-6 max-w-xl">
          <p className="text-xs font-mono tracking-wider text-[#2E6DA4] uppercase mb-1">
            Renderização em Tempo Real • Hardware Accelerated
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-sans">
            A peça certa, no tempo da operação.
          </h3>
          <p className="mt-2 text-sm text-[#E4E7EB]/80 leading-relaxed font-sans">
            Visualizador de dinâmica estrutural e telemetria de componentes para frotas de transporte rodoviário e urbano.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#E4E7EB]/70">Filtro de Modo:</span>
            {[
              { id: 0, label: "Varredura Laser" },
              { id: 1, label: "Onda Estrutural" },
              { id: 2, label: "Radar de Peças" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                type="button"
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  activeMode === m.id
                    ? "bg-[#C8102E] text-white font-semibold shadow-md"
                    : "bg-[#122B4A]/60 hover:bg-[#122B4A] text-[#E4E7EB]/80 border border-[#2E6DA4]/30"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-[10px] text-[#E4E7EB]/60">
            WGSL Module Graph • Centerbus Core System
          </div>
        </div>
      </div>
    </div>
  );
}
