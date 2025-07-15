import fs from 'fs';
import { TacticalMapRenderer } from '.';

async function generate(assetPath: string): Promise<void> {
  if (!fs.existsSync(assetPath)) {
    console.error(`The asset path ${assetPath} does not exist.`);
    process.exit(1);
  }

  const mapData = JSON.parse(fs.readFileSync(assetPath, 'utf8'));

  if (!mapData || !mapData.mapData.cellsData || !mapData.mapData.cellsData.length) {
    console.error('Invalid map data.');
    process.exit(1);
  }

  const renderer = new TacticalMapRenderer(mapData, { displayStartCells: true, addWatermark: true, assetPath: './assets', displayCellId: true });
  const buffer = await renderer.render();
  fs.writeFileSync('output.png', buffer);
}

if (process.argv.length < 3) {
  console.error('Usage: node dist/cli.js <assetPath>');
  process.exit(1);
}

const assetPath = process.argv[2];

generate(assetPath)