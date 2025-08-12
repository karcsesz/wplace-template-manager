import React, { FC, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useNavigate } from "../components/Router/navigate";
import { useAtom } from "jotai";
import { overlayAtom } from "../atoms/overlay";
import { imageToBase64 } from "../utils/imageToBase64";
import { getColorsFromImage } from "../utils/getColorsFromImage";

export const Create: FC = () => {
    const [name, setName] = useState<string>("");
    const [startChunk, setStartChunk] = useState<[number, number]>([0, 0]);
    const [startPosition, setStartPosition] = useState<[number, number]>([0, 0]);
    const [image, setImage] = useState<File>();
    const [overlay, setOverlay] = useAtom(overlayAtom);

    const navigate = useNavigate();
    return (
        <Overlay headline={"Create new Overlay"} showBack>
            <input
                name={"name"}
                className={"btn btn-sm"}
                placeholder={"Name"}
                onChange={(event) => setName(event.target.value)}
            />
            <div className={"row"}>
                <input
                    type={"number"}
                    name={"chunkX"}
                    className={"btn btn-sm"}
                    placeholder={"Chunk X"}
                    onChange={(event) => setStartChunk(([x, y]) => [Number(event.target.value), y])}
                />
                <input
                    type={"number"}
                    name={"chunkY"}
                    className={"btn btn-sm"}
                    placeholder={"Chunk Y"}
                    onChange={(event) => setStartChunk(([x, y]) => [x, Number(event.target.value)])}
                />
                <input
                    type={"number"}
                    name={"posX"}
                    className={"btn btn-sm"}
                    placeholder={"Pos X"}
                    onChange={(event) =>
                        setStartPosition(([x, y]) => [Number(event.target.value), y])
                    }
                />
                <input
                    type={"number"}
                    name={"posY"}
                    className={"btn btn-sm"}
                    placeholder={"Pos Y"}
                    onChange={(event) =>
                        setStartPosition(([x, y]) => [x, Number(event.target.value)])
                    }
                />
            </div>
            <label className={"FileInput btn btn-sm"}>
                Template Image:
                <input
                    type={"file"}
                    accept={"image/png, image/jpeg"}
                    onChange={async (e) => {
                        setImage(e.target.files![0]);
                    }}
                />
            </label>
            <button
                className={"btn btn-primary"}
                onClick={async () => {
                    const colors = await getColorsFromImage(image!);
                    const base64 = await imageToBase64(image!);
                    setOverlay([
                        ...overlay,
                        {
                            chunk: startChunk,
                            coordinate: startPosition,
                            image: base64,
                            colorSelection: [],
                            onlyShowSelectedColors: false,
                            name,
                            templateColors: colors,
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
