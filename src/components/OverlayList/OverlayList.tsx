import React, { FC } from "react";
import "./OverlayList.css";
import { OverlayListEntry } from "./OverlayListEntry";

export const OverlayList: FC = () => {
    return (
        <div className={"OverlayList"}>
            <OverlayListEntry />
            <OverlayListEntry />
            <OverlayListEntry />
            <button className={"btn btn-primary"}>Create new Overlay</button>
        </div>
    );
};
