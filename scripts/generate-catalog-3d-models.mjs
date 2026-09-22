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

// Brand Colors
const COLORS = {
  centerBlue: 0x122b4a,
  roadBlue: 0x2e6da4,
  signalRed: 0xc8102e,
  chassisGray: 0xe4e7eb,
  centerWhite: 0xf4f4f4,
  technicalBlack: 0x101418,
  chrome: 0xf0f3f6,
  amber: 0xf59e0b,
  goldZinc: 0xc59b3f,
  rubberBlack: 0x1a1e24,
};

// ==========================================================================
// 1. FAROL PRINCIPAL TRIPLO COM PROJETORES (BLOCO ÓPTICO G7/G8)
// ==========================================================================
function buildHeadlightModel() {
  const group = new THREE.Group();
  group.name = "FarolTriploProjetor";

  // Materiais suaves
  const chromeMat = new THREE.MeshStandardMaterial({
    color: COLORS.chrome,
    metalness: 0.95,
    roughness: 0.12,
  });

  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x161b22,
    metalness: 0.8,
    roughness: 0.35,
  });

  const lensGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.38,
    roughness: 0.05,
    metalness: 0.1,
  });

  const projectorGlassMat = new THREE.MeshStandardMaterial({
    color: 0xd0e8ff,
    transparent: true,
    opacity: 0.85,
    roughness: 0.08,
    metalness: 0.2,
  });

  const amberMat = new THREE.MeshStandardMaterial({
    color: COLORS.amber,
    roughness: 0.25,
    metalness: 0.3,
  });

  // Carcaça externa aerodinâmica curva
  const housingShape = new THREE.Shape();
  housingShape.moveTo(-1.8, -0.6);
  housingShape.quadraticCurveTo(-1.9, 0.4, -1.2, 0.7);
  housingShape.lineTo(1.5, 0.55);
  housingShape.quadraticCurveTo(2.1, 0.2, 2.0, -0.4);
  housingShape.quadraticCurveTo(1.5, -0.75, -1.8, -0.6);

  const extrudeSettings = {
    steps: 2,
    depth: 0.85,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.08,
    bevelSegments: 12,
  };

  const housingGeo = new THREE.ExtrudeGeometry(housingShape, extrudeSettings);
  housingGeo.computeVertexNormals();
  const housingMesh = new THREE.Mesh(housingGeo, housingMat);
  housingMesh.position.z = -0.55;
  group.add(housingMesh);

  // Moldura refletora interna cromada
  const innerReflectorGeo = new THREE.ExtrudeGeometry(housingShape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 6,
  });
  innerReflectorGeo.computeVertexNormals();
  const innerReflector = new THREE.Mesh(innerReflectorGeo, chromeMat);
  innerReflector.position.z = -0.05;
  innerReflector.scale.set(0.94, 0.92, 1);
  group.add(innerReflector);

  // 3 Canhões Projetores Circulares em Alumínio Torneado
  const projectorOffsets = [-0.95, -0.05, 0.85];
  const projectorRadii = [0.44, 0.38, 0.34];

  projectorOffsets.forEach((x, idx) => {
    const r = projectorRadii[idx];
    // Aro cilíndrico torneado
    const rimGeo = new THREE.CylinderGeometry(r, r * 1.08, 0.35, 48);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.computeVertexNormals();
    const rim = new THREE.Mesh(rimGeo, chromeMat);
    rim.position.set(x, -0.02, 0.15);
    group.add(rim);

    // Lente semiesférica do projetor
    const lensGeo = new THREE.SphereGeometry(r * 0.82, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
    lensGeo.rotateX(Math.PI / 2);
    lensGeo.computeVertexNormals();
    const lens = new THREE.Mesh(lensGeo, projectorGlassMat);
    lens.position.set(x, -0.02, 0.28);
    group.add(lens);

    // Miolo central com anel sutil
    const coreGeo = new THREE.TorusGeometry(r * 0.5, 0.035, 24, 48);
    coreGeo.computeVertexNormals();
    const core = new THREE.Mesh(coreGeo, chromeMat);
    core.position.set(x, -0.02, 0.22);
    group.add(core);
  });

  // Refletor de Seta Lateral Âmbar
  const turnSignalGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.2, 36);
  turnSignalGeo.rotateX(Math.PI / 2);
  turnSignalGeo.computeVertexNormals();
  const turnSignal = new THREE.Mesh(turnSignalGeo, amberMat);
  turnSignal.position.set(1.55, 0.05, 0.12);
  group.add(turnSignal);

  // Lente externa frontal curva
  const outerLensGeo = new THREE.ExtrudeGeometry(housingShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.04,
    bevelSegments: 10,
  });
  outerLensGeo.computeVertexNormals();
  const outerLens = new THREE.Mesh(outerLensGeo, lensGlassMat);
  outerLens.position.z = 0.35;
  outerLens.scale.set(0.97, 0.95, 1);
  group.add(outerLens);

  // Aletas de Dissipação Traseiras
  for (let i = 0; i < 6; i++) {
    const finGeo = new THREE.BoxGeometry(2.4, 0.04, 0.45);
    finGeo.computeVertexNormals();
    const fin = new THREE.Mesh(finGeo, housingMat);
    fin.position.set(0, -0.4 + i * 0.16, -0.75);
    group.add(fin);
  }

  return group;
}

// ==========================================================================
// 2. LANTERNA TRASEIRA VERTICAL MODULAR LED (G7/G8)
// ==========================================================================
function buildTailLightModel() {
  const group = new THREE.Group();
  group.name = "LanternaTraseiraVerticalLED";

  const redGlassMat = new THREE.MeshStandardMaterial({
    color: COLORS.signalRed,
    transparent: true,
    opacity: 0.88,
    roughness: 0.18,
    metalness: 0.25,
  });

  const clearGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.82,
    roughness: 0.12,
    metalness: 0.3,
  });

  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x141820,
    metalness: 0.85,
    roughness: 0.3,
  });

  const reflectorMat = new THREE.MeshStandardMaterial({
    color: 0xe0e6ed,
    metalness: 0.95,
    roughness: 0.1,
  });

  // Carcaça vertical trapezoidal estilizada
  const tailShape = new THREE.Shape();
  tailShape.moveTo(-0.45, -2.0);
  tailShape.lineTo(0.45, -1.8);
  tailShape.lineTo(0.35, 2.0);
  tailShape.lineTo(-0.45, 1.9);
  tailShape.closePath();

  const baseGeo = new THREE.ExtrudeGeometry(tailShape, {
    depth: 0.45,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 10,
  });
  baseGeo.computeVertexNormals();
  const baseMesh = new THREE.Mesh(baseGeo, housingMat);
  baseMesh.position.z = -0.3;
  group.add(baseMesh);

  // Lente Vermelha Superior e Média (Freio e Posição)
  const redCoverGeo = new THREE.ExtrudeGeometry(tailShape, {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 8,
  });
  redCoverGeo.computeVertexNormals();
  const redCover = new THREE.Mesh(redCoverGeo, redGlassMat);
  redCover.position.z = 0.18;
  group.add(redCover);

  // Módulos Internos de LED (Colmeia de Prismas)
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 3; col++) {
      const ledGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.1, 16);
      ledGeo.rotateX(Math.PI / 2);
      ledGeo.computeVertexNormals();
      const isReverse = row === 3 || row === 4;
      const led = new THREE.Mesh(ledGeo, isReverse ? reflectorMat : redGlassMat);
      led.position.set(-0.24 + col * 0.24, -1.4 + row * 0.34, 0.12);
      group.add(led);
    }
  }

  // Seção Branca Central (Luz de Ré)
  const revGeo = new THREE.BoxGeometry(0.72, 0.55, 0.18);
  revGeo.computeVertexNormals();
  const revMesh = new THREE.Mesh(revGeo, clearGlassMat);
  revMesh.position.set(-0.02, -0.22, 0.19);
  group.add(revMesh);

  // Frisos de Fixação e Borda de Vedação NBR
  const sealGeo = new THREE.BoxGeometry(0.96, 4.15, 0.06);
  sealGeo.computeVertexNormals();
  const sealMesh = new THREE.Mesh(sealGeo, new THREE.MeshStandardMaterial({ color: COLORS.rubberBlack, roughness: 0.8 }));
  sealMesh.position.set(-0.02, 0.0, -0.32);
  group.add(sealMesh);

  return group;
}

// ==========================================================================
// 3. MECANISMO PANTOGRÁFICO DE LIMPADOR 24V COM PALHETA CURVA
// ==========================================================================
function buildWiperPantographModel() {
  const group = new THREE.Group();
  group.name = "MecanismoPantograficoLimpador";

  const goldZincMat = new THREE.MeshStandardMaterial({
    color: COLORS.goldZinc,
    metalness: 0.88,
    roughness: 0.24,
  });

  const motorBodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a212d,
    metalness: 0.75,
    roughness: 0.35,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x8a99a8,
    metalness: 0.9,
    roughness: 0.2,
  });

  const rubberMat = new THREE.MeshStandardMaterial({
    color: COLORS.rubberBlack,
    metalness: 0.1,
    roughness: 0.9,
  });

  // Motor Elétrico Cilíndrico 24V
  const motorCylGeo = new THREE.CylinderGeometry(0.38, 0.38, 1.1, 48);
  motorCylGeo.computeVertexNormals();
  const motorCyl = new THREE.Mesh(motorCylGeo, motorBodyMat);
  motorCyl.position.set(-1.1, -0.4, 0);
  group.add(motorCyl);

  // Caixa de Redução / Engrenagens
  const gearboxGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 36);
  gearboxGeo.rotateZ(Math.PI / 2);
  gearboxGeo.computeVertexNormals();
  const gearbox = new THREE.Mesh(gearboxGeo, goldZincMat);
  gearbox.position.set(-0.55, -0.4, 0);
  group.add(gearbox);

  // Placa Base Estampada de Fixação
  const plateGeo = new THREE.BoxGeometry(1.8, 0.9, 0.08);
  plateGeo.computeVertexNormals();
  const plate = new THREE.Mesh(plateGeo, goldZincMat);
  plate.position.set(-0.35, -0.1, -0.15);
  group.add(plate);

  // Dois Eixos Cônicos de Saída Dupla (Pantográficos)
  [-0.6, 0.2].forEach((x) => {
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.6, 32);
    shaftGeo.computeVertexNormals();
    const shaft = new THREE.Mesh(shaftGeo, steelMat);
    shaft.position.set(x, 0.15, 0.12);
    group.add(shaft);

    const nutGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 6);
    nutGeo.computeVertexNormals();
    const nut = new THREE.Mesh(nutGeo, goldZincMat);
    nut.position.set(x, 0.42, 0.12);
    group.add(nut);
  });

  // Braços Articulados Pantográficos Duplos Paralelos
  const arm1Geo = new THREE.CylinderGeometry(0.045, 0.045, 2.2, 24);
  arm1Geo.rotateZ(-0.48);
  arm1Geo.computeVertexNormals();
  const arm1 = new THREE.Mesh(arm1Geo, steelMat);
  arm1.position.set(0.3, 1.1, 0.2);
  group.add(arm1);

  const arm2Geo = new THREE.CylinderGeometry(0.045, 0.045, 2.2, 24);
  arm2Geo.rotateZ(-0.48);
  arm2Geo.computeVertexNormals();
  const arm2 = new THREE.Mesh(arm2Geo, steelMat);
  arm2.position.set(0.65, 0.9, 0.2);
  group.add(arm2);

  // Cabeça Articulada de Junção
  const headGeo = new THREE.BoxGeometry(0.24, 0.35, 0.14);
  headGeo.computeVertexNormals();
  const head = new THREE.Mesh(headGeo, goldZincMat);
  head.position.set(1.25, 1.85, 0.22);
  group.add(head);

  // Palheta Curva Aerodinâmica Panorâmica
  const wiperCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.5, 2.6, 0.24),
    new THREE.Vector3(1.3, 1.9, 0.24),
    new THREE.Vector3(1.9, 0.9, 0.24)
  );

  const wiperGeo = new THREE.TubeGeometry(wiperCurve, 48, 0.05, 16, false);
  wiperGeo.computeVertexNormals();
  const wiperFrame = new THREE.Mesh(wiperGeo, steelMat);
  group.add(wiperFrame);

  // Borracha do Limpador (Squeegee)
  const rubberGeo = new THREE.TubeGeometry(wiperCurve, 48, 0.025, 12, false);
  rubberGeo.computeVertexNormals();
  const rubberMesh = new THREE.Mesh(rubberGeo, rubberMat);
  rubberMesh.position.z -= 0.04;
  group.add(rubberMesh);

  return group;
}

// ==========================================================================
// 4. ALÇAPÃO / ESCOTILHA DE TETO DE EMERGÊNCIA
// ==========================================================================
function buildRoofHatchModel() {
  const group = new THREE.Group();
  group.name = "AlcapaoEscotilhaTeto";

  const hatchBodyMat = new THREE.MeshStandardMaterial({
    color: 0x2b3745,
    metalness: 0.65,
    roughness: 0.38,
  });

  const handleRedMat = new THREE.MeshStandardMaterial({
    color: COLORS.signalRed,
    metalness: 0.55,
    roughness: 0.28,
  });

  const rubberMat = new THREE.MeshStandardMaterial({
    color: COLORS.rubberBlack,
    metalness: 0.1,
    roughness: 0.85,
  });

  // Tampa externa com cantos arredondados suaves
  const hatchShape = new THREE.Shape();
  const w = 1.4;
  const h = 1.1;
  const r = 0.25;

  hatchShape.moveTo(-w + r, -h);
  hatchShape.lineTo(w - r, -h);
  hatchShape.quadraticCurveTo(w, -h, w, -h + r);
  hatchShape.lineTo(w, h - r);
  hatchShape.quadraticCurveTo(w, h, w - r, h);
  hatchShape.lineTo(-w + r, h);
  hatchShape.quadraticCurveTo(-w, h, -w, h - r);
  hatchShape.lineTo(-w, -h + r);
  hatchShape.quadraticCurveTo(-w, -h, -w + r, -h);

  const lidGeo = new THREE.ExtrudeGeometry(hatchShape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 12,
  });
  lidGeo.computeVertexNormals();
  const lid = new THREE.Mesh(lidGeo, hatchBodyMat);
  lid.position.z = 0.05;
  group.add(lid);

  // Guarnição Perimetral de Borracha NBR
  const sealGeo = new THREE.ExtrudeGeometry(hatchShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 6,
  });
  sealGeo.computeVertexNormals();
  const seal = new THREE.Mesh(sealGeo, rubberMat);
  seal.scale.set(1.06, 1.06, 1);
  seal.position.z = -0.04;
  group.add(seal);

  // Grelha Central de Ventilação Rebaixada
  const ventTrayGeo = new THREE.BoxGeometry(1.2, 0.85, 0.08);
  ventTrayGeo.computeVertexNormals();
  const ventTray = new THREE.Mesh(ventTrayGeo, new THREE.MeshStandardMaterial({ color: 0x131a22, roughness: 0.6 }));
  ventTray.position.set(0, 0, 0.2);
  group.add(ventTray);

  // 8 Aletas de Ventilação Central
  for (let i = 0; i < 8; i++) {
    const louverGeo = new THREE.BoxGeometry(0.95, 0.04, 0.06);
    louverGeo.computeVertexNormals();
    const louver = new THREE.Mesh(louverGeo, hatchBodyMat);
    louver.position.set(0, -0.3 + i * 0.085, 0.24);
    group.add(louver);
  }

  // Travas / Puxadores Vermelhos de Emergência (Nas Laterais)
  [-1.05, 1.05].forEach((x) => {
    const handleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.5, 24);
    handleGeo.computeVertexNormals();
    const handle = new THREE.Mesh(handleGeo, handleRedMat);
    handle.position.set(x, 0, 0.22);
    group.add(handle);

    const bracketGeo = new THREE.BoxGeometry(0.12, 0.12, 0.1);
    bracketGeo.computeVertexNormals();
    [-0.2, 0.2].forEach((y) => {
      const b = new THREE.Mesh(bracketGeo, hatchBodyMat);
      b.position.set(x, y, 0.18);
      group.add(b);
    });
  });

  return group;
}

// ==========================================================================
// 5. ESPELHO RETROVISOR AERODINÂMICO RODOVIÁRIO
// ==========================================================================
function buildMirrorModel() {
  const group = new THREE.Group();
  group.name = "EspelhoRetrovisorRodoviario";

  const redPaintMat = new THREE.MeshStandardMaterial({
    color: COLORS.signalRed,
    metalness: 0.82,
    roughness: 0.22,
  });

  const mirrorGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.98,
    roughness: 0.04,
  });

  const blackCasingMat = new THREE.MeshStandardMaterial({
    color: 0x141a22,
    metalness: 0.85,
    roughness: 0.3,
  });

  const rubberMat = new THREE.MeshStandardMaterial({
    color: COLORS.rubberBlack,
    roughness: 0.85,
  });

  // Braço Superior Curvo Aerodinâmico em Vermelho Sinal
  const armCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-1.2, 1.5, 0),
    new THREE.Vector3(-0.4, 1.8, 0.1),
    new THREE.Vector3(0.5, 1.6, -0.05),
    new THREE.Vector3(0.8, 0.8, 0)
  );

  const armGeo = new THREE.TubeGeometry(armCurve, 48, 0.14, 24, false);
  armGeo.computeVertexNormals();
  const armMesh = new THREE.Mesh(armGeo, redPaintMat);
  group.add(armMesh);

  // Coifa Sanfonada de Borracha na Base de Fixação
  for (let ring = 0; ring < 6; ring++) {
    const bellowsGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 32);
    bellowsGeo.computeVertexNormals();
    const bellows = new THREE.Mesh(bellowsGeo, rubberMat);
    bellows.position.set(-1.2 + ring * 0.08, 1.5 - ring * 0.03, 0);
    group.add(bellows);
  }

  // Base de Ancoragem na Carroceria
  const baseFlangeGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.15, 32);
  baseFlangeGeo.rotateZ(Math.PI / 2);
  baseFlangeGeo.computeVertexNormals();
  const baseFlange = new THREE.Mesh(baseFlangeGeo, blackCasingMat);
  baseFlange.position.set(-1.45, 1.58, 0);
  group.add(baseFlange);

  // Carcaça Aerodinâmica do Espelho
  const mirrorHousingShape = new THREE.Shape();
  mirrorHousingShape.moveTo(-0.45, -1.2);
  mirrorHousingShape.lineTo(0.45, -1.1);
  mirrorHousingShape.quadraticCurveTo(0.55, 0.6, 0.4, 0.85);
  mirrorHousingShape.lineTo(-0.35, 0.85);
  mirrorHousingShape.quadraticCurveTo(-0.55, 0.6, -0.45, -1.2);

  const mirrorHousingGeo = new THREE.ExtrudeGeometry(mirrorHousingShape, {
    depth: 0.45,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 12,
  });
  mirrorHousingGeo.computeVertexNormals();
  const mirrorHousing = new THREE.Mesh(mirrorHousingGeo, blackCasingMat);
  mirrorHousing.position.set(0.8, -0.1, -0.2);
  group.add(mirrorHousing);

  // Calota Externa Dianteira em Vermelho Sinal
  const capGeo = new THREE.ExtrudeGeometry(mirrorHousingShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.04,
    bevelSegments: 8,
  });
  capGeo.computeVertexNormals();
  const capMesh = new THREE.Mesh(capGeo, redPaintMat);
  capMesh.position.set(0.8, -0.1, -0.28);
  group.add(capMesh);

  // Vidro 1: Espelho Principal Plano Superior
  const mirror1Geo = new THREE.BoxGeometry(0.72, 1.1, 0.04);
  mirror1Geo.computeVertexNormals();
  const mirror1 = new THREE.Mesh(mirror1Geo, mirrorGlassMat);
  mirror1.position.set(0.8, 0.15, 0.26);
  group.add(mirror1);

  // Vidro 2: Espelho Convexo Auxiliar de Ponto Cego Inferior
  const mirror2Geo = new THREE.BoxGeometry(0.72, 0.55, 0.04);
  mirror2Geo.computeVertexNormals();
  const mirror2 = new THREE.Mesh(mirror2Geo, mirrorGlassMat);
  mirror2.position.set(0.8, -0.75, 0.26);
  group.add(mirror2);

  return group;
}

// ==========================================================================
// EXPORTAÇÃO DOS ARQUIVOS GLB
// ==========================================================================
async function main() {
  console.log("--> Gerando modelos 3D curvos de alta fidelidade das peças do catálogo...");
  await exportGlb(buildHeadlightModel(), "farol_dianteiro_triplo.glb");
  await exportGlb(buildTailLightModel(), "lanterna_traseira_led.glb");
  await exportGlb(buildWiperPantographModel(), "mecanismo_pantografico_limpador.glb");
  await exportGlb(buildRoofHatchModel(), "alcapao_teto_emergencia.glb");
  await exportGlb(buildMirrorModel(), "espelho_retrovisor_rodoviario.glb");
  console.log("==> Todos os 5 modelos CAD das peças reais foram gerados com sucesso em /public/models!");
}

main().catch(console.error);
