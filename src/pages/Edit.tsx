import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useParam } from "../components/Router/useParam";
import { Color, FreeColor, FreeColorMap, PaidColor, PaidColorMap } from "../colorMap";
import { formatString } from "../utils/formatString";
import { useAtom } from "jotai";
import { overlayAtom } from "../atoms/overlay";
import { ColorCheckbox } from "../components/ColorCheckbox/ColorCheckbox";

export const Edit: FC = () => {
    const [overlay, setOverlay] = useAtom(overlayAtom);
    const [selectedColors, setSelectedColors] = React.useState<Color[]>([]);
    const [onlyShowSelectedColors, setOnlyShowSelectedColors] = useState<boolean>(false);
    const name = useParam("name");

    const currentOverlayIndex = useMemo(() => {
        return overlay.findIndex((overlay) => overlay.name === name);
    }, [overlay, name]);

    useEffect(() => {
        setOnlyShowSelectedColors(overlay[currentOverlayIndex].onlyShowSelectedColors ?? false);
        setSelectedColors(overlay[currentOverlayIndex].colorSelection ?? []);
    }, [overlay, currentOverlayIndex]);

    const colorCheckboxOnchange = (event: ChangeEvent<HTMLInputElement>, key: Color) => {
        if (event.target.checked) {
            setSelectedColors((prev) => [...prev, key]);
        } else {
            setSelectedColors((prev) => prev.filter((color) => color !== key));
        }
    };

    return (
        <Overlay headline={"Edit " + name} showBack>
            <label>
                <input
                    type={"checkbox"}
                    checked={onlyShowSelectedColors}
                    onChange={(event) => {
                        setOnlyShowSelectedColors(event.target.checked);
                    }}
                />{" "}
                Only show selected Colors
            </label>

            <div className={"Grid"}>
                {Array.from(FreeColorMap.entries()).map(([key, value]) => {
                    return (
                        <ColorCheckbox
                            onChange={(event) => colorCheckboxOnchange(event, key)}
                            color={value}
                            name={key}
                            checked={selectedColors.includes(key)}
                        />
                    );
                })}
                {Array.from(PaidColorMap.entries()).map(([key, value]) => {
                    return (
                        <ColorCheckbox
                            onChange={(event) => colorCheckboxOnchange(event, key)}
                            color={value}
                            name={key}
                            checked={selectedColors.includes(key)}
                        />
                    );
                })}
            </div>
            <button
                className={"btn btn-primary"}
                onClick={() => {
                    setOverlay([
                        ...overlay.slice(0, currentOverlayIndex),
                        {
                            ...overlay[currentOverlayIndex],
                            colorSelection: selectedColors,
                            onlyShowSelectedColors,
                        },
                        ...overlay.slice(currentOverlayIndex + 1),
                    ]);
                    location.reload();
                }}
            >
                Save
            </button>
        </Overlay>
    );
};
