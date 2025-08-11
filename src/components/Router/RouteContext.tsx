import React, { createContext, FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";

export const RouteContext = createContext<{
    route: ReactNode | null;
    setRoute: (route: string) => void;
    routeNodes: Map<string, ReactNode>;
}>({
    route: null,
    setRoute: (route: string) => {},
    routeNodes: new Map<string, React.ReactNode>(),
});

export const RouteProvider: FC<PropsWithChildren<{ routes: Map<string, ReactNode> }>> = ({
    children,
    routes,
}) => {
    const [route, setRoute] = useState<ReactNode>(null);

    useEffect(() => {
        setRoute(routes.get("/"));
    }, [routes]);

    const setRouteAction = (route: string) => {
        const routeNode = routes.get(route);
        setRoute(routeNode);
    };

    return (
        <RouteContext.Provider value={{ route, setRoute: setRouteAction, routeNodes: routes }}>
            {children}
        </RouteContext.Provider>
    );
};
