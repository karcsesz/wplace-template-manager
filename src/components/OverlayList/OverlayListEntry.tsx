import React, { FC, useEffect, useRef } from "react";
import { useNavigate } from "../Router/navigate";
// @ts-ignore
import Cog from "./cog.svg";
// @ts-ignore
import Location from "./location.svg";
import { JumpEventData } from "../../fetch";
import { awaitElement } from "../../utils/awaitElement";
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
            <div className={"groupRow"} style={{ flexGrow: 1, justifyContent: "flex-end" }}>
                <span className={"btn btn-sm"}> {chunk[0]} </span>
                <span className={"btn btn-sm"}> {chunk[1]} </span>
                <span className={"btn btn-sm"}> {position[0]} </span>
                <span className={"btn btn-sm"}> {position[1]} </span>
            </div>
            <button onClick={() => navigate("/edit/" + name)}>
                <img src={Cog} alt={"options"} className={"icon"} />
            </button>
            <button
                onClick={() => {
                    window.postMessage({
                        source: "overlay-location-service",
                        chunk,
                        position,
                    } as JumpEventData);
                    awaitElement("button[title='Explore']").then((button) => {
                        button.dispatchEvent(
                            new Event("click", { bubbles: true, cancelable: true }),
                        );
                    });
                }}
            >
                <img src={Location} alt={"options"} className={"icon"} />
            </button>
        </div>
    );
};
