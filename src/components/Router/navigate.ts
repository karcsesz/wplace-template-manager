import { useContext } from "react";
import { RouteContext } from "./RouteContext";

export const useNavigate = () => {
    const { setRoute } = useContext(RouteContext);

    return (route: string) => {
        setRoute(route);
    };
};
