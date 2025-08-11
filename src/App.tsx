import React from "react";
import "./App.css";
import { Button } from "./components/Button/Button";
import { RouteProvider } from "./components/Router/RouteContext";
import { Outlet } from "./components/Router/Outlet";
import { Overview } from "./pages/Overview";

const routes = new Map([["/", <Overview />]]);

function App() {
    const [showOverlay, setShowOverlay] = React.useState(false);
    return (
        <div className="App">
            <Button onClick={() => setShowOverlay(!showOverlay)} />
            {showOverlay && (
                <RouteProvider routes={routes}>
                    <Outlet />
                </RouteProvider>
            )}
        </div>
    );
}

export default App;
