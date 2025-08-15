import { inject } from "./utils/inject";

export type BlobEventData = {
    blob: Blob;
    source: string;
    requestId: string;
    chunk: [number, number];
};

export type JumpEventData = {
    source: string;
    position: [number, number];
    chunk: [number, number];
};

export type PositionEventData = {
    source: string;
    chunk: [number, number];
    position: [number, number];
};

inject(() => {
    const BlobQueue = new Map<string, (blob: Blob) => void>();
    let jumpToPosition: [number, number] | null = null;
    let jumpToChunk: [number, number] | null = null;

    const matchPattern = (pattern: string, path: string): boolean => {
        const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(path);
    };

    window.addEventListener("message", (event: MessageEvent) => {
        const { source, blob, requestId, position, chunk } = event.data;

        if (source === "overlay-renderer") {
            const callback = BlobQueue.get(requestId)!;

            callback(blob);
        }

        if (source === "overlay-location-service") {
            jumpToPosition = position;
            jumpToChunk = chunk;
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

            if ((input as Request).url?.length) {
                route = (input as Request).url;
            } else {
                route = input.toString();
            }

            const originalResponse = await response;

            if (matchPattern("https://backend.wplace.live/s0/tile/random", route)) {
                if (jumpToPosition && jumpToChunk) {
                    const response = new Response(
                        JSON.stringify({
                            pixel: { x: jumpToPosition[0], y: jumpToPosition[1] },
                            tile: { x: jumpToChunk[0], y: jumpToChunk[1] },
                        }),
                        {
                            headers: originalResponse.headers,
                            status: originalResponse.status,
                            statusText: originalResponse.statusText,
                        },
                    );

                    jumpToChunk = null;
                    jumpToPosition = null;

                    return response;
                }
            }

            if (route.startsWith("https://backend.wplace.live/s0/pixel/")) {
                const segments = route.split("/");
                const rawData = segments.pop();

                const chunkX = segments.pop();
                const chunkY = rawData?.match(/^(\d+)\?/);
                const positionX = rawData?.match(/x=(\d+)/);
                const positionY = rawData?.match(/y=(\d+)/);

                if (!chunkX || !chunkY || !positionX || !positionY) {
                    console.warn("Couldn't read chunk and position from request!");
                } else {
                    window.postMessage({
                        source: "wplace-position-request",
                        position: [parseInt(positionX[1], 10), parseInt(positionY[1], 10)],
                        chunk: [Number(chunkX), parseInt(chunkY[1], 10)],
                    } as PositionEventData);
                }
            }

            if (!matchPattern("https://backend.wplace.live/files/s0/tiles/*/*.png", route)) {
                return response;
            }

            /*
                Apply custom response to Tile Request
             */

            const currentRequestId = Math.random().toString(36);

            const urlParts = route.split("/");

            let chunkY = urlParts.pop()!;
            chunkY = chunkY.substring(0, chunkY.length - 4);
            const chunkX = urlParts.pop()!;

            window.postMessage({
                requestId: currentRequestId,
                source: "wplace-tile-request",
                blob: await originalResponse.blob(),
                chunk: [Number(chunkX), Number(chunkY)],
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
