const createElement = <T extends HTMLElement>(
    tagName: keyof HTMLElementTagNameMap,
    attribute: { [key: string]: any } = {},
    inner?: string | Node | (string | Node)[]
): T => {
    const element = document.createElement(tagName) as T;

    // Set attributes and event listeners
    for (const key in attribute) {
        const value = attribute[key];
        if (typeof value === "function" && key.startsWith("on")) {
            (element as any)[key] = value;
        } else if (value !== undefined && value !== null) {
            element.setAttribute(key, value);
        }
    }

    // Normalize inner content to array
    const content = inner === undefined ? [] : Array.isArray(inner) ? inner : [inner];

    for (const item of content) {
        if (item instanceof Node) {
            element.appendChild(item);
        } else if (typeof item === "string") {
            // Only set innerHTML for single HTML entity, otherwise use text node
            if (/^&[a-zA-Z0-9#]+;$/.test(item)) {
                element.innerHTML = item;
            } else {
                element.appendChild(document.createTextNode(item));
            }
        }
    }

    return element;
}

const getElement = <T extends HTMLElement = HTMLElement>(selector: string): T => {
  return document.querySelector<T>(selector) as T;
}

const getElements = <T extends HTMLElement = HTMLElement>(selector: string): NodeListOf<T> => {
  return document.querySelectorAll<T>(selector);
}

export {
    createElement,
    getElement,
    getElements
};
