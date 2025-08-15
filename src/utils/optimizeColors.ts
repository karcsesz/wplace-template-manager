import { ColorValue } from "../colorMap";
import { hexToRgb } from "./hexToRgb";

export const optimizeColors = async (
    imageBitmap: ImageBitmap,
    colorList: ColorValue[],
    scale = 1,
): Promise<Blob> => {
    const canvas = document.createElement("canvas");

    canvas.width = Math.floor(imageBitmap.width * scale);
    canvas.height = Math.floor(imageBitmap.height * scale);

    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const rgbColors = colorList.map(hexToRgb);
    const COLOR_SPACE_PRECISION = 16;
    const colorLookup = new Int32Array(
        COLOR_SPACE_PRECISION * COLOR_SPACE_PRECISION * COLOR_SPACE_PRECISION,
    );

    for (let r = 0; r < COLOR_SPACE_PRECISION; r++) {
        for (let g = 0; g < COLOR_SPACE_PRECISION; g++) {
            for (let b = 0; b < COLOR_SPACE_PRECISION; b++) {
                const actualR = ((r * 255) / (COLOR_SPACE_PRECISION - 1)) | 0;
                const actualG = ((g * 255) / (COLOR_SPACE_PRECISION - 1)) | 0;
                const actualB = ((b * 255) / (COLOR_SPACE_PRECISION - 1)) | 0;

                let minDistance = Number.MAX_VALUE;
                let closestColorIndex = 0;

                for (let i = 0; i < rgbColors.length; i++) {
                    const color = rgbColors[i];
                    const distance =
                        2 * (actualR - color.r) * (actualR - color.r) +
                        4 * (actualG - color.g) * (actualG - color.g) +
                        3 * (actualB - color.b) * (actualB - color.b);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestColorIndex = i;
                    }
                }

                const index =
                    r * COLOR_SPACE_PRECISION * COLOR_SPACE_PRECISION +
                    g * COLOR_SPACE_PRECISION +
                    b;
                colorLookup[index] = closestColorIndex;
            }
        }
    }

    const length = data.length;
    for (let i = 0; i < length; i += 4) {
        const r = ((data[i] * (COLOR_SPACE_PRECISION - 1)) / 255) | 0;
        const g = ((data[i + 1] * (COLOR_SPACE_PRECISION - 1)) / 255) | 0;
        const b = ((data[i + 2] * (COLOR_SPACE_PRECISION - 1)) / 255) | 0;

        const lookupIndex =
            r * COLOR_SPACE_PRECISION * COLOR_SPACE_PRECISION + g * COLOR_SPACE_PRECISION + b;
        const closestColor = rgbColors[colorLookup[lookupIndex]];

        data[i] = closestColor.r;
        data[i + 1] = closestColor.g;
        data[i + 2] = closestColor.b;
    }

    ctx.putImageData(imageData, 0, 0);

    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!));
    });

    canvas.remove();

    return blob;
};
