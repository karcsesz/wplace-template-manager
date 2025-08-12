import { Overlay, overlayAtom } from "../atoms/overlay";
import { base64ToImage } from "./base64ToImage";

export async function renderSquares(
    baseBlob: Blob,
    overlays: Overlay[],
    chunkX: number,
    chunkY: number,
): Promise<Blob | null> {
    const chunkOverlays = overlays.filter((overlay) => {
        return overlay.chunk[0] === chunkX && overlay.chunk[1] === chunkY;
    });
    const canvas = document.createElement("canvas");

    canvas.width = 1000;
    canvas.height = 1000;

    const ctx = canvas.getContext("2d")!;

    const img = await createImageBitmap(baseBlob);
    ctx.drawImage(img, 0, 0, 1000, 1000);

    for (const overlay of chunkOverlays) {
        const image = base64ToImage(overlay.image, "image/png");
        const bitmap = await createImageBitmap(image);

        ctx.drawImage(
            bitmap,
            overlay.coordinate[0],
            overlay.coordinate[1],
            bitmap.width,
            bitmap.height,
        );
    }

    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob));
    });
}
