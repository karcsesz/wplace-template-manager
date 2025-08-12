import { FreeColor, InvertedFreeColorMap, InvertedPaidColorMap, PaidColor } from "../colorMap";

export async function imageToPixels(image: any) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.imageSmoothingEnabled = false;

    const pixels = [];
    const img = await createImageBitmap(image);

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            const hex =
                "#" +
                r.toString(16).padStart(2, "0") +
                g.toString(16).padStart(2, "0") +
                b.toString(16).padStart(2, "0");

            let key: keyof typeof FreeColor | keyof typeof PaidColor | "" | undefined =
                InvertedFreeColorMap.get(hex as FreeColor);

            if (!key) {
                key = InvertedPaidColorMap.get(hex as PaidColor);
            }

            if (!key) {
                key = "";
            }

            row.push(key);
        }
        pixels.push(row);
    }

    return pixels;
}
