"use client";

import React, { useState } from "react";
import { GlassFractalShowcase } from "../../../glass-fractal";

interface BusWindshieldGlassProps {
  className?: string;
}

export function BusWindshieldGlassFractal({ className = "" }: BusWindshieldGlassProps) {
  const [glassType, setGlassType] = useState<"single" | "split">("split");
  const [tintMode, setTintMode] = useState<"clear" | "gradient" | "polarized">("gradient");
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState<boolean>(true);

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0B1522] text-[#E4E7EB] shadow-2xl ${className}`}
    >
      {/* Top Cockpit Header */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#122B4A]/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 rounded-full bg-[#C8102E]" />
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Para-brisa Automotivo Estrutural • Cristal com Refração Óptica
            </h3>
            <p className="font-mono text-[11px] text-[#2E6DA4]">
              Center Ônibus Glass Tech • Homologação ECE R43 & Contorno PU
            </p>
          </div>
        </div>

        {/* Format Selectors */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-white/60 text-[11px]">Formato:</span>
          <div className="flex rounded-md border border-white/10 bg-[#101418]/80 p-0.5">
            <button
              type="button"
              onClick={() => setGlassType("split")}
              className={`rounded px-2.5 py-1 transition-colors ${
                glassType === "split" ? "bg-[#C8102E] text-white font-bold" : "text-white/70 hover:text-white"
              }`}
            >
              Bipartido (Urbano/Rodoviário)
            </button>
            <button
              type="button"
              onClick={() => setGlassType("single")}
              className={`rounded px-2.5 py-1 transition-colors ${
                glassType === "single" ? "bg-[#2E6DA4] text-white font-bold" : "text-white/70 hover:text-white"
              }`}
            >
              Inteiriço (Panorâmico)
            </button>
          </div>
        </div>
      </div>

      {/* Windshield Cockpit Outer Shell */}
      <div className="relative flex-1 p-4 sm:p-8 flex items-center justify-center bg-[#070D14] overflow-hidden select-none">
        {/* Chassis Pillars Framing (A-Pillars / Colunas A do Ônibus) */}
        <div className="relative w-full max-w-5xl aspect-[16/9] max-h-[580px] rounded-[24px] sm:rounded-[36px] p-3 sm:p-4 bg-gradient-to-b from-[#1C2633] via-[#101721] to-[#0A0F16] border-2 sm:border-4 border-[#243345] shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden">
          
          {/* Inner Rubber Gasket Seal (Borracha de Vedação EPDM) */}
          <div className="relative h-full w-full rounded-[18px] sm:rounded-[28px] overflow-hidden border-2 border-black/80 shadow-inner bg-black">
            
            {/* The WebGPU Glass Canvas Component */}
            <div className="absolute inset-0 z-0">
              <GlassFractalShowcase className="h-full w-full rounded-none border-0 min-h-0" />
            </div>

            {/* Automotive Ceramic Frit (Serigrafia Pontilhada Preta do Para-brisa) */}
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-[18px] sm:rounded-[28px]"
              style={{
                boxShadow: "inset 0 0 0 12px #0a0e14, inset 0 0 25px 8px rgba(0,0,0,0.9)",
              }}
            />

            {/* Top Windshield Sun-Strip Tint (Faixa Degradê Solar Superior) */}
            {tintMode === "gradient" && (
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 opacity-70"
                style={{
                  background: "linear-gradient(to bottom, rgba(18, 43, 74, 0.85) 0%, rgba(46, 109, 164, 0.35) 60%, transparent 100%)",
                }}
              />
            )}

            {/* Split Windshield Center Pillar (Divisão Central Bipartida) */}
            {glassType === "split" && (
              <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 sm:w-6 z-10 bg-gradient-to-r from-[#0C121A] via-[#1E2B3C] to-[#0C121A] border-x border-[#2E6DA4]/30 shadow-[0_0_15px_rgba(0,0,0,0.9)] flex items-center justify-center">
                <div className="h-3/4 w-0.5 bg-[#C8102E]/40" />
              </div>
            )}

            {/* Windshield Wiper Park Rest Positions (Palhetas do Limpador) */}
            <div className="pointer-events-none absolute bottom-2 left-12 w-48 sm:w-72 h-1.5 bg-[#1E2836] rounded-full rotate-[-4deg] opacity-85 z-10 border border-black" />
            <div className="pointer-events-none absolute bottom-2 right-12 w-48 sm:w-72 h-1.5 bg-[#1E2836] rounded-full rotate-[4deg] opacity-85 z-10 border border-black" />

            {/* Technical Glass Stamp Mark (Gravação Técnica de Homologação no Canto) */}
            {showTechnicalSpecs && (
              <div className="pointer-events-none absolute bottom-5 right-6 z-10 rounded bg-black/60 px-2.5 py-1.5 font-mono text-[9px] text-[#E4E7EB]/80 backdrop-blur-sm border border-white/10 leading-tight">
                <div className="text-[#C8102E] font-bold">CENTERBUS GLASS</div>
                <div>LAMINATED • AS1 • DOT 725</div>
                <div>E6 43R-008129 • T: 5.5mm</div>
              </div>
            )}

            {/* Top Mirror / Camera Housing (Suporte de Retrovisor / Sensor de Faixa) */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-10 bg-[#121B27] rounded-b-2xl border-b border-x border-white/10 z-10 flex items-center justify-center shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#2E6DA4] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Customization Controls */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#0B1522] px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-white/70">Filtro Solar:</span>
          {(
            [
              { id: "gradient", label: "Faixa Degradê Solar" },
              { id: "clear", label: "Cristal 100% Claro" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTintMode(t.id)}
              className={`rounded px-3 py-1 font-mono text-xs transition-colors ${
                tintMode === t.id
                  ? "bg-[#2E6DA4] text-white font-bold"
                  : "bg-[#122B4A]/40 text-white/70 hover:bg-[#122B4A] border border-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-white/80">
            <input
              type="checkbox"
              checked={showTechnicalSpecs}
              onChange={(e) => setShowTechnicalSpecs(e.target.checked)}
              className="accent-[#C8102E] cursor-pointer"
            />
            <span>Selo de Homologação</span>
          </label>
        </div>
      </div>
    </div>
  );
}
