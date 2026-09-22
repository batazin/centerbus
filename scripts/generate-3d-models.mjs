import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Polyfill FileReader for Node.js environment
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (typeof this.onloadend === "function") {
        this.onloadend();
      }
    });
  }
}
globalThis.FileReader = NodeFileReader;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, "../public/models");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function exportGlb(sceneOrGroup, filename) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      sceneOrGroup,
      (gltf) => {
        try {
          const buffer = Buffer.from(gltf);
          const dest = path.join(outputDir, filename);
          fs.writeFileSync(dest, buffer);
          console.log(`[OK] Exported: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
          resolve(dest);
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        console.error(`[ERR] Failed to export ${filename}:`, error);
        reject(error);
      },
      { binary: true }
    );
  });
}

// ==========================================================================
// 1. MODELO: ÔNIBUS RODOVIÁRIO MARCOPOLO G8 ULTRA-DETALHADO
// ==========================================================================
function buildBusModel() {
  const bus = new THREE.Group();
  bus.name = "MarcopoloG8HeavyDuty";

  // Materiais automotivos de alta fidelidade
  const bodyPaint = new THREE.MeshStandardMaterial({
    color: 0x122b4a, // Azul Center Ônibus
    metalness: 0.88,
    roughness: 0.18,
  });

  const secondaryPaint = new THREE.MeshStandardMaterial({
    color: 0x091422, // Azul Profundo
    metalness: 0.82,
    roughness: 0.25,
  });

  const chromeTrim = new THREE.MeshStandardMaterial({
    color: 0xf4f7fa,
    metalness: 0.98,
    roughness: 0.08,
  });

  const signalRed = new THREE.MeshStandardMaterial({
    color: 0xc8102e, // Vermelho Sinal
    metalness: 0.6,
    roughness: 0.22,
  });

  const darkSkirts = new THREE.MeshStandardMaterial({
    color: 0x101418, // Preto Técnico
    metalness: 0.5,
    roughness: 0.45,
  });

  const glassTinted = new THREE.MeshPhysicalMaterial({
    color: 0x0c1b29,
    metalness: 0.15,
    roughness: 0.08,
    transmission: 0.82,
    thickness: 0.4,
    transparent: true,
    opacity: 0.72,
  });

  const interiorFabric = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85,
    metalness: 0.05,
  });

  const interiorHeadrest = new THREE.MeshStandardMaterial({
    color: 0xc8102e,
    roughness: 0.75,
    metalness: 0.1,
  });

  const rubberTire = new THREE.MeshStandardMaterial({
    color: 0x141619,
    roughness: 0.88,
    metalness: 0.08,
  });

  const rimAlcoa = new THREE.MeshStandardMaterial({
    color: 0xe0e6ed,
    metalness: 0.95,
    roughness: 0.12,
  });

  const ledHeadlight = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x70bbff,
    emissiveIntensity: 2.8,
    roughness: 0.1,
  });

  const ledTaillight = new THREE.MeshStandardMaterial({
    color: 0xff2244,
    emissive: 0xc8102e,
    emissiveIntensity: 2.4,
    roughness: 0.2,
  });

  const displayLed = new THREE.MeshStandardMaterial({
    color: 0x05101a,
    emissive: 0x00f0ff,
    emissiveIntensity: 1.6,
    roughness: 0.3,
  });

  // 1.1 Chassi Base e Saia Inferior com Caixas de Roda Recortadas
  const chassisGeom = new THREE.BoxGeometry(2.32, 0.45, 9.6);
  const chassis = new THREE.Mesh(chassisGeom, darkSkirts);
  chassis.position.set(0, 0.55, 0);
  bus.add(chassis);

  // 1.2 Carroceria Principal G8
  const mainBodyGeom = new THREE.BoxGeometry(2.4, 2.3, 9.4);
  const mainBody = new THREE.Mesh(mainBodyGeom, bodyPaint);
  mainBody.position.set(0, 1.9, 0);
  bus.add(mainBody);

  // 1.3 Frente Aerodinâmica Esculpida (Design G8 Duplo Deck)
  // Curvatura do bico frontal inferior
  const noseGeom = new THREE.CylinderGeometry(1.2, 1.2, 2.38, 24, 1, false, 0, Math.PI / 2);
  const nose = new THREE.Mesh(noseGeom, bodyPaint);
  nose.rotation.z = Math.PI / 2;
  nose.rotation.y = Math.PI / 2;
  nose.position.set(0, 1.5, 4.45);
  bus.add(nose);

  // Curvatura do teto aerodinâmico superior
  const roofSlopeGeom = new THREE.CylinderGeometry(1.4, 1.4, 2.38, 24, 1, false, 0, Math.PI / 2);
  const roofSlope = new THREE.Mesh(roofSlopeGeom, secondaryPaint);
  roofSlope.rotation.z = Math.PI / 2;
  roofSlope.rotation.y = Math.PI / 2;
  roofSlope.position.set(0, 2.75, 4.25);
  bus.add(roofSlope);

  // 1.4 A "Tiara" / Faixa Cromada Curva Marcopolo G8 nas Laterais
  [-1.21, 1.21].forEach((x) => {
    // Arco cromado superior que desce da coluna
    const arcCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x, 2.9, 3.8),
      new THREE.Vector3(x, 2.4, 4.4),
      new THREE.Vector3(x, 1.35, 4.5)
    );
    const arcGeom = new THREE.TubeGeometry(arcCurve, 20, 0.035, 8, false);
    const arcMesh = new THREE.Mesh(arcGeom, chromeTrim);
    bus.add(arcMesh);

    // Friso cromado inferior horizontal ao longo dos bagageiros
    const beltGeom = new THREE.BoxGeometry(0.025, 0.05, 8.4);
    const belt = new THREE.Mesh(beltGeom, chromeTrim);
    belt.position.set(x, 1.15, -0.2);
    bus.add(belt);

    // Faixa Vermelha Gráfica Center Ônibus
    const redStripeGeom = new THREE.BoxGeometry(0.03, 0.08, 8.2);
    const redStripe = new THREE.Mesh(redStripeGeom, signalRed);
    redStripe.position.set(x * 1.005, 1.08, -0.2);
    bus.add(redStripe);

    // Linhas dos Bagageiros Pantográficos (Gaps das portas do porta-malas)
    for (let z = -2.8; z <= 2.2; z += 1.25) {
      const seamGeom = new THREE.BoxGeometry(0.03, 0.75, 0.02);
      const seam = new THREE.Mesh(seamGeom, darkSkirts);
      seam.position.set(x, 0.95, z);
      bus.add(seam);

      // Maçaneta embutida
      const handleGeom = new THREE.BoxGeometry(0.035, 0.04, 0.14);
      const handle = new THREE.Mesh(handleGeom, chromeTrim);
      handle.position.set(x, 1.25, z + 0.5);
      bus.add(handle);
    }
  });

  // 1.5 Pára-Brisa Panorâmico Dividido (Marcopolo G8 Glass)
  // Pára-brisa superior
  const upperShieldGeom = new THREE.BoxGeometry(2.32, 0.85, 0.08);
  const upperShield = new THREE.Mesh(upperShieldGeom, glassTinted);
  upperShield.position.set(0, 2.65, 4.48);
  upperShield.rotation.x = -0.16;
  bus.add(upperShield);

  // Painel de Itinerário Digital LED (Letreiro "CENTER BUS EXPRESS")
  const displayGeom = new THREE.BoxGeometry(1.6, 0.22, 0.06);
  const display = new THREE.Mesh(displayGeom, displayLed);
  display.position.set(0, 2.95, 4.42);
  display.rotation.x = -0.16;
  bus.add(display);

  // Pára-brisa inferior do motorista
  const lowerShieldGeom = new THREE.BoxGeometry(2.32, 0.85, 0.08);
  const lowerShield = new THREE.Mesh(lowerShieldGeom, glassTinted);
  lowerShield.position.set(0, 1.82, 4.68);
  lowerShield.rotation.x = -0.06;
  bus.add(lowerShield);

  // Palhetas do Limpador Pantográfico Frontal
  [-0.6, 0.4].forEach((wx) => {
    const wiperArmGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.65, 8);
    const wiperArm = new THREE.Mesh(wiperArmGeom, darkSkirts);
    wiperArm.position.set(wx, 1.48, 4.74);
    wiperArm.rotation.z = -0.65;
    bus.add(wiperArm);

    const wiperBladeGeom = new THREE.BoxGeometry(0.02, 0.55, 0.02);
    const wiperBlade = new THREE.Mesh(wiperBladeGeom, rubberTire);
    wiperBlade.position.set(wx + 0.18, 1.7, 4.73);
    wiperBlade.rotation.z = -0.65;
    bus.add(wiperBlade);
  });

  // 1.6 Janelas Laterais com Vidro Escurecido e Colunas
  const sideGlassGeom = new THREE.BoxGeometry(2.43, 1.25, 7.8);
  const sideGlass = new THREE.Mesh(sideGlassGeom, glassTinted);
  sideGlass.position.set(0, 2.3, -0.3);
  bus.add(sideGlass);

  // Pilares estruturais entre as janelas
  for (let z = -3.8; z <= 3.2; z += 1.4) {
    const pillarGeom = new THREE.BoxGeometry(2.44, 1.25, 0.06);
    const pillar = new THREE.Mesh(pillarGeom, darkSkirts);
    pillar.position.set(0, 2.3, z);
    bus.add(pillar);
  }

  // 1.7 Interior do Salão de Passageiros (Visível através dos vidros)
  // Piso do salão
  const floorGeom = new THREE.BoxGeometry(2.2, 0.08, 7.6);
  const floor = new THREE.Mesh(floorGeom, interiorFabric);
  floor.position.set(0, 1.68, -0.3);
  bus.add(floor);

  // Poltronas executivas duplas reclináveis
  for (let z = -3.4; z <= 2.6; z += 0.85) {
    [-0.75, 0.75].forEach((sx) => {
      // Assento duplo
      const seatBaseGeom = new THREE.BoxGeometry(0.55, 0.12, 0.45);
      const seatBase = new THREE.Mesh(seatBaseGeom, interiorFabric);
      seatBase.position.set(sx, 1.95, z);
      bus.add(seatBase);

      // Encosto
      const backrestGeom = new THREE.BoxGeometry(0.55, 0.55, 0.1);
      const backrest = new THREE.Mesh(backrestGeom, interiorFabric);
      backrest.position.set(sx, 2.25, z - 0.18);
      backrest.rotation.x = 0.12;
      bus.add(backrest);

      // Apoio de cabeça vermelho
      const headrestGeom = new THREE.BoxGeometry(0.52, 0.18, 0.12);
      const headrest = new THREE.Mesh(headrestGeom, interiorHeadrest);
      headrest.position.set(sx, 2.55, z - 0.22);
      bus.add(headrest);
    });
  }

  // Volante e Painel do Motorista
  const dashGeom = new THREE.BoxGeometry(1.2, 0.35, 0.6);
  const dash = new THREE.Mesh(dashGeom, darkSkirts);
  dash.position.set(0.5, 1.6, 4.1);
  bus.add(dash);

  const wheelTorusGeom = new THREE.TorusGeometry(0.18, 0.025, 8, 20);
  const steerWheel = new THREE.Mesh(wheelTorusGeom, darkSkirts);
  steerWheel.position.set(0.5, 1.82, 3.9);
  steerWheel.rotation.x = -0.65;
  bus.add(steerWheel);

  // 1.8 Grade Frontal e Entradas de Ar Esportivas G8
  const frontGrilleGeom = new THREE.BoxGeometry(1.85, 0.38, 0.12);
  const frontGrille = new THREE.Mesh(frontGrilleGeom, darkSkirts);
  frontGrille.position.set(0, 0.95, 4.72);
  bus.add(frontGrille);

  // Logo Center Ônibus Frontal Cromado
  const logoBadgeGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24);
  const logoBadge = new THREE.Mesh(logoBadgeGeom, chromeTrim);
  logoBadge.rotation.x = Math.PI / 2;
  logoBadge.position.set(0, 1.35, 4.74);
  bus.add(logoBadge);

  // 1.9 Faróis Dianteiros Bi-LED com DRL Boomerang
  [-0.92, 0.92].forEach((lx) => {
    // Bloco óptico principal
    const lightBoxGeom = new THREE.BoxGeometry(0.38, 0.18, 0.12);
    const lightBox = new THREE.Mesh(lightBoxGeom, darkSkirts);
    lightBox.position.set(lx, 1.05, 4.68);
    bus.add(lightBox);

    // Canhão Projetor Duplo de Vidro
    [-0.08, 0.08].forEach((px) => {
      const projGeom = new THREE.SphereGeometry(0.065, 16, 16);
      const proj = new THREE.Mesh(projGeom, ledHeadlight);
      proj.position.set(lx + px, 1.05, 4.74);
      bus.add(proj);
    });

    // Guia DRL em Boomerang
    const drlGeom = new THREE.BoxGeometry(0.42, 0.035, 0.05);
    const drl = new THREE.Mesh(drlGeom, ledHeadlight);
    drl.position.set(lx, 1.18, 4.72);
    bus.add(drl);

    // Farol de Milha / Neblina Inferior
    const fogGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
    const fog = new THREE.Mesh(fogGeom, ledHeadlight);
    fog.rotation.x = Math.PI / 2;
    fog.position.set(lx, 0.72, 4.66);
    bus.add(fog);
  });

  // 1.10 Lanternas Traseiras Verticais Modular LED
  [-1.08, 1.08].forEach((rx) => {
    const tailBoxGeom = new THREE.BoxGeometry(0.14, 1.1, 0.08);
    const tailBox = new THREE.Mesh(tailBoxGeom, ledTaillight);
    tailBox.position.set(rx, 1.8, -4.72);
    bus.add(tailBox);

    // Detalhe de aro preto
    const tailBezelGeom = new THREE.BoxGeometry(0.18, 1.16, 0.04);
    const tailBezel = new THREE.Mesh(tailBezelGeom, darkSkirts);
    tailBezel.position.set(rx, 1.8, -4.7);
    bus.add(tailBezel);
  });

  // Grade Traseira do Motor
  const rearLouverGeom = new THREE.BoxGeometry(1.6, 0.65, 0.05);
  const rearLouver = new THREE.Mesh(rearLouverGeom, darkSkirts);
  rearLouver.position.set(0, 0.95, -4.72);
  bus.add(rearLouver);

  // Escapamentos Cromados Duplos Traseiros
  [-0.8, -0.65].forEach((ex) => {
    const exhaustGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 16);
    const exhaust = new THREE.Mesh(exhaustGeom, chromeTrim);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(ex, 0.38, -4.75);
    bus.add(exhaust);
  });

  // 1.11 Ar-Condicionado de Teto Aerodinâmico Spheros CC355
  const acHousingGeom = new THREE.BoxGeometry(1.85, 0.32, 3.4);
  const acHousing = new THREE.Mesh(acHousingGeom, secondaryPaint);
  acHousing.position.set(0, 3.16, 0.2);
  bus.add(acHousing);

  // Turbinas / Ventiladores de Teto
  [-0.6, 0.6].forEach((tx) => {
    [-0.8, 0.8].forEach((tz) => {
      const fanRimGeom = new THREE.TorusGeometry(0.24, 0.03, 8, 20);
      const fanRim = new THREE.Mesh(fanRimGeom, chromeTrim);
      fanRim.rotation.x = Math.PI / 2;
      fanRim.position.set(tx, 3.33, 0.2 + tz);
      bus.add(fanRim);

      const fanGrillGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16);
      const fanGrill = new THREE.Mesh(fanGrillGeom, darkSkirts);
      fanGrill.position.set(tx, 3.32, 0.2 + tz);
      bus.add(fanGrill);
    });
  });

  // Aerofólio Traseiro com Brake Light
  const spoilerGeom = new THREE.BoxGeometry(2.36, 0.12, 0.45);
  const spoiler = new THREE.Mesh(spoilerGeom, bodyPaint);
  spoiler.position.set(0, 3.12, -4.55);
  spoiler.rotation.x = -0.15;
  bus.add(spoiler);

  const brakeLightGeom = new THREE.BoxGeometry(1.2, 0.035, 0.03);
  const brakeLight = new THREE.Mesh(brakeLightGeom, ledTaillight);
  brakeLight.position.set(0, 3.15, -4.75);
  bus.add(brakeLight);

  // 1.12 Espelhos Retrovisores Rodoviários Aerodinâmicos
  [-1.42, 1.42].forEach((mx) => {
    // Braço superior curvo
    const armCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(mx * 0.8, 2.7, 4.3),
      new THREE.Vector3(mx * 1.05, 2.9, 4.6),
      new THREE.Vector3(mx, 2.4, 4.7)
    );
    const armTube = new THREE.TubeGeometry(armCurve, 16, 0.032, 8, false);
    const armMesh = new THREE.Mesh(armTube, darkSkirts);
    bus.add(armMesh);

    // Carcaça do espelho
    const mirrorBodyGeom = new THREE.BoxGeometry(0.16, 0.58, 0.22);
    const mirrorBody = new THREE.Mesh(mirrorBodyGeom, darkSkirts);
    mirrorBody.position.set(mx, 2.35, 4.7);
    bus.add(mirrorBody);

    // Face do espelho refletiva
    const mirrorGlassGeom = new THREE.PlaneGeometry(0.14, 0.54);
    const mirrorGlass = new THREE.Mesh(mirrorGlassGeom, chromeTrim);
    mirrorGlass.rotation.y = Math.PI;
    mirrorGlass.position.set(mx, 2.35, 4.58);
    bus.add(mirrorGlass);
  });

  // 1.13 Conjunto de 6 Rodas Rodoviárias Alcoa com Trucado Traseiro
  const wheelLocations = [
    { x: -1.22, y: 0.55, z: 3.1, isRear: false }, // Dianteira Direita
    { x: 1.22, y: 0.55, z: 3.1, isRear: false },  // Dianteira Esquerda
    { x: -1.22, y: 0.55, z: -2.3, isRear: true }, // Tração Direita
    { x: 1.22, y: 0.55, z: -2.3, isRear: true },  // Tração Esquerda
    { x: -1.22, y: 0.55, z: -3.6, isRear: true }, // Truque Direita
    { x: 1.22, y: 0.55, z: -3.6, isRear: true },  // Truque Esquerda
  ];

  wheelLocations.forEach((loc) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(loc.x, loc.y, loc.z);

    // Pneu borracha com perfil esculpido
    const tireGeom = new THREE.CylinderGeometry(0.56, 0.56, 0.34, 32);
    const tire = new THREE.Mesh(tireGeom, rubberTire);
    tire.rotation.z = Math.PI / 2;
    wheelGroup.add(tire);

    // Roda de Alumínio Forjado Alcoa Dura-Bright
    const rimGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.36, 28);
    const rim = new THREE.Mesh(rimGeom, rimAlcoa);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Cubo Planetário Central
    const hubGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.38, 16);
    const hub = new THREE.Mesh(hubGeom, darkSkirts);
    hub.rotation.z = Math.PI / 2;
    wheelGroup.add(hub);

    // 10 Parafusos Cromados de Roda
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const boltGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.39, 8);
      const bolt = new THREE.Mesh(boltGeom, chromeTrim);
      bolt.rotation.z = Math.PI / 2;
      bolt.position.set(0, Math.cos(angle) * 0.26, Math.sin(angle) * 0.26);
      wheelGroup.add(bolt);
    }

    // Aberturas de Refrigeração do Disco na Roda
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + Math.PI / 10;
      const slotGeom = new THREE.BoxGeometry(0.4, 0.06, 0.1);
      const slot = new THREE.Mesh(slotGeom, darkSkirts);
      slot.position.set(0, Math.cos(angle) * 0.25, Math.sin(angle) * 0.25);
      slot.rotation.x = angle;
      wheelGroup.add(slot);
    }

    bus.add(wheelGroup);
  });

  return bus;
}

// ==========================================================================
// 2. MODELO: FOLE DE SUSPENSÃO PNEUMÁTICA INDUSTRIAL (AIR SPRING)
// ==========================================================================
function buildAirSuspensionModel() {
  const group = new THREE.Group();
  group.name = "AirSuspensionIndustrial";

  const castSteel = new THREE.MeshStandardMaterial({
    color: 0x283038,
    metalness: 0.88,
    roughness: 0.25,
  });

  const vulcanizedRubber = new THREE.MeshStandardMaterial({
    color: 0x16181c,
    roughness: 0.72,
    metalness: 0.12,
  });

  const forgedGirdle = new THREE.MeshStandardMaterial({
    color: 0xc8102e, // Vermelho Sinal Center Ônibus
    metalness: 0.82,
    roughness: 0.2,
  });

  const machinedBrass = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Latão Dourado
    metalness: 0.92,
    roughness: 0.18,
  });

  const chromeBolts = new THREE.MeshStandardMaterial({
    color: 0xf0f3f6,
    metalness: 0.98,
    roughness: 0.08,
  });

  // 2.1 Prato Superior Usinado em Aço Forjado
  const topPlateGeom = new THREE.CylinderGeometry(1.15, 1.15, 0.14, 36);
  const topPlate = new THREE.Mesh(topPlateGeom, castSteel);
  topPlate.position.set(0, 1.45, 0);
  group.add(topPlate);

  // Conexão Pneumática Rápida de Entrada de Ar (Latão Dourado com Rosca)
  const valveGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.42, 20);
  const valve = new THREE.Mesh(valveGeom, machinedBrass);
  valve.position.set(0.45, 1.68, 0.25);
  group.add(valve);

  const valveNutGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 6); // Porca sextavada
  const valveNut = new THREE.Mesh(valveNutGeom, machinedBrass);
  valveNut.position.set(0.45, 1.58, 0.25);
  group.add(valveNut);

  // Prisioneiros Roscados de Montagem Superior
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const studGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.38, 12);
    const stud = new THREE.Mesh(studGeom, chromeBolts);
    stud.position.set(Math.cos(angle) * 0.8, 1.62, Math.sin(angle) * 0.8);
    group.add(stud);

    // Porca sextavada de aperto
    const nutGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 6);
    const nut = new THREE.Mesh(nutGeom, chromeBolts);
    nut.position.set(Math.cos(angle) * 0.8, 1.54, Math.sin(angle) * 0.8);
    group.add(nut);
  }

  // 2.2 Três Convoluções de Borracha Vulcanizada (Triple Lobe Bellow)
  const lobeYCoords = [0.95, 0.35, -0.25];
  lobeYCoords.forEach((y, idx) => {
    // Torus da borda externa
    const torusGeom = new THREE.TorusGeometry(1.05, 0.32, 24, 48);
    const torus = new THREE.Mesh(torusGeom, vulcanizedRubber);
    torus.rotation.x = Math.PI / 2;
    torus.position.set(0, y, 0);
    group.add(torus);

    // Núcleo cilíndrico interno
    const coreGeom = new THREE.CylinderGeometry(1.0, 1.0, 0.38, 36);
    const core = new THREE.Mesh(coreGeom, vulcanizedRubber);
    core.position.set(0, y, 0);
    group.add(core);

    // Anéis de Aço Forjado de Contenção entre as Convoluções
    if (idx < lobeYCoords.length - 1) {
      const nextY = lobeYCoords[idx + 1];
      const ringY = (y + nextY) / 2;

      const ringGeom = new THREE.TorusGeometry(0.85, 0.065, 16, 36);
      const ring = new THREE.Mesh(ringGeom, forgedGirdle);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, ringY, 0);
      group.add(ring);

      // Trava de fixação do anel
      const clampGeom = new THREE.BoxGeometry(0.15, 0.12, 0.08);
      const clamp = new THREE.Mesh(clampGeom, chromeBolts);
      clamp.position.set(0.88, ringY, 0);
      group.add(clamp);
    }
  });

  // 2.3 Pistão Cônico Inferior de Apoio e Articulação
  const pistonGeom = new THREE.CylinderGeometry(0.78, 1.05, 0.9, 36);
  const piston = new THREE.Mesh(pistonGeom, castSteel);
  piston.position.set(0, -0.85, 0);
  group.add(piston);

  // Nervuras de reforço estrutural no pistão
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const ribGeom = new THREE.BoxGeometry(0.04, 0.85, 0.15);
    const rib = new THREE.Mesh(ribGeom, castSteel);
    rib.position.set(Math.cos(angle) * 0.9, -0.85, Math.sin(angle) * 0.9);
    rib.rotation.y = -angle;
    group.add(rib);
  }

  // Flange Inferior com Furo de Fixação
  const baseFlangeGeom = new THREE.CylinderGeometry(1.08, 1.08, 0.15, 36);
  const baseFlange = new THREE.Mesh(baseFlangeGeom, castSteel);
  baseFlange.position.set(0, -1.35, 0);
  group.add(baseFlange);

  // Parafuso Central Passante M24
  const centerBoltGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.28, 6);
  const centerBolt = new THREE.Mesh(centerBoltGeom, chromeBolts);
  centerBolt.position.set(0, -1.48, 0);
  group.add(centerBolt);

  return group;
}

// ==========================================================================
// 3. MODELO: COMPRESSOR DE CLIMATIZAÇÃO SPHEROS / DENSO CC305
// ==========================================================================
function buildAcCompressorModel() {
  const group = new THREE.Group();
  group.name = "SpherosCompressorCC305";

  const castAluminum = new THREE.MeshStandardMaterial({
    color: 0x82919e,
    metalness: 0.88,
    roughness: 0.24,
  });

  const pulleySteel = new THREE.MeshStandardMaterial({
    color: 0x1e242b,
    metalness: 0.92,
    roughness: 0.18,
  });

  const valveBrass = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.92,
    roughness: 0.16,
  });

  const clutchRed = new THREE.MeshStandardMaterial({
    color: 0xc8102e,
    metalness: 0.75,
    roughness: 0.25,
  });

  const chromeHardware = new THREE.MeshStandardMaterial({
    color: 0xf4f7fa,
    metalness: 0.98,
    roughness: 0.08,
  });

  // 3.1 Bloco Central Cilíndrico com Carcaça Fundida
  const blockGeom = new THREE.CylinderGeometry(0.88, 0.88, 1.95, 36);
  const block = new THREE.Mesh(blockGeom, castAluminum);
  block.rotation.z = Math.PI / 2;
  group.add(block);

  // 14 Aletas Circunferênciais de Dissipação de Calor
  for (let x = -0.72; x <= 0.72; x += 0.12) {
    const finGeom = new THREE.CylinderGeometry(0.98, 0.98, 0.035, 36);
    const fin = new THREE.Mesh(finGeom, castAluminum);
    fin.rotation.z = Math.PI / 2;
    fin.position.set(x, 0, 0);
    group.add(fin);
  }

  // 3.2 Cabeçote Traseiro com Válvulas Rotalock de Sucção e Descarga
  const headGeom = new THREE.CylinderGeometry(0.92, 0.92, 0.38, 36);
  const head = new THREE.Mesh(headGeom, castAluminum);
  head.rotation.z = Math.PI / 2;
  head.position.set(-1.15, 0, 0);
  group.add(head);

  // 8 Parafusos de Fixação do Cabeçote
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const boltGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 6);
    const bolt = new THREE.Mesh(boltGeom, chromeHardware);
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(-1.36, Math.cos(angle) * 0.72, Math.sin(angle) * 0.72);
    group.add(bolt);
  }

  // Válvula de Sucção Superior (Maior diâmetro)
  const suctionGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 20);
  const suction = new THREE.Mesh(suctionGeom, valveBrass);
  suction.position.set(-1.15, 1.05, 0.35);
  group.add(suction);

  const suctionCap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 6), valveBrass);
  suctionCap.position.set(-1.15, 1.35, 0.35);
  group.add(suctionCap);

  // Válvula de Descarga (Alta Pressão)
  const dischargeGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.55, 20);
  const discharge = new THREE.Mesh(dischargeGeom, valveBrass);
  discharge.position.set(-1.15, 1.05, -0.35);
  group.add(discharge);

  const dischargeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.15, 6), valveBrass);
  dischargeCap.position.set(-1.15, 1.35, -0.35);
  group.add(dischargeCap);

  // Visor de Nível de Óleo (Sight Glass)
  const sightGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 20);
  const sight = new THREE.Mesh(sightGeom, chromeHardware);
  sight.rotation.x = Math.PI / 2;
  sight.position.set(-0.5, -0.4, 0.9);
  group.add(sight);

  // 3.3 Polia Dianteira de Duplo Rolamento com Canais Micro-V (8-PK)
  const pulleyGeom = new THREE.CylinderGeometry(1.08, 1.08, 0.5, 40);
  const pulley = new THREE.Mesh(pulleyGeom, pulleySteel);
  pulley.rotation.z = Math.PI / 2;
  pulley.position.set(1.22, 0, 0);
  group.add(pulley);

  // 8 Estrias Micro-V na polia
  for (let px = 1.06; px <= 1.38; px += 0.05) {
    const ribGeom = new THREE.CylinderGeometry(1.11, 1.11, 0.02, 40);
    const rib = new THREE.Mesh(ribGeom, castAluminum);
    rib.rotation.z = Math.PI / 2;
    rib.position.set(px, 0, 0);
    group.add(rib);
  }

  // Disco de Embreagem Magnética Frontal com Lâminas Flexíveis
  const clutchGeom = new THREE.CylinderGeometry(0.85, 0.85, 0.12, 32);
  const clutch = new THREE.Mesh(clutchGeom, clutchRed);
  clutch.rotation.z = Math.PI / 2;
  clutch.position.set(1.52, 0, 0);
  group.add(clutch);

  // 3 Lâminas Flexíveis Triangulares na Embreagem
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const leafGeom = new THREE.BoxGeometry(0.04, 0.12, 0.45);
    const leaf = new THREE.Mesh(leafGeom, chromeHardware);
    leaf.position.set(1.58, Math.cos(angle) * 0.42, Math.sin(angle) * 0.42);
    leaf.rotation.x = angle;
    group.add(leaf);
  }

  // Porca Sextavada de Retenção do Eixo Central
  const centerNutGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.18, 6);
  const centerNut = new THREE.Mesh(centerNutGeom, chromeHardware);
  centerNut.rotation.z = Math.PI / 2;
  centerNut.position.set(1.64, 0, 0);
  group.add(centerNut);

  // 3.4 Suportes de Montagem Rígidos (Olhais de Fixação no Chassi)
  [-0.6, 0.6].forEach((mx) => {
    [-0.75, 0.75].forEach((mz) => {
      const earGeom = new THREE.BoxGeometry(0.18, 0.28, 0.25);
      const ear = new THREE.Mesh(earGeom, castAluminum);
      ear.position.set(mx, -0.88, mz);
      group.add(ear);

      const holeGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.3, 16);
      const hole = new THREE.Mesh(holeGeom, chromeHardware);
      hole.position.set(mx, -0.88, mz);
      group.add(hole);
    });
  });

  return group;
}

// ==========================================================================
// 4. MODELO: BLOCO ÓPTICO FAROL BI-LED MARCOPOLO G8 COM DRL INTEGRADO
// ==========================================================================
function buildLedHeadlightModel() {
  const group = new THREE.Group();
  group.name = "BiLedProjectorHeadlight";

  const clearPolycarbonate = new THREE.MeshPhysicalMaterial({
    color: 0xf8fbff,
    transmission: 0.94,
    roughness: 0.04,
    metalness: 0.05,
    thickness: 0.6,
    transparent: true,
    opacity: 0.75,
  });

  const housingBlack = new THREE.MeshStandardMaterial({
    color: 0x101317,
    roughness: 0.55,
    metalness: 0.65,
  });

  const reflectorChrome = new THREE.MeshStandardMaterial({
    color: 0xf4f7fa,
    metalness: 0.98,
    roughness: 0.05,
  });

  const ledProjectorLight = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x70bbff,
    emissiveIntensity: 3.5,
    roughness: 0.05,
  });

  const drlGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x70bbff,
    emissiveIntensity: 2.5,
    roughness: 0.1,
  });

  const amberTurnSignal = new THREE.MeshStandardMaterial({
    color: 0xff9900,
    emissive: 0xff6600,
    emissiveIntensity: 2.2,
    roughness: 0.2,
  });

  const aluminumHeatSink = new THREE.MeshStandardMaterial({
    color: 0x556370,
    metalness: 0.92,
    roughness: 0.3,
  });

  // 4.1 Carcaça Traseira Selada Automotiva
  const housingGeom = new THREE.BoxGeometry(2.4, 1.4, 1.6);
  const housing = new THREE.Mesh(housingGeom, housingBlack);
  housing.position.set(0, 0, -0.4);
  group.add(housing);

  // Aletas Traseiras de Arrefecimento em Alumínio para o LED
  for (let z = -0.8; z >= -1.35; z -= 0.08) {
    const sinkGeom = new THREE.BoxGeometry(1.6, 0.95, 0.035);
    const sink = new THREE.Mesh(sinkGeom, aluminumHeatSink);
    sink.position.set(0, 0, z);
    group.add(sink);
  }

  // 4.2 Lente Externa Aerodinâmica em Policarbonato Cristal
  const lensGeom = new THREE.BoxGeometry(2.46, 1.46, 0.12);
  const lens = new THREE.Mesh(lensGeom, clearPolycarbonate);
  lens.position.set(0, 0, 0.42);
  group.add(lens);

  // 4.3 Canhão Projetor Bi-LED 01 (Facho Baixo)
  const proj1HousingGeom = new THREE.CylinderGeometry(0.38, 0.45, 0.55, 28);
  const proj1Housing = new THREE.Mesh(proj1HousingGeom, reflectorChrome);
  proj1Housing.rotation.x = Math.PI / 2;
  proj1Housing.position.set(-0.55, 0.05, 0.1);
  group.add(proj1Housing);

  const proj1LensGeom = new THREE.SphereGeometry(0.32, 24, 24);
  const proj1Lens = new THREE.Mesh(proj1LensGeom, ledProjectorLight);
  proj1Lens.position.set(-0.55, 0.05, 0.32);
  group.add(proj1Lens);

  // Aro Angel-Eye Iluminado em volta do Projetor 1
  const halo1Geom = new THREE.TorusGeometry(0.36, 0.032, 16, 32);
  const halo1 = new THREE.Mesh(halo1Geom, drlGlowMaterial);
  halo1.position.set(-0.55, 0.05, 0.36);
  group.add(halo1);

  // 4.4 Canhão Projetor Bi-LED 02 (Facho Alto / Matrix)
  const proj2HousingGeom = new THREE.CylinderGeometry(0.34, 0.42, 0.55, 28);
  const proj2Housing = new THREE.Mesh(proj2HousingGeom, reflectorChrome);
  proj2Housing.rotation.x = Math.PI / 2;
  proj2Housing.position.set(0.55, 0.05, 0.1);
  group.add(proj2Housing);

  const proj2LensGeom = new THREE.SphereGeometry(0.28, 24, 24);
  const proj2Lens = new THREE.Mesh(proj2LensGeom, ledProjectorLight);
  proj2Lens.position.set(0.55, 0.05, 0.32);
  group.add(proj2Lens);

  // Aro Angel-Eye Iluminado em volta do Projetor 2
  const halo2Geom = new THREE.TorusGeometry(0.32, 0.032, 16, 32);
  const halo2 = new THREE.Mesh(halo2Geom, drlGlowMaterial);
  halo2.position.set(0.55, 0.05, 0.36);
  group.add(halo2);

  // 4.5 Guia DRL em Formato L (L-Shape Light-Pipe)
  const drlCurve = new THREE.CurvePath();
  const line1 = new THREE.LineCurve3(
    new THREE.Vector3(-1.08, 0.55, 0.38),
    new THREE.Vector3(1.08, 0.55, 0.38)
  );
  const line2 = new THREE.LineCurve3(
    new THREE.Vector3(1.08, 0.55, 0.38),
    new THREE.Vector3(1.08, -0.45, 0.38)
  );
  drlCurve.add(line1);
  drlCurve.add(line2);

  const drlTubeGeom = new THREE.TubeGeometry(drlCurve, 32, 0.045, 12, false);
  const drlTube = new THREE.Mesh(drlTubeGeom, drlGlowMaterial);
  group.add(drlTube);

  // 4.6 Fita Dinâmica de Seta Sequencial em Âmbar (Turn Indicator)
  const turnSignalGeom = new THREE.BoxGeometry(1.9, 0.07, 0.05);
  const turnSignal = new THREE.Mesh(turnSignalGeom, amberTurnSignal);
  turnSignal.position.set(0, -0.52, 0.36);
  group.add(turnSignal);

  // Foco Refletor Parabólico de Canto
  const cornerReflectorGeom = new THREE.CylinderGeometry(0.25, 0.08, 0.3, 16, 1, true);
  const cornerReflector = new THREE.Mesh(cornerReflectorGeom, reflectorChrome);
  cornerReflector.rotation.x = Math.PI / 2;
  cornerReflector.position.set(0.95, -0.2, 0.15);
  group.add(cornerReflector);

  return group;
}

// ==========================================================================
// 5. MODELO: DISCO DE FREIO AUTOVENTILADO COM PINÇA DUPLA (BREMBO/KNORR)
// ==========================================================================
function buildBrakeDiscModel() {
  const group = new THREE.Group();
  group.name = "VentilatedBrakeDiscPro";

  const nodularIron = new THREE.MeshStandardMaterial({
    color: 0x48525e,
    metalness: 0.9,
    roughness: 0.28,
  });

  const rotorFriction = new THREE.MeshStandardMaterial({
    color: 0xd8dde4,
    metalness: 0.94,
    roughness: 0.14,
  });

  const aluminumHat = new THREE.MeshStandardMaterial({
    color: 0x1f242b,
    metalness: 0.88,
    roughness: 0.35,
  });

  const caliperRed = new THREE.MeshStandardMaterial({
    color: 0xc8102e, // Vermelho Sinal Center Ônibus
    metalness: 0.65,
    roughness: 0.22,
  });

  const chromeHardware = new THREE.MeshStandardMaterial({
    color: 0xf4f7fa,
    metalness: 0.98,
    roughness: 0.08,
  });

  // 5.1 Disco de Freio - Prato de Fricção Dianteiro
  const discOuterRadius = 1.45;
  const discInnerRadius = 0.82;
  const discThickness = 0.08;

  const frontDiscGeom = new THREE.CylinderGeometry(discOuterRadius, discOuterRadius, discThickness, 48);
  const frontDisc = new THREE.Mesh(frontDiscGeom, rotorFriction);
  frontDisc.rotation.x = Math.PI / 2;
  frontDisc.position.set(0, 0, 0.14);
  group.add(frontDisc);

  // 5.2 Disco de Freio - Prato de Fricção Traseiro
  const rearDiscGeom = new THREE.CylinderGeometry(discOuterRadius, discOuterRadius, discThickness, 48);
  const rearDisc = new THREE.Mesh(rearDiscGeom, rotorFriction);
  rearDisc.rotation.x = Math.PI / 2;
  rearDisc.position.set(0, 0, -0.14);
  group.add(rearDisc);

  // 5.3 48 Aletas Internas de Ventilação Radial (Vane Channels)
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    const vaneGeom = new THREE.BoxGeometry(0.04, 0.45, 0.2);
    const vane = new THREE.Mesh(vaneGeom, nodularIron);
    vane.position.set(Math.cos(angle) * 1.12, Math.sin(angle) * 1.12, 0);
    vane.rotation.z = angle + 0.35; // Ângulo direcional de fluxo aerodinâmico
    group.add(vane);
  }

  // Furos Transversais de Arrefecimento em Espiral (Cross-Drilled Holes)
  for (let r = 0.92; r <= 1.36; r += 0.11) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const holeOffset = a + r * 1.8;
      const holeGeom = new THREE.CylinderGeometry(0.024, 0.024, 0.42, 10);
      const hole = new THREE.Mesh(holeGeom, aluminumHat);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(Math.cos(holeOffset) * r, Math.sin(holeOffset) * r, 0);
      group.add(hole);
    }
  }

  // 5.4 Panela Central em Alumínio Billet (Center Hat)
  const hatGeom = new THREE.CylinderGeometry(discInnerRadius + 0.04, discInnerRadius + 0.04, 0.42, 36);
  const hat = new THREE.Mesh(hatGeom, aluminumHat);
  hat.rotation.x = Math.PI / 2;
  hat.position.set(0, 0, 0.18);
  group.add(hat);

  // Furo Central do Cubo de Roda
  const centerBoreGeom = new THREE.CylinderGeometry(0.42, 0.42, 0.46, 32);
  const centerBore = new THREE.Mesh(centerBoreGeom, nodularIron);
  centerBore.rotation.x = Math.PI / 2;
  centerBore.position.set(0, 0, 0.18);
  group.add(centerBore);

  // 10 Furos dos Parafusos Prisioneiros de Fixação da Roda
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const studHoleGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.48, 16);
    const studHole = new THREE.Mesh(studHoleGeom, chromeHardware);
    studHole.rotation.x = Math.PI / 2;
    studHole.position.set(Math.cos(angle) * 0.62, Math.sin(angle) * 0.62, 0.18);
    group.add(studHole);
  }

  // 5.5 Pinça de Freio Monobloco Dupla Heavy-Duty (Brembo/Knorr-Bremse Style)
  const caliperGroup = new THREE.Group();
  caliperGroup.position.set(-1.08, 0.65, 0);
  caliperGroup.rotation.z = -0.55;

  // Corpo Principal Monobloco em Vermelho Sinal
  const caliperBodyGeom = new THREE.BoxGeometry(0.72, 1.45, 0.58);
  const caliperBody = new THREE.Mesh(caliperBodyGeom, caliperRed);
  caliperGroup.add(caliperBody);

  // Cilindros Hidráulicos Opostos (Dual Pistons)
  [-0.32, 0.32].forEach((py) => {
    [-0.18, 0.18].forEach((pz) => {
      const pistonCoverGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 20);
      const pistonCover = new THREE.Mesh(pistonCoverGeom, chromeHardware);
      pistonCover.rotation.z = Math.PI / 2;
      pistonCover.position.set(-0.35, py, pz);
      caliperGroup.add(pistonCover);
    });
  });

  // Válvulas de Sangria Hidráulica (Bleed Nipples)
  [0.55, -0.55].forEach((by) => {
    const bleederGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.18, 12);
    const bleeder = new THREE.Mesh(bleederGeom, chromeHardware);
    bleeder.position.set(-0.1, by, 0.28);
    caliperGroup.add(bleeder);
  });

  // Linha Hidráulica Rígida em Aço Inox
  const brakeLineGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 12);
  const brakeLine = new THREE.Mesh(brakeLineGeom, chromeHardware);
  brakeLine.position.set(-0.38, 0, 0.28);
  caliperGroup.add(brakeLine);

  // Logo Embossado CENTER BUS na Pinça
  const logoPlateGeom = new THREE.BoxGeometry(0.04, 0.45, 0.25);
  const logoPlate = new THREE.Mesh(logoPlateGeom, chromeHardware);
  logoPlate.position.set(-0.37, 0, 0);
  caliperGroup.add(logoPlate);

  group.add(caliperGroup);

  return group;
}

// ==========================================================================
// EXECUÇÃO GERAL DE EXPORTAÇÃO
// ==========================================================================
async function main() {
  console.log(`Iniciando geração de modelos 3D ultra-detalhados em ${outputDir}`);

  try {
    await exportGlb(buildBusModel(), "bus_coach_heavy_duty.glb");
    await exportGlb(buildAirSuspensionModel(), "air_suspension_bellow.glb");
    await exportGlb(buildAcCompressorModel(), "ac_compressor_heavy.glb");
    await exportGlb(buildLedHeadlightModel(), "led_projector_headlight.glb");
    await exportGlb(buildBrakeDiscModel(), "ventilated_disc_brake_pro.glb");

    console.log("Todos os novos modelos 3D ultra-detalhados foram gerados com sucesso!");
  } catch (err) {
    console.error("Erro durante a geração de modelos:", err);
    process.exit(1);
  }
}

main();
