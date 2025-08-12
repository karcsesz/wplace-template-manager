import { atomWithStorage } from "jotai/utils";
import { Color } from "../colorMap";

export type Overlay = {
    chunk: [number, number];
    coordinate: [number, number];
    image: string;
    templateColors: Color[];
    colorSelection: Color[];
    onlyShowSelectedColors: boolean;
    name: string;
};

export const overlayAtom = atomWithStorage<Overlay[]>("overlays", []);
