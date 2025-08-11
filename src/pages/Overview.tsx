import React, { FC } from "react";
import { OverlayList } from "../components/OverlayList/OverlayList";

export const Overview: FC = () => {
    return (
        <div className="Overlay shadow-xl">
            <h1>Overlay Manager</h1>
            <OverlayList />
        </div>
    );
};
