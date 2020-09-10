// TODO: this is an experimental feature.
// If this works well, we have to document it.

window.addEventListener('click', (e) => {
    window.dataLayer = window.dataLayer || [];

    let node = e.target;

    do {
        const rawValue = node.getAttribute('data-click-datalayer-push');
        if (rawValue) {
            try {
                // TODO: Check if we can use something like `eval` but more secure to allow JS style objects
                // aka. objects without quotes around key names or some computation inside
                // e.g. { event: "event_trigger", event_category: "category", event_action: "action" }
                // Don't use `eval` or `new Function(...)` directly because they execute anything => XSS attack

                const value = JSON.parse(rawValue);
                window.dataLayer.push(value);
            } catch (e) {
                console.error('Cannot parse tracking value', rawValue, node);
            }
        }
        node = node.parentNode;
    } while (node && node.getAttribute);
});
