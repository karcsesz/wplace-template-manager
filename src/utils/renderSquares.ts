export async function renderSquares(
    baseBlob: Blob,
    chunkX: number,
    chunkY: number,
    posX: number,
    posY: number,
    squares: string[][],
): Promise<Blob | null> {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d")!;

    const img = await createImageBitmap(baseBlob);
    ctx.drawImage(img, 0, 0, 1000, 1000);

    for (let y = 0; y <= 1000; y++) {
        for (let x = 0; x <= 1000; x++) {
            ctx.fillStyle = "#000000aa";
            ctx.fillRect(x, y, 1, 1);
        }
    }

    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob));
    });
}
