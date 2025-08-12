import React from "react";
import { createRoot } from "react-dom/client";
import { addLocationChangeCallback } from "./utils/addLocationChangeCallback";
import { log } from "./utils/log";
import { awaitElement } from "./utils/awaitElement";
import App from "./App";
import "./fetch";
import { BlobEventData } from "./fetch";
import { renderSquares } from "./utils/renderSquares";
log("wplace.live Overlay Manager successfully loaded.");

async function main() {
    const body = await awaitElement("body > div");

    const container = document.createElement("div");
    body.appendChild(container);

    window.addEventListener("message", async (event: MessageEvent<BlobEventData>) => {
        const { source, blob, requestId } = event.data;

        if (source === "wplace-tile-request") {
            console.log("Rendering requestId", requestId);
            window.postMessage({
                requestId,
                source: "overlay-renderer",
                blob: await renderSquares(blob, 0, 0, 1, 1, []),
            } as BlobEventData);
        }
    });

    const root = createRoot(container);
    root.render(<App />);
}

addLocationChangeCallback(() => {
    main().catch((e) => {
        log(e);
    });
});
