import { atomWithStorage } from "jotai/utils";

export type Overlay = {
    chunk: [number, number];
    coordinate: [number, number];
    image: string;
    pixelMap: string[][];
    name: string;
};

export const overlayAtom = atomWithStorage<Overlay[]>("overlays", []);
