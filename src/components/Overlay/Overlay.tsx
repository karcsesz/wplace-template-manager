import React, { FC, PropsWithChildren, ReactNode } from "react";
import "./Overlay.css";
import { useNavigate } from "../Router/navigate";
// @ts-ignore
import Chevron from "./chevron.svg";

export const Overlay: FC<
    PropsWithChildren<{ showBack?: boolean; headline?: string; customRenderer?: ReactNode }>
> = ({ children, headline, showBack, customRenderer }) => {
    const navigate = useNavigate();

    return (
        <div className="Overlay shadow-xl">
            {(showBack || headline) && (
                <nav>
                    <div>
                        {showBack && (
                            <button onClick={() => navigate("/")}>
                                <img src={Chevron} alt={"back"} />
                            </button>
                        )}
                        {headline && <h1>{headline}</h1>}
                    </div>
                    {customRenderer}
                </nav>
            )}
            {children}
        </div>
    );
};
