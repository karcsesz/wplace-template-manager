import React, { FC } from "react";
import "./Button.css";

export const Button: FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <div className={"ShowOverlayButton btn btn-sm btn-circle"} onClick={onClick}>
            O
        </div>
    );
};
