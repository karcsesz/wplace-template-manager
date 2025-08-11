import React, { FC, PropsWithChildren } from "react";
import "./Overlay.css";

export const Overlay: FC<PropsWithChildren> = ({ children }) => {
    return <div className="Overlay shadow-xl">{children}</div>;
};
