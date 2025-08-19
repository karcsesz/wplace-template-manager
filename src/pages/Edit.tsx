import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useParam } from "../components/Router/useParam";
import { useAtom } from "jotai";
import { overlayAtom } from "../atoms/overlay";
import { base64ToImage } from "../utils/base64ToImage";
import { useNavigate } from "../components/Router/navigate";
import text from "png-chunk-text";
import encode from "png-chunks-encode";
import extract from "png-chunks-extract";
import { Buffer } from "buffer";
import { positionAtom } from "../atoms/position";
import { ColorPicker } from "../components/ColorPicker/ColorPicker";
import { Color } from "../colorMap";
import { Location } from "../components/Icons/Location";

export const Edit: FC = () => {
    const [overlays, setOverlay] = useAtom(overlayAtom);
    const [onlyShowSelectedColors, setOnlyShowSelectedColors] = useState<boolean>(false);
    const [startChunk, setStartChunk] = useState<number[]>([]);
    const [startPosition, setStartPosition] = useState<number[]>([]);
    const [selectedColors, setSelectedColors] = useState<Color[]>([]);
    const [position] = useAtom(positionAtom);
    const name = useParam("name");
    const navigate = useNavigate();

    const currentOverlayIndex = useMemo(() => {
        return overlays.findIndex((overlay) => overlay.name === name);
    }, [overlays, name]);

    useEffect(() => {
        setOnlyShowSelectedColors(overlays[currentOverlayIndex]?.onlyShowSelectedColors ?? false);
        setSelectedColors(overlays[currentOverlayIndex]?.colorSelection ?? []);
    }, [overlays, currentOverlayIndex]);

    useEffect(() => {
        if (overlays[currentOverlayIndex]) {
            setStartChunk(overlays[currentOverlayIndex].chunk);
            setStartPosition(overlays[currentOverlayIndex].coordinate);
        }
    }, []);

    const exportButton = (
        <button
            className={"btn btn-sm"}
            onClick={async () => {
                const overlay = overlays[currentOverlayIndex];
                const image = base64ToImage(overlay.image, "image/png");
                const imageBuffer = Buffer.from(await image.arrayBuffer());
                const chunks = extract(imageBuffer);

                chunks.splice(
                    chunks.length - 1,
                    0,
                    text.encode(
                        "wplace",
                        `${overlay.name},${overlay.chunk[0]},${overlay.chunk[1]},${overlay.coordinate[0]},${overlay.coordinate[1]}`,
                    ),
                );

                const newBlob = new Blob([new Uint8Array(encode(chunks))], {
                    type: "image/png",
                });

                const url = URL.createObjectURL(newBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = overlay.name + ".png";
                a.click();
                URL.revokeObjectURL(url);
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
            <h2> Position: </h2>
            <div className={"row"}>
                <label className={"input"}>
                    <span className="label">CX</span>
                    <input
                        placeholder={"Chunk"}
                        type={"number"}
                        value={startChunk[0]}
                        onChange={(event) =>
                            setStartChunk(([x, y]) => [Number(event.target.value), y])
                        }
                    />
                </label>
                <label className={"input"}>
                    <span className="label">CY</span>
                    <input
                        placeholder={"Chunk"}
                        type={"number"}
                        value={startChunk[1]}
                        onChange={(event) =>
                            setStartChunk(([x, y]) => [x, Number(event.target.value)])
                        }
                    />
                </label>
                <label className={"input"}>
                    <span className="label">PX</span>
                    <input
                        placeholder={"Pos."}
                        type={"number"}
                        value={startPosition[0]}
                        onChange={(event) =>
                            setStartPosition(([x, y]) => [Number(event.target.value), y])
                        }
                    />
                </label>
                <label className={"input"}>
                    <span className="label">PY</span>
                    <input
                        placeholder={"Pos."}
                        type={"number"}
                        value={startPosition[1]}
                        onChange={(event) =>
                            setStartPosition(([x, y]) => [x, Number(event.target.value)])
                        }
                    />
                </label>
                <button
                    className={"btn btn-md"}
                    onClick={() => {
                        if (position.position.length && position.chunk.length) {
                            setStartChunk(position.chunk as [number, number]);
                            setStartPosition(position.position as [number, number]);
                        }
                    }}
                >
                    <Location className={"icon"} />
                </button>
            </div>
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
            <ColorPicker
                colorList={overlays[currentOverlayIndex]?.templateColors}
                setSelectedColorState={setSelectedColors}
                selectedColorState={selectedColors}
            />
            <button
                className={"btn btn-primary"}
                onClick={() => {
                    setOverlay([
                        ...overlays.slice(0, currentOverlayIndex),
                        {
                            ...overlays[currentOverlayIndex],
                            colorSelection: selectedColors,
                            chunk: startChunk as [number, number],
                            coordinate: startPosition as [number, number],
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
