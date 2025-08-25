import React, { FC, useMemo } from "react";
import "./OverlayList.css";
import { OverlayListEntry } from "./OverlayListEntry";
import { useAtom } from "jotai";
import { overlayAtom } from "../../atoms/overlay";

export const OverlayList: FC = () => {
    const [overlays, setOverlays] = useAtom(overlayAtom);

    const toggleVisibility = (currentlyHidden: boolean, index: number) => {
        setOverlays([
            ...overlays.slice(0, index),
            { ...overlays[index], hidden: !currentlyHidden },
            ...overlays.slice(index + 1),
        ]);
    };

    const overlaysList = useMemo(
        () =>
            overlays.map(({ image, name, chunk, coordinate, hidden, width, height }, index) => {
                return (
                    <OverlayListEntry
                        name={name}
                        image={image}
                        key={name}
                        chunk={chunk}
                        position={coordinate}
                        isHidden={hidden}
                        toggleVisiblity={() => toggleVisibility(hidden, index)}
                        width={width}
                        height={height}
                    />
                );
            }),
        [overlays],
    );

    return (
        <table className={"table max-sm:text-sm"}>
            <tbody>{overlaysList}</tbody>
        </table>
    );
};
