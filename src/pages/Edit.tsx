import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useParam } from "../components/Router/useParam";
import { Color, FreeColorMap, PaidColorMap } from "../colorMap";
import { formatString } from "../utils/formatString";
import { useAtom } from "jotai";
import { overlayAtom } from "../atoms/overlay";
import { ColorCheckbox } from "../components/ColorCheckbox/ColorCheckbox";
import { base64ToImage } from "../utils/base64ToImage";
import { addMetadata } from "meta-png";
import { useNavigate } from "../components/Router/navigate";

export const Edit: FC = () => {
    const [overlays, setOverlay] = useAtom(overlayAtom);
    const [selectedColors, setSelectedColors] = useState<Color[]>([]);
    const [search, setSearch] = useState<string>("");
    const [onlyShowSelectedColors, setOnlyShowSelectedColors] = useState<boolean>(false);
    const name = useParam("name");
    const navigate = useNavigate();

    const currentOverlayIndex = useMemo(() => {
        return overlays.findIndex((overlay) => overlay.name === name);
    }, [overlays, name]);

    useEffect(() => {
        setOnlyShowSelectedColors(overlays[currentOverlayIndex]?.onlyShowSelectedColors ?? false);
        setSelectedColors(overlays[currentOverlayIndex]?.colorSelection ?? []);
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
            .filter(([key]) => overlays[currentOverlayIndex]?.templateColors.includes(key))
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

    const exportButton = (
        <button
            className={"btn btn-sm"}
            onClick={async () => {
                const overlay = overlays[currentOverlayIndex];
                const image = base64ToImage(overlay.image, "image/png");
                const imageBuffer = await image.arrayBuffer();

                const result = addMetadata(
                    new Uint8Array(imageBuffer),
                    "wplace",
                    `${overlay.name},${overlay.chunk[0]},${overlay.chunk[1]},${overlay.coordinate[0]},${overlay.coordinate[1]}`,
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
    );

    const deleteButton = (
        <button
            className={"btn btn-sm"}
            onClick={() => {
                setOverlay([
                    ...overlays.slice(0, currentOverlayIndex),
                    ...overlays.slice(currentOverlayIndex + 1),
                ]);
                navigate("/");
            }}
        >
            Delete
        </button>
    );

    return (
        <Overlay
            headline={"Edit " + name}
            showBack
            customRenderer={
                <div>
                    {exportButton}
                    {deleteButton}
                </div>
            }
        >
            <label>
                <input
                    type={"checkbox"}
                    checked={onlyShowSelectedColors}
                    onChange={(event) => {
                        setOnlyShowSelectedColors(event.target.checked);
                    }}
                    style={{ marginRight: "10px" }}
                />
                Only show selected Colors
            </label>

            <input
                type={"search"}
                onChange={(event) => setSearch(event.target.value)}
                className={"btn btn-sm"}
                placeholder={"Search"}
                onKeyDown={(event) => {
                    event.stopPropagation();
                }}
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
                    navigate("/");
                }}
            >
                Save
            </button>
        </Overlay>
    );
};
