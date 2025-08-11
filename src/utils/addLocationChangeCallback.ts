export function addLocationChangeCallback(callback: () => void) {
    // Run the callback once right at the start
    window.setTimeout(callback, 0);

    // Set up a `MutationObserver` to watch for changes in the URL
    let oldHref = window.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(() => oldHref !== document.location.href)) {
            oldHref = document.location.href;
            callback();
        }
    });

    observer.observe(body!, { childList: true, subtree: true });
    return observer;
}