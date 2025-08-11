import React, { useState } from "react";
import "./App.css";
import { Button } from "./components/Button/Button";
import { RouteProvider } from "./components/Router/RouteContext";
import { Outlet } from "./components/Router/Outlet";
import { Overview } from "./pages/Overview";
import { Create } from "./pages/Create";
import { Import } from "./pages/Import";

const routes = new Map([
    ["/", <Overview />],
    ["/create", <Create />],
    ["/import", <Import />],
]);

function App() {
    const [showOverlay, setShowOverlay] = useState(false);

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
