import React, { FC, useEffect, useRef, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useNavigate } from "../components/Router/navigate";
import { useAtom } from "jotai";
import { overlayAtom } from "../atoms/overlay";
import { imageToBase64 } from "../utils/imageToBase64";
import { getColorsFromImage } from "../utils/getColorsFromImage";
import { positionAtom } from "../atoms/position";
import { Color, ColorValue, FreeColor, FreeColorMap, PaidColor, PaidColorMap } from "../colorMap";
import { optimizeColors } from "../utils/optimizeColors";
import { ColorPicker } from "../components/ColorPicker/ColorPicker";
import { Location } from "../components/Icons/Location";

export const Create: FC = () => {
    // Inputs
    const [name, setName] = useState<string>("");
    const [optimizeImage, setOptimizeImage] = useState<boolean>(false);
    const [startChunk, setStartChunk] = useState<number[]>([]);
    const [startPosition, setStartPosition] = useState<number[]>([]);
    const [selectedColors, setSelectedColors] = useState<Color[]>([]);
    const [scale, setScale] = useState<number>(1);

    // Image Generation
    const [uploadBlob, setUploadBlob] = useState<File>();
    const [image, setImage] = useState<string>();
    const [imageColors, setImageColors] = useState<Color[]>();
    const [height, setHeight] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);

    const [overlay, setOverlay] = useAtom(overlayAtom);
    const [position] = useAtom(positionAtom);

    const fileInput = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current!.src = "data:image/bmp;base64," + image;
        }
    }, [image]);

    useEffect(() => {
        void generateImage();
    }, [uploadBlob, selectedColors, optimizeImage, scale]);

    const pasteHandler = (event: any) => {
        if (!fileInput.current) return;
        fileInput.current.files = event.clipboardData?.files ?? new FileList();
        fileInput.current.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    };

    useEffect(() => {
        window.addEventListener("paste", pasteHandler);
        return () => window.removeEventListener("paste", pasteHandler);
    }, []);

    const generateImage = async () => {
        if (!uploadBlob) return;

        const bitmap = await createImageBitmap(uploadBlob);
        setHeight(bitmap.height);
        setWidth(bitmap.width);

        if (!optimizeImage || !selectedColors?.length) {
            imageToBase64(uploadBlob).then(setImage);
            getColorsFromImage(bitmap).then(setImageColors);
        } else {
            optimizeColors(
                bitmap,
                selectedColors.map((inputColor) => {
                    let color: FreeColor | PaidColor | undefined = FreeColorMap.get(
                        inputColor as keyof typeof FreeColor,
                    );

                    if (!color) {
                        color = PaidColorMap.get(inputColor as keyof typeof PaidColor);
                    }

                    if (!color) {
                        throw new Error(`Unknown color "${color}"`);
                    }

                    return color as ColorValue;
                }),
                scale,
            ).then(async (convertedImage) => {
                imageToBase64(convertedImage).then(setImage);
                getColorsFromImage(await createImageBitmap(convertedImage)).then(setImageColors);
            });
        }
    };

    const navigate = useNavigate();
    return (
        <Overlay headline={"Create new Overlay"} showBack>
            <label className={"input w-full"}>
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
            <label className={"FileInput input w-full"}>
                <span className={"label"}>Template Image</span>
                <input
                    type={"file"}
                    ref={fileInput}
                    accept={"image/png, image/jpeg"}
                    onChange={async (e) => {
                        setUploadBlob(e.target.files![0]);
                    }}
                />
            </label>
            {image && (
                <details>
                    <summary>
                        <div className={"row"} style={{ justifyContent: "center", gap: "2rem" }}>
                            <img ref={imgRef} alt={"imported image"} id={"imagePreview"} />
                            <div className={"column"}>
                                <span>
                                    <b>Height:</b> {Math.floor(height * scale)}px
                                </span>
                                <span>
                                    <b>Width:</b> {Math.floor(width * scale)}px
                                </span>
                                <span>
                                    <b>Scale:</b> {scale}x
                                </span>
                            </div>
                        </div>
                    </summary>
                    <label>
                        <input
                            type={"checkbox"}
                            style={{ marginRight: "10px" }}
                            checked={optimizeImage}
                            onChange={(event) => setOptimizeImage(event.target.checked)}
                        />
                        Optimize Image
                    </label>
                    <input
                        type={"range"}
                        min={0.1}
                        max={10}
                        step={0.1}
                        name={"scale"}
                        placeholder={"Scale"}
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        style={{ width: "100%" }}
                    />
                    <div className={"column"} style={{ alignItems: "flex-start" }}>
                        <ColorPicker
                            setSelectedColorState={setSelectedColors}
                            selectedColorState={selectedColors}
                        />
                    </div>
                </details>
            )}
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
