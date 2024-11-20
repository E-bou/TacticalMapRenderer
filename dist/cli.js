"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const _1 = require(".");
function generate(assetPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(assetPath)) {
            console.error(`The asset path ${assetPath} does not exist.`);
            process.exit(1);
        }
        const mapData = JSON.parse(fs_1.default.readFileSync(assetPath, 'utf8'));
        if (!mapData || !mapData.cellsData || !mapData.cellsData.length) {
            console.error('Invalid map data.');
            process.exit(1);
        }
        const renderer = new _1.TacticalMapRenderer(mapData, { displayStartCells: true, addWatermark: true, assetPath: './assets' });
        const buffer = yield renderer.render();
        fs_1.default.writeFileSync('output.png', buffer);
    });
}
if (process.argv.length < 3) {
    console.error('Usage: node dist/cli.js <assetPath>');
    process.exit(1);
}
const assetPath = process.argv[2];
generate(assetPath);
