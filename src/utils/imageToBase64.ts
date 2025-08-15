import { Buffer } from "buffer";

export async function imageToBase64(image: File | Blob): Promise<string> {
    const arrayBuffer = await image.arrayBuffer();
    return new Buffer(arrayBuffer).toString("base64");
}
