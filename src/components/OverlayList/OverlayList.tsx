import React, { FC } from "react";
import "./OverlayList.css";
import { OverlayListEntry } from "./OverlayListEntry";
import { useNavigate } from "../Router/navigate";
import { useAtomValue } from "jotai";
import { overlayAtom } from "../../atoms/overlay";

export const OverlayList: FC = () => {
    const navigate = useNavigate();
    const overlays = useAtomValue(overlayAtom);

    const overlaysList = overlays.map(({ image, name, chunk, coordinate }) => {
        return (
            <OverlayListEntry
                name={name}
                image={image}
                key={name}
                chunk={chunk}
                position={coordinate}
            />
        );
    });

    return (
        <div className={"OverlayList"}>
            {overlaysList}
            <button
                className={"btn btn-primary"}
                onClick={() => {
                    navigate("/create");
                }}
            >
                Create new Overlay
            </button>
            <button
                className={"btn btn-primary"}
                onClick={() => {
                    navigate("/import");
                }}
            >
                Import Overlay
            </button>
        </div>
    );
};
