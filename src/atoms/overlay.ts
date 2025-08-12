import { atomWithStorage } from "jotai/utils";
import { FreeColor, PaidColor } from "../colorMap";

export type Overlay = {
    chunk: [number, number];
    coordinate: [number, number];
    image: string;
    colorSelection: (keyof typeof PaidColor | keyof typeof FreeColor)[];
    onlyShowSelectedColors: boolean;
    name: string;
};

export const overlayAtom = atomWithStorage<Overlay[]>("overlays", []);
