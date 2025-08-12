import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useParam } from "../components/Router/useParam";
import { Color, FreeColor, FreeColorMap, PaidColor, PaidColorMap } from "../colorMap";
import { formatString } from "../utils/formatString";
import { useAtom } from "jotai";
import { overlayAtom } from "../atoms/overlay";
import { ColorCheckbox } from "../components/ColorCheckbox/ColorCheckbox";
import { base64ToImage } from "../utils/base64ToImage";
import { Buffer } from "buffer";
import { addMetadata } from "meta-png";

export const Edit: FC = () => {
    const [overlays, setOverlay] = useAtom(overlayAtom);
    const [selectedColors, setSelectedColors] = useState<Color[]>([]);
    const [search, setSearch] = useState<string>("");
    const [onlyShowSelectedColors, setOnlyShowSelectedColors] = useState<boolean>(false);
    const name = useParam("name");

    const currentOverlayIndex = useMemo(() => {
        return overlays.findIndex((overlay) => overlay.name === name);
    }, [overlays, name]);

    useEffect(() => {
        setOnlyShowSelectedColors(overlays[currentOverlayIndex].onlyShowSelectedColors ?? false);
        setSelectedColors(overlays[currentOverlayIndex].colorSelection ?? []);
    }, [overlays, currentOverlayIndex]);

    const colorCheckboxOnchange = (event: ChangeEvent<HTMLInputElement>, key: Color) => {
        if (event.target.checked) {
            setSelectedColors((prev) => [...prev, key]);
        } else {
            setSelectedColors((prev) => prev.filter((color) => color !== key));
        }
    };

    const ColorCheckRenderer = useMemo(() => {
        return [...FreeColorMap.entries(), ...PaidColorMap.entries()]
            .filter(([key]) => formatString(key).toLowerCase().includes(search.toLowerCase()))
            .map(([key, value]) => {
                return (
                    <ColorCheckbox
                        onChange={(event) => colorCheckboxOnchange(event, key)}
                        color={value}
                        name={key}
                        checked={selectedColors.includes(key)}
                    />
                );
            });
    }, [FreeColorMap, PaidColorMap, search, selectedColors]);

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

            <input
                type={"search"}
                onChange={(event) => setSearch(event.target.value)}
                className={"btn btn-sm"}
                placeholder={"Search"}
            />
            <div className={"Grid"}>{ColorCheckRenderer}</div>
            <button
                className={"btn btn-primary"}
                onClick={() => {
                    setOverlay([
                        ...overlays.slice(0, currentOverlayIndex),
                        {
                            ...overlays[currentOverlayIndex],
                            colorSelection: selectedColors,
                            onlyShowSelectedColors,
                        },
                        ...overlays.slice(currentOverlayIndex + 1),
                    ]);
                    location.reload();
                }}
            >
                Save
            </button>
            <button
                className={"btn btn-primary"}
                onClick={async () => {
                    const overlay = overlays[currentOverlayIndex];
                    const image = base64ToImage(overlay.image, "image/png");
                    const imageBuffer = await image.arrayBuffer();

                    const result = addMetadata(
                        new Uint8Array(imageBuffer),
                        "wplace-data",
                        `${overlay.chunk[0]},${overlay.chunk[1]},${overlay.coordinate[0]},${overlay.coordinate[1]}`,
                    );

                    await navigator.clipboard.write([
                        new ClipboardItem({
                            "image/png": new Blob([new Uint8Array(result)], { type: "image/png" }),
                        }),
                    ]);
                }}
            >
                Export
            </button>
            <button
                className={"btn btn-destructive"}
                onClick={() => {
                    setOverlay([
                        ...overlays.slice(0, currentOverlayIndex),
                        ...overlays.slice(currentOverlayIndex + 1),
                    ]);
                    location.reload();
                }}
            >
                Delete
            </button>
        </Overlay>
    );
};
