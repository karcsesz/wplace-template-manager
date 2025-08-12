import React, { FC, PropsWithChildren } from "react";
import "./Overlay.css";
import { useNavigate } from "../Router/navigate";

export const Overlay: FC<PropsWithChildren<{ showBack?: boolean; headline?: string }>> = ({
    children,
    headline,
    showBack,
}) => {
    const navigate = useNavigate();

    return (
        <div className="Overlay shadow-xl">
            {(showBack || headline) && (
                <nav>
                    {showBack && <button onClick={() => navigate("/")}> {"<"} </button>}
                    {headline && <h1>{headline}</h1>}
                </nav>
            )}
            {children}
        </div>
    );
};
