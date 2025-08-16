import React, { FC } from "react";
import "./OverlayList.css";
import { OverlayListEntry } from "./OverlayListEntry";
import { useAtomValue } from "jotai";
import { overlayAtom } from "../../atoms/overlay";

export const OverlayList: FC = () => {
    const overlays = useAtomValue(overlayAtom);

    const overlaysList = overlays.map(({ image, name, chunk, coordinate }) => {
        return (
            <OverlayListEntry
                name={name}
                image={image}
                key={name}
                chunk={chunk}
                position={coordinate}
            />
        );
    });

    return (
        <table className={"table max-sm:text-sm"}>
            <tbody>{overlaysList}</tbody>
        </table>
    );
};
