import React, { FC, useContext } from "react";
import { RouteContext } from "./RouteContext";

export const Outlet: FC = () => {
    const { route } = useContext(RouteContext);

    return <>{route}</>;
};
