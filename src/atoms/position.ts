import { atom } from "jotai";

export const positionAtom = atom<{ position: number[]; chunk: number[] }>({
    position: [],
    chunk: [],
});
