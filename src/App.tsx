import React, { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/Button/Button";
import { RouteProvider } from "./components/Router/RouteContext";
import { Outlet } from "./components/Router/Outlet";
import { Overview } from "./pages/Overview";
import { Create } from "./pages/Create";
import { Import } from "./pages/Import";
import { Edit } from "./pages/Edit";
import { BlobEventData } from "./fetch";
import { renderSquares } from "./utils/renderSquares";
import { useAtomValue } from "jotai/index";
import { overlayAtom } from "./atoms/overlay";

const routes = new Map([
    ["/", <Overview />],
    ["/create", <Create />],
    ["/import", <Import />],
    ["/edit/{name}", <Edit />],
]);

function App() {
    const [showOverlay, setShowOverlay] = useState(false);
    const overlays = useAtomValue(overlayAtom);

    const handleMessage = async (event: MessageEvent<BlobEventData>) => {
        const { source, blob, requestId, chunk } = event.data;

        if (source === "wplace-tile-request") {
            window.postMessage({
                requestId,
                source: "overlay-renderer",
                blob: await renderSquares(blob, overlays, chunk[0], chunk[1]),
                chunk,
            } as BlobEventData);
        }
    };

    useEffect(() => {
        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [overlays]);

    return (
        <RouteProvider routes={routes}>
            <div className="App">
                <Button onClick={() => setShowOverlay(!showOverlay)} />
                {showOverlay && <Outlet />}
            </div>
        </RouteProvider>
    );
}

export default App;
