import React, { createRef, FC, useEffect, useRef, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useNavigate } from "../components/Router/navigate";
import text from "png-chunk-text";
import extract from "png-chunks-extract";
import { Buffer } from "buffer";
import { getColorsFromImage } from "../utils/getColorsFromImage";
import { imageToBase64 } from "../utils/imageToBase64";
import { useAtom } from "jotai/index";
import { overlayAtom } from "../atoms/overlay";
import { Color } from "../colorMap";

export const Import: FC = () => {
    const navigate = useNavigate();
    const fileInput = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [overlays, setOverlays] = useAtom(overlayAtom);
    const [error, setError] = useState<string | null>(null);
    const [image, setImage] = useState<string>();
    const [imageColors, setImageColors] = useState<Color[]>();
    const [template, setTemplate] = useState<{
        name: string;
        chunk: [number, number];
        position: [number, number];
    }>();
    const [height, setHeight] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);

    const pasteHandler = (event: any) => {
        if (!fileInput.current) return;
        fileInput.current.files = event.clipboardData?.files ?? new FileList();
        fileInput.current.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    };

    useEffect(() => {
        window.addEventListener("paste", pasteHandler);
        return () => window.removeEventListener("paste", pasteHandler);
    }, []);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current!.src = "data:image/bmp;base64," + image;
        }
    }, [image]);

    return (
        <Overlay headline={"Import Overlay"} showBack>
            <label className={"FileInput input w-full"}>
                <span className={"label"}>Template Image</span>
                <input
                    name={"template"}
                    placeholder={"Template"}
                    accept={"image/png"}
                    type={"file"}
                    ref={fileInput}
                    onChange={async (event) => {
                        if (!fileInput.current?.files?.length) return;

                        const imageBuffer = Buffer.from(
                            await fileInput.current.files[0].arrayBuffer(),
                        );
                        const chunks = extract(imageBuffer);

                        const textChunks = chunks
                            .filter(function (chunk) {
                                return chunk.name === "tEXt";
                            })
                            .map(function (chunk) {
                                return text.decode(chunk.data);
                            });

                        const dataChunk = textChunks.find(({ keyword }) => keyword === "wplace");

                        if (!dataChunk) {
                            setError("No wplace chunk found! Please create Overlay manually.");
                            return;
                        }

                        setError(null);
                        const importedData = dataChunk.text.split(",");
                        setTemplate({
                            name: importedData[0],
                            chunk: [Number(importedData[1]), Number(importedData[2])],
                            position: [Number(importedData[3]), Number(importedData[4])],
                        });
                        const bitmap = await createImageBitmap(fileInput.current.files[0]);
                        setHeight(bitmap.height);
                        setWidth(bitmap.width);
                        setImage(await imageToBase64(fileInput.current.files[0]));
                        setImageColors(await getColorsFromImage(bitmap));
                    }}
                />
            </label>

            {error && <div className={"error btn btn-md btn-error"}>{error}</div>}

            {image && <img ref={imgRef} alt={"imported image"} id={"imagePreview"} />}

            {template && (
                <div className={"groupRow"}>
                    <span className={"btn btn-sm"}> {template.chunk[0]} </span>
                    <span className={"btn btn-sm"}> {template.chunk[1]} </span>
                    <span className={"btn btn-sm"}> {template.position[0]} </span>
                    <span className={"btn btn-sm"}> {template.position[1]} </span>
                </div>
            )}

            <button
                className={"btn btn-primary"}
                disabled={!template || !image || !imageColors?.length}
                onClick={async () => {
                    if (!template || !image || !imageColors?.length) {
                        setError("No overlay selected!");
                        return;
                    }

                    setError(null);

                    setOverlays([
                        ...overlays,
                        {
                            chunk: template.chunk,
                            coordinate: template.position,
                            image,
                            colorSelection: [],
                            onlyShowSelectedColors: false,
                            name: template.name,
                            templateColors: imageColors,
                            height,
                            width,
                        },
                    ]);
                    navigate("/");
                }}
            >
                Import
            </button>
        </Overlay>
    );
};
