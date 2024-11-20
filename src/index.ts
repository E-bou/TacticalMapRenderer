import canvas from 'canvas';
import { Constants, Map } from './interfaces/Map';
import Options from './interfaces/Options';

class TacticalMapRenderer {
  private readonly map: Map;

  private readonly options: Options;

  /**
   * Creates an instance of the TacticalMapRenderer.
   * 
   * @param map - The map object to be rendered.
   * @param options - Configuration options for rendering the map.
   */
  constructor(map: Map, options: Options) {
    this.map = map;
    this.options = options;
  }

  private async loadAssets(): Promise<{
    high: canvas.Image,
    gray: canvas.Image,
    purple: canvas.Image,
    ally?: canvas.Image,
    enemy?: canvas.Image,
    logo?: canvas.Image,
  }> {
    const promises: Promise<canvas.Image>[] = [];

    const assets: Record<string, string> = {
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

    for (const [, value] of Object.entries(assets)) {
      promises.push(canvas.loadImage(`${this.options.assetPath}/${value}.png`));
    }

    return {
      high: await promises[0],
      gray: await promises[1],
      purple: await promises[2],
      ally: await promises[3],
      enemy: await promises[4],
      logo: await promises[5],
    };
  }

  private addWatermark(ctx: canvas.CanvasRenderingContext2D, asset: canvas.Image): void {
    const assetWidth = Math.min(100, asset.width);
    const assetHeight = Math.min(100, asset.height);

    const margin = 10;
    const xPos = Constants.WIDTH - assetWidth - margin;
    const yPos = Constants.HEIGHT - assetHeight - margin;
    ctx.drawImage(asset, xPos, yPos, assetWidth, assetHeight);
  }

  public async render(): Promise<Buffer> {
    const assets = await this.loadAssets();

    const img = canvas.createCanvas(Constants.WIDTH, Constants.HEIGHT);
    const ctx = img.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, Constants.WIDTH, Constants.HEIGHT);

    for (const cell of this.map.cellsData) {
      const cellId = cell.cellNumber;

      const cellCoords = {
        x: cellId % Constants.MAP_WIDTH,
        y: Math.floor(cellId / Constants.MAP_WIDTH),
      }

      const x = (cellId % Constants.MAP_WIDTH) * Constants.CELL_WIDTH + (Math.floor(cellId / Constants.MAP_WIDTH) % 2) * Constants.CELL_HALF_WIDTH;
      const y = Math.floor(cellId / Constants.MAP_WIDTH) * Constants.CELL_HALF_HEIGHT;

      if (cell.mov && !cell.nonWalkableDuringFight) {
        const asset = cellCoords.y % 2 === 0 ? assets.gray : assets.purple;
        ctx.drawImage(asset, x, y, Constants.CELL_WIDTH, Constants.CELL_HEIGHT);
      }

      if (!cell.los && !cell.nonWalkableDuringFight) {
        ctx.drawImage(assets.high, x, y + Constants.CELL_OFFSET, Constants.CELL_WIDTH, Constants.CELL_DOUBLE_HEIGHT);
      }


      if (this.options.displayStartCells) {
        if (cell.blue && assets.ally) {
          ctx.drawImage(assets.ally, x, y + Constants.CELL_OFFSET, Constants.CELL_WIDTH, Constants.CELL_DOUBLE_HEIGHT);
        }

        if (cell.red && assets.enemy) {
          ctx.drawImage(assets.enemy, x, y + Constants.CELL_OFFSET, Constants.CELL_WIDTH, Constants.CELL_DOUBLE_HEIGHT);
        }
      }
    }

    if (this.options.addWatermark && assets.logo) {
      this.addWatermark(ctx, assets.logo);
    }

    return img.toBuffer();
  }
}

export { TacticalMapRenderer };