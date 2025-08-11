import {log} from "./log";

export function logFetch(arg: string | URL) {
    const url = new URL(arg, window.location.toString());
    log("fetching", "" + url);

    return fetch("" + url, { credentials: "include" });
}