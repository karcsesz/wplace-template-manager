import React, { FC, useEffect, useRef } from "react";
import { useNavigate } from "../Router/navigate";
// @ts-ignore
import Cog from "./cog.svg";
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
            <div className={"groupRow"}>
                <img ref={imgRef} alt={"logo"} />
                <span> {name} </span>
            </div>
            <div className={"groupRow"}>
                <span className={"btn btn-sm"}> {chunk[0]} </span>
                <span className={"btn btn-sm"}> {chunk[1]} </span>
                <span className={"btn btn-sm"}> {position[0]} </span>
                <span className={"btn btn-sm"}> {position[1]} </span>
            </div>
            <span onClick={() => navigate("/edit/" + name)}>
                <img src={Cog} alt={"options"} className={"icon"} />
            </span>
        </div>
    );
};
