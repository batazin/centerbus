import { mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const sequences = fileURLToPath(new URL("../public/sequences/", import.meta.url));
const columns = 4;
const framesPerSheet = 16;
const frameCount = 121;

for (const [sequence, width, height] of [
  ["bus-body-flow-v2", 640, 360],
  ["bus-body-flow-mobile-v2", 480, 270],
]) {
  const source = path.join(sequences, sequence);
  const destination = path.join(sequences, `${sequence}-sheets`);
  await mkdir(destination, { recursive: true });
  let bytes = 0;

  for (let start = 0; start < frameCount; start += framesPerSheet) {
    const count = Math.min(framesPerSheet, frameCount - start);
    const cells = await Promise.all(Array.from({ length: count }, async (_, cell) => {
      const frame = String((start + cell) * 2 + 1).padStart(4, "0");
      const input = await sharp(path.join(source, `frame_${frame}.webp`))
        .resize(width, height).removeAlpha().raw().toBuffer();
      return {
        input,
        raw: { width, height, channels: 3 },
        left: cell % columns * width,
        top: Math.floor(cell / columns) * height,
      };
    }));
    const sheet = path.join(destination, `sheet_${start / framesPerSheet}.webp`);
    await sharp({
      create: { width: columns * width, height: Math.ceil(count / columns) * height, channels: 3, background: "#122b4a" },
    }).composite(cells).webp({ quality: 72 }).toFile(sheet);
    bytes += (await stat(sheet)).size;
  }

  console.log(`${sequence}: ${frameCount} quadros, ${(bytes / 1048576).toFixed(2)} MiB`);
}
