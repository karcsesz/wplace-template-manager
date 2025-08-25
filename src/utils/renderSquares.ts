import { Overlay, overlayAtom } from "../atoms/overlay";
import { base64ToImage } from "./base64ToImage";
import { Color, ColorValue, FreeColor, FreeColorMap, PaidColor, PaidColorMap } from "../colorMap";
import { log } from "./log";
import { rgbToHex } from "./rgbToHex";

export async function renderSquares(
    baseBlob: Blob,
    overlays: Overlay[],
    chunkX: number,
    chunkY: number,
): Promise<Blob | null> {
    const expandedOverlays = await Promise.all(
        overlays.map(async (overlay) => {
            const image = base64ToImage(overlay.image, "image/png");
            const bitmap = await createImageBitmap(image);

            return {
                ...overlay,
                height: bitmap.height,
                width: bitmap.width,
                bitmap: bitmap,
                toChunkX:
                    overlay.chunk[0] + Math.floor((overlay.coordinate[0] + bitmap.width) / 1000),
                toChunkY:
                    overlay.chunk[1] + Math.floor((overlay.coordinate[1] + bitmap.height) / 1000),
            };
        }),
    );
    const chunkOverlays = expandedOverlays.filter((overlay) => {
        const greaterThanMin = chunkX >= overlay.chunk[0] && chunkY >= overlay.chunk[1];
        const smallerThanMax = chunkX <= overlay.toChunkX && chunkY <= overlay.toChunkY;

        return greaterThanMin && smallerThanMax;
    });

    const canvas = document.createElement("canvas");

    canvas.width = 3000;
    canvas.height = 3000;

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    const img = await createImageBitmap(baseBlob);
    ctx.drawImage(img, 0, 0, 3000, 3000);

    for (const overlay of chunkOverlays) {
        if (overlay.hidden) continue;

        const chunkXIndex = overlay.toChunkX - overlay.chunk[0] - (overlay.toChunkX - chunkX);
        const chunkYIndex = overlay.toChunkY - overlay.chunk[1] - (overlay.toChunkY - chunkY);

        const image = base64ToImage(overlay.image, "image/png");
        const bitmap = await createImageBitmap(image, {
            imageOrientation: "from-image",
        });

        let colorFilter: ColorValue[] | undefined;

        if (overlay?.onlyShowSelectedColors) {
            colorFilter = overlay?.colorSelection.map((color) => {
                const freeColor = FreeColorMap.get(color as keyof typeof FreeColor);
                if (freeColor) {
                    return freeColor;
                } else {
                    return PaidColorMap.get(color as keyof typeof PaidColor)!;
                }
            });
        }

        const templateBitmap = await createTemplateBitmap(bitmap, colorFilter);

        ctx.drawImage(
            templateBitmap,
            overlay.coordinate[0] * 3 - chunkXIndex * 3000,
            overlay.coordinate[1] * 3 - chunkYIndex * 3000,
            templateBitmap.width,
            templateBitmap.height,
        );
    }

    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!));
    });

    canvas.remove();

    return blob;
}

const createTemplateBitmap = async (
    imageBitmap: ImageBitmap,
    colorFilter?: ColorValue[],
): Promise<ImageBitmap> => {
    if (colorFilter) {
        const filtering_canvas = document.createElement("canvas");
        filtering_canvas.width = imageBitmap.width;
        filtering_canvas.height = imageBitmap.height;
        const ctx = filtering_canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(imageBitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, filtering_canvas.width, filtering_canvas.height);
        filtering_canvas.remove();
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const pixelIndex = (y * imageData.width + x) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];

                const hex = rgbToHex(r, g, b);
                if (!colorFilter.includes(hex as ColorValue)) {
                    imageData.data[pixelIndex + 3] = 0;
                }
            }
        }
        imageBitmap = await createImageBitmap(imageData);
    }
    const canvas = document.createElement("canvas");

    canvas.width = imageBitmap.width * 3;
    canvas.height = imageBitmap.height * 3;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Create a 3x3 mask, defaults to transparent black
    const mask = new Uint8ClampedArray(3 * 3 * 4);
    // Set the middle pixel to be opaque white
    for (let channel = 0; channel < 4; channel++) mask[4 * 4 + channel] = 255;
    // Convert to pattern
    const mask_image = new ImageData(mask, 3);
    const mask_uploaded = await createImageBitmap(mask_image);
    ctx.fillStyle = ctx.createPattern(mask_uploaded, "repeat")!;

    // Fill the canvas with the pattern
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Composite the image over it
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

    const bitmap = createImageBitmap(canvas);
    canvas.remove();

    return bitmap;
};
