import React, { createContext, FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";

type RouteParams = Record<string, string>;

export const RouteContext = createContext<{
    route: ReactNode | null;
    params: RouteParams;
    setRoute: (route: string) => void;
    routeNodes: Map<string, ReactNode>;
}>({
    route: null,
    params: {},
    setRoute: (route: string) => {},
    routeNodes: new Map<string, React.ReactNode>(),
});

export const RouteProvider: FC<PropsWithChildren<{ routes: Map<string, ReactNode> }>> = ({
    children,
    routes,
}) => {
    const [route, setRoute] = useState<ReactNode>(null);
    const [params, setParams] = useState<RouteParams>({});

    const matchRoute = (path: string): [string, RouteParams] | null => {
        const pathSegments = path.split("/").filter(Boolean);

        for (const [routePath, _] of routes) {
            const routeSegments = routePath.split("/").filter(Boolean);

            if (pathSegments.length !== routeSegments.length) {
                continue;
            }

            const extractedParams: RouteParams = {};
            let isMatch = true;

            for (let i = 0; i < routeSegments.length; i++) {
                const routeSegment = routeSegments[i];
                const pathSegment = pathSegments[i];

                if (routeSegment.startsWith("{") && routeSegment.endsWith("}")) {
                    const paramName = routeSegment.slice(1, -1);
                    extractedParams[paramName] = pathSegment;
                } else if (routeSegment !== pathSegment) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return [routePath, extractedParams];
            }
        }

        return null;
    };

    useEffect(() => {
        setRoute(routes.get("/"));
    }, [routes]);

    const setRouteAction = (route: string) => {
        if (route === "/") {
            setRoute(routes.get("/"));
            setParams({});
            return;
        }

        const match = matchRoute(route);
        if (match) {
            const [routePath, extractedParams] = match;
            setRoute(routes.get(routePath));
            setParams(extractedParams);
        } else {
            // Handle 404 or default case
            setRoute(null);
            setParams({});
        }
    };

    return (
        <RouteContext.Provider
            value={{ route, setRoute: setRouteAction, params, routeNodes: routes }}
        >
            {children}
        </RouteContext.Provider>
    );
};
