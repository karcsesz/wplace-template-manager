export class CustomCanvas {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;

    public constructor(width: number, height?: number) {
        this._canvas = document.createElement("canvas");
        this._canvas.width = width;
        this._canvas.height = height ?? width;
        this._ctx = this._canvas.getContext("2d", { willReadFrequently: true })!;
        this._ctx.imageSmoothingEnabled = false;
    }

    public get ctx() {
        return this._ctx;
    }

    public get canvas() {
        return this._canvas;
    }

    public destroy() {
        this._canvas.remove();
    }
}
