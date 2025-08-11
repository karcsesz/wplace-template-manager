import React, { FC, useEffect, useRef, useState } from "react";
export const OverlayListEntry: FC<{
    image: string;
    name: string;
    chunk: [number, number];
    position: [number, number];
}> = ({ name, image, chunk, position }) => {
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;
        imgRef.current!.src = "data:image/bmp;base64," + image;
    }, [image]);

    return (
        <div className={"OverlayListEntry"}>
            <img ref={imgRef} alt={"logo"} />
            <span> {name} </span>
            <span
                onClick={() =>
                    navigator.clipboard.writeText(
                        `${image}|${chunk[0]}},${chunk[1]}|${position[0]},${position[1]}`,
                    )
                }
            >
                ⚙️
            </span>
        </div>
    );
};
