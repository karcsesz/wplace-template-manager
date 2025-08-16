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
        <div className="Overlay dropdown-content menu bg-base-100 rounded-box border-base-300 shadow-xl p-4 shadow-md">
            {(showBack || headline) && (
                <nav>
                    <div>
                        {showBack && (
                            <button onClick={() => navigate("/")}>
                                <img src={Chevron} alt={"back"} />
                            </button>
                        )}
                        {headline && <h3 className={"text-lg"}>{headline}</h3>}
                    </div>
                    {customRenderer}
                </nav>
            )}
            {children}
        </div>
    );
};
