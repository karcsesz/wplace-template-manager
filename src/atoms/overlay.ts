import { atomWithStorage } from "jotai/utils";
import { Color } from "../colorMap";

export type Overlay = {
    chunk: [number, number];
    coordinate: [number, number];
    image: string;
    height: number;
    width: number;
    templateColors: Color[];
    colorSelection: Color[];
    onlyShowSelectedColors: boolean;
    name: string;
    hidden: boolean;
};

export const overlayAtom = atomWithStorage<Overlay[]>("overlays", []);
