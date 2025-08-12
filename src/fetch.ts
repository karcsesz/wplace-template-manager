import { inject } from "./utils/inject";

export type BlobEventData = {
    blob: Blob;
    source: string;
    requestId: string;
};

inject(() => {
    const BlobQueue = new Map<string, (blob: Blob) => void>();

    const matchPattern = (pattern: string, path: string): boolean => {
        const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(path);
    };

    window.addEventListener("message", (event: MessageEvent<BlobEventData>) => {
        const { source, blob, requestId } = event.data;

        if (source === "overlay-renderer") {
            console.log("received result", requestId);
            const callback = BlobQueue.get(requestId)!;

            callback(blob);
        }
    });
    /*
     * -------------
     * Fetch Creator
     * -------------
     */

    function createFetch(originalFetch: typeof fetch) {
        return async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
            const response = originalFetch(input, init);
            let route: string;

            if ((input as Request).url.length) {
                route = (input as Request).url;
            } else {
                route = input.toString();
            }

            if (!matchPattern("https://backend.wplace.live/files/s0/tiles/*/*.png", route)) {
                return response;
            }

            /*
                Apply custom response to Tile Request
             */

            const originalResponse = await response;
            const currentRequestId = Math.random().toString(36);

            console.log("currentRequestId", currentRequestId);

            window.postMessage({
                requestId: currentRequestId,
                source: "wplace-tile-request",
                blob: await originalResponse.blob(),
            } as BlobEventData);

            return new Promise((resolve) => {
                BlobQueue.set(currentRequestId, (blob) => {
                    resolve(
                        new Response(blob, {
                            headers: originalResponse.headers,
                            status: originalResponse.status,
                            statusText: originalResponse.statusText,
                        }),
                    );
                });
            });
        };
    }

    /*
     * ---------------------
     * Override window.fetch
     * ---------------------
     */

    const originalFetch = window.fetch;
    window.fetch = createFetch(originalFetch);
});
