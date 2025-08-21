import React, { FC, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useNavigate } from "../components/Router/navigate";
import { useAtom } from "jotai";
import { overlayAtom } from "../atoms/overlay";
import { Color } from "../colorMap";
import { CoordinateForm } from "../components/FormInputs/CoordinateForm";
import { ImageUpload } from "../components/FormInputs/ImageUpload";

export const Create: FC = () => {
    // Inputs
    const [name, setName] = useState<string>("");
    const [startChunk, setStartChunk] = useState<number[]>([]);
    const [startPosition, setStartPosition] = useState<number[]>([]);

    const [image, setImage] = useState<string>();
    const [imageColors, setImageColors] = useState<Color[]>();
    const [height, setHeight] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);

    const [overlay, setOverlay] = useAtom(overlayAtom);

    const navigate = useNavigate();
    return (
        <Overlay headline={"Create new Overlay"} showBack>
            <label className={"input w-full desktop-auto"}>
                <span className="label">Name</span>
                <input
                    onChange={(event) => setName(event.target.value)}
                    placeholder={"Name"}
                    className={"h-full"}
                    onKeyDown={(event) => {
                        event.stopPropagation();
                    }}
                />
            </label>
            <CoordinateForm
                chunkValue={startChunk}
                coordinateValue={startPosition}
                setChunkValue={setStartChunk}
                setCoordinateValue={setStartPosition}
            />
            <ImageUpload
                setImage={setImage}
                setImageColors={setImageColors}
                setHeight={setHeight}
                setWidth={setWidth}
            />
            <button
                disabled={!name || !image || !startChunk.length || !startPosition.length}
                className={"btn btn-primary"}
                onClick={async () => {
                    setOverlay([
                        ...overlay,
                        {
                            chunk: startChunk as [number, number],
                            coordinate: startPosition as [number, number],
                            image: image!,
                            colorSelection: [],
                            onlyShowSelectedColors: false,
                            name,
                            templateColors: imageColors!,
                            height,
                            width,
                        },
                    ]);
                    navigate("/");
                }}
            >
                Create
            </button>
        </Overlay>
    );
};
