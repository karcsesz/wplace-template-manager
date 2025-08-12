import React, { createRef, FC, useState } from "react";
import { Overlay } from "../components/Overlay/Overlay";
import { useNavigate } from "../components/Router/navigate";
import { getMetadata } from "meta-png";

export const Import: FC = () => {
    const navigate = useNavigate();
    const fileInput = createRef<HTMLInputElement>();
    const [template, setTemplate] = useState<string>("");

    window.addEventListener("paste", (event) => {
        if (!fileInput.current) return;
        fileInput.current.files = event.clipboardData?.files ?? new FileList();
    });

    return (
        <Overlay headline={"Import Overlay"} showBack>
            <input
                name={"template"}
                placeholder={"Template"}
                type={"file"}
                onChange={async (event) =>
                    console.log(
                        getMetadata(
                            new Uint8Array(await event.target.files![0].arrayBuffer()),
                            "wplace-data",
                        ),
                    )
                }
            />

            <h1> Import is WIP and doesn't work </h1>
        </Overlay>
    );
};
