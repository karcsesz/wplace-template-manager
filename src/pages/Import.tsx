import React, { FC, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useNavigate } from "../components/Router/navigate";

export const Import: FC = () => {
    const navigate = useNavigate();
    const [template, setTemplate] = useState<string>("");

    return (
        <Overlay headline={"Import Overlay"} showBack>
            <input
                name={"template"}
                placeholder={"Template"}
                onChange={(event) => setTemplate(event.target.value)}
            />
        </Overlay>
    );
};
