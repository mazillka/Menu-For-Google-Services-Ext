export function createElement<K extends keyof HTMLElementTagNameMap>(
	element: K,
	attribute: { [key: string]: any },
	inner?: string | Node | (string | Node)[]
): HTMLElementTagNameMap[K] | false {
	if (typeof element === "undefined") {
		return false;
	}

	if (typeof inner === "undefined") {
		inner = "";
	}

	const el = document.createElement(element);
	if (typeof attribute === "object") {
		for (let key in attribute) {
			let value = attribute[key];
			if (typeof value === "function") {
				(el as any).onclick = value;
			} else {
				el.setAttribute(key, value);
			}
		}
	}

	if (!Array.isArray(inner)) {
		inner = [inner];
	}

	for (let i = 0; i < inner.length; i++) {
		const item = inner[i];
		if (item instanceof Node) {
			el.appendChild(item);
		} else if (typeof item === "string") {
			if (item.startsWith("&") && item.endsWith(";")) {
				el.innerHTML = item;
			} else {
				el.appendChild(document.createTextNode(item));
			}
		}
	}

	return el;
}
