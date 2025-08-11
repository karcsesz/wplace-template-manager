import { awaitElement } from "./awaitElement";

export async function renderSquares(
    chunkX: number,
    chunkY: number,
    posX: number,
    posY: number,
    squares: string[][],
) {
    const canvas = await awaitElement<HTMLCanvasElement>("body > div > div > div > div > canvas");
    const ctx = canvas.getContext("webgl2")!;

    for (let y = 0; y <= squares.length; y++) {
        const canvasY = posY + y * 1000;

        for (let x = 0; x <= squares[y].length; x++) {
            const canvasX = posX + x * 1000;
            const square = squares[y][x];
        }
    }
}
