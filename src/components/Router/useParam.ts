import { useContext } from "react";
import { RouteContext } from "./RouteContext";

export const useParam = (name: string): string | undefined => {
    const { params } = useContext(RouteContext);

    if (params[name]) {
        return params[name];
    }
};
