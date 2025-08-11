import React, { FC } from "react";
import { OverlayList } from "../components/OverlayList/OverlayList";
import { Overlay } from "../components/Overlay/Overlay";

export const Overview: FC = () => {
    return (
        <Overlay>
            <h1>Overlay Manager</h1>
            <OverlayList />
        </Overlay>
    );
};
