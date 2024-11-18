# TacticalMapRenderer

A simple tactical map renderer for DOFUS 3 mainly used for the E-bou Discord bot.

## Installation

```bash
npm install git@github.com:E-bou/TacticalMapRenderer.git
```
## Usage

```javascript
import { TacticalMapRenderer } from 'tacticalmaprenderer';

const mapData = JSON.parse(fs.readFileSync('map.example.json', 'utf8')); // map data from DOFUS 3, see /readmeSrc/map.example.json

const renderer = new TacticalMapRenderer(data, { displayStartCells: true, addWatermark: true, assetPath: './node_modules/tacticalmaprenderer/assets' });
const buffer = await renderer.render();

fs.writeFileSync('map.png', buffer);
```

Example of generated map:

<img src="https://raw.githubusercontent.com/E-bou/TacticalMapRenderer/refs/heads/master/readmeSrc/map.png">
