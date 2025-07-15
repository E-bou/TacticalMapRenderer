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
exports.TacticalMapRenderer = void 0;
const canvas_1 = __importDefault(require("canvas"));
const Map_1 = require("./interfaces/Map");
const assetsCache = {};
class TacticalMapRenderer {
    /**
     * Creates an instance of the TacticalMapRenderer.
     *
     * @param map - The map object to be rendered.
     * @param options - Configuration options for rendering the map.
     */
    constructor(map, options) {
        this.map = map;
        this.options = options;
    }
    loadAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            const assets = {
                high: 'areaUnitHigh',
                gray: 'grayCell',
                purple: 'purpleCell',
            };
            if (this.options.displayStartCells) {
                assets.ally = 'areaUnitAlly';
                assets.enemy = 'areaUnitEnemy';
            }
            if (this.options.addWatermark) {
                assets.logo = 'E-bou';
            }
            const loadedAssets = {};
            for (const [key, value] of Object.entries(assets)) {
                const assetPath = `${this.options.assetPath}/${value}.png`;
                if (assetsCache[assetPath]) {
                    loadedAssets[key] = assetsCache[assetPath];
                }
                else {
                    const image = yield canvas_1.default.loadImage(assetPath);
                    assetsCache[assetPath] = image;
                    loadedAssets[key] = image;
                }
            }
            return {
                high: loadedAssets.high,
                gray: loadedAssets.gray,
                purple: loadedAssets.purple,
                ally: loadedAssets.ally,
                enemy: loadedAssets.enemy,
                logo: loadedAssets.logo,
            };
        });
    }
    addWatermark(ctx, asset) {
        const assetWidth = Math.min(100, asset.width);
        const assetHeight = Math.min(100, asset.height);
        const margin = 10;
        const xPos = Map_1.Constants.WIDTH - assetWidth - margin;
        const yPos = Map_1.Constants.HEIGHT - assetHeight - margin;
        ctx.drawImage(asset, xPos, yPos, assetWidth, assetHeight);
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            const assets = yield this.loadAssets();
            const img = canvas_1.default.createCanvas(Map_1.Constants.WIDTH, Map_1.Constants.HEIGHT);
            const ctx = img.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, Map_1.Constants.WIDTH, Map_1.Constants.HEIGHT);
            for (const cell of this.map.mapData.cellsData) {
                const cellId = cell.cellNumber;
                const cellCoords = {
                    x: cellId % Map_1.Constants.MAP_WIDTH,
                    y: Math.floor(cellId / Map_1.Constants.MAP_WIDTH),
                };
                const x = (cellId % Map_1.Constants.MAP_WIDTH) * Map_1.Constants.CELL_WIDTH + (Math.floor(cellId / Map_1.Constants.MAP_WIDTH) % 2) * Map_1.Constants.CELL_HALF_WIDTH;
                const y = Math.floor(cellId / Map_1.Constants.MAP_WIDTH) * Map_1.Constants.CELL_HALF_HEIGHT;
                let cellNeedToBeDraw = false;
                if (cell.mov && !cell.nonWalkableDuringFight) {
                    const asset = cellCoords.y % 2 === 0 ? assets.gray : assets.purple;
                    ctx.drawImage(asset, x, y, Map_1.Constants.CELL_WIDTH, Map_1.Constants.CELL_HEIGHT);
                    cellNeedToBeDraw = true;
                }
                if (!cell.los && !cell.nonWalkableDuringFight) {
                    ctx.drawImage(assets.high, x, y + Map_1.Constants.CELL_OFFSET, Map_1.Constants.CELL_WIDTH, Map_1.Constants.CELL_DOUBLE_HEIGHT);
                }
                if (cell.blue && assets.ally && this.options.displayStartCells) {
                    ctx.drawImage(assets.ally, x, y + Map_1.Constants.CELL_OFFSET, Map_1.Constants.CELL_WIDTH, Map_1.Constants.CELL_DOUBLE_HEIGHT);
                    cellNeedToBeDraw = true;
                }
                if (cell.red && assets.enemy && this.options.displayStartCells) {
                    ctx.drawImage(assets.enemy, x, y + Map_1.Constants.CELL_OFFSET, Map_1.Constants.CELL_WIDTH, Map_1.Constants.CELL_DOUBLE_HEIGHT);
                    cellNeedToBeDraw = true;
                }
                if (this.options.displayCellId && cellNeedToBeDraw) {
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(cellId.toString(), x + Map_1.Constants.CELL_WIDTH / 2, y + Map_1.Constants.CELL_HEIGHT / 2);
                }
            }
            if (this.options.addWatermark && assets.logo) {
                this.addWatermark(ctx, assets.logo);
            }
            return img.toBuffer();
        });
    }
}
exports.TacticalMapRenderer = TacticalMapRenderer;
