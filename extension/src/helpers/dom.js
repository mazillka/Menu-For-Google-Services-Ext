export const createElement = (element, attribute, inner) => {
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
				el.onclick = value;
			} else {
				el.setAttribute(key, value);
			}
		}
	}

	if (!Array.isArray(inner)) {
		inner = [inner];
	}

	for (let i = 0; i < inner.length; i++) {
		if (inner[i].tagName) {
			el.appendChild(inner[i]);
		} else {
			if (inner[i].startsWith("&") && inner[i].endsWith(";")) {
				// html entity
				el.innerHTML = inner[i];
			} else {
				el.appendChild(document.createTextNode(inner[i]));
			}
		}
	}

	return el;
};
