import React, { FC } from "react";
import { OverlayList } from "../components/OverlayList/OverlayList";
import { Overlay } from "../components/Overlay/Overlay";

export const Overview: FC = () => {
    return (
        <Overlay headline={"Overlay Manager"}>
            <OverlayList />
        </Overlay>
    );
};
