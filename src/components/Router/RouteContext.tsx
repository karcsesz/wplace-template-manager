import React, { createContext, FC, PropsWithChildren, ReactNode, useState } from "react";

export const RouteContext = createContext<{
    route: ReactNode | null;
    setRoute: React.Dispatch<React.SetStateAction<ReactNode>>;
    routeNodes: Map<string, ReactNode>;
}>({ route: null, setRoute: () => {}, routeNodes: new Map<string, React.ReactNode>() });

export const RouteProvider: FC<PropsWithChildren<{ routes: Map<string, ReactNode> }>> = ({
    children,
    routes,
}) => {
    const [route, setRoute] = useState<ReactNode>(null);

    return (
        <RouteContext.Provider value={{ route, setRoute, routeNodes: routes }}>
            {children}
        </RouteContext.Provider>
    );
};
