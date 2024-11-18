import { Map } from './interfaces/Map';
import Options from './interfaces/Options';
declare class TacticalMapRenderer {
    private readonly map;
    private readonly options;
    /**
     * Creates an instance of the TacticalMapRenderer.
     *
     * @param map - The map object to be rendered.
     * @param options - Configuration options for rendering the map.
     */
    constructor(map: Map, options: Options);
    private loadAssets;
    private addWatermark;
    render(): Promise<Buffer>;
}
export { TacticalMapRenderer };
