import {log} from "./log";

export async function awaitElement(selector: string): Promise<Element> {
    const MAX_TRIES = 60;
    let tries = 0;
    return new Promise((resolve, reject) => {
        function probe() {
            tries++;
            return document.querySelector(selector);
        }

        function delayedProbe() {
            if (tries >= MAX_TRIES) {
                log("Can't find element with selector", selector);
                reject();
                return;
            }
            const elm = probe();
            if (elm) {
                resolve(elm);
                return;
            }

            window.setTimeout(delayedProbe, 250);
        }

        delayedProbe();
    });
}