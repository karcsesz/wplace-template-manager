import {
    Color,
    FreeColor,
    InvertedFreeColorMap,
    InvertedPaidColorMap,
    PaidColor,
} from "../colorMap";

export const getColorsFromImage = async (blob: Blob) => {
    const canvas = document.createElement("canvas");
    const image = await createImageBitmap(blob);

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colors: Color[] = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        const pixelIndex = i * 4;
        const r = imageData.data[pixelIndex];
        const g = imageData.data[pixelIndex + 1];
        const b = imageData.data[pixelIndex + 2];

        const hex =
            "#" +
            r?.toString(16).padStart(2, "0") +
            g?.toString(16).padStart(2, "0") +
            b?.toString(16).padStart(2, "0");

        if (!colors.includes(hex as Color)) {
            let color: Color | undefined = InvertedFreeColorMap.get(hex as FreeColor);
            if (!color) {
                color = InvertedPaidColorMap.get(hex as PaidColor);
            }

            if (!color) {
                continue;
            }

            colors.push(color!);
        }
    }

    return colors;
};
