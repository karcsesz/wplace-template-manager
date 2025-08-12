import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "../Router/navigate";
export const OverlayListEntry: FC<{
    image: string;
    name: string;
    chunk: [number, number];
    position: [number, number];
}> = ({ name, image, chunk, position }) => {
    const navigate = useNavigate();
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;
        imgRef.current!.src = "data:image/bmp;base64," + image;
    }, [image]);

    return (
        <div className={"OverlayListEntry"}>
            <img ref={imgRef} alt={"logo"} />
            <span> {name} </span>
            <span onClick={() => navigate("/edit/" + name)}>⚙️</span>
        </div>
    );
};
