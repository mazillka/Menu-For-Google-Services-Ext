export function createElement<K extends keyof HTMLElementTagNameMap>(
    element: K,
    attribute: { [key: string]: any } = {},
    inner?: string | Node | (string | Node)[]
): HTMLElementTagNameMap[K] | false {
    if (!element) return false;

    const el = document.createElement(element);

    // Set attributes and event listeners
    for (const key in attribute) {
        const value = attribute[key];
        if (typeof value === "function" && key.startsWith("on")) {
            (el as any)[key] = value;
        } else if (value !== undefined && value !== null) {
            el.setAttribute(key, value);
        }
    }

    // Normalize inner content to array
    const content = inner === undefined ? [] : Array.isArray(inner) ? inner : [inner];

    for (const item of content) {
        if (item instanceof Node) {
            el.appendChild(item);
        } else if (typeof item === "string") {
            // Only set innerHTML for single HTML entity, otherwise use text node
            if (/^&[a-zA-Z0-9#]+;$/.test(item)) {
                el.innerHTML = item;
            } else {
                el.appendChild(document.createTextNode(item));
            }
        }
    }

    return el;
}
