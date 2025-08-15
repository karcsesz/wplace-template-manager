import {
    Color,
    ColorValue,
    FreeColor,
    InvertedFreeColorMap,
    InvertedPaidColorMap,
    PaidColor,
} from "../colorMap";
import { rgbToHex } from "./rgbToHex";

export const getColorsFromImage = async (image: ImageBitmap) => {
    const canvas = document.createElement("canvas");

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colors: Set<ColorValue> = new Set();

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        if (r && g && b) {
            const hex = rgbToHex(r, g, b);
            colors.add(hex as ColorValue);
        }
    }

    const mappedColors = Array.from(colors.values()).map((hex) => {
        let color: Color | undefined = InvertedFreeColorMap.get(hex as FreeColor);
        if (!color) {
            color = InvertedPaidColorMap.get(hex as PaidColor);
        }

        return color;
    });

    canvas.remove();

    return mappedColors.filter((color) => !!color);
};
