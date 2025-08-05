import "./scss/popup.scss";
import { createElement, storageService, handleContextMenu, onContentLoaded, getElement } from "./helpers";

await onContentLoaded(async () => {
	const enabledMenuStyle = await storageService.getEnabledMenuStyle();
	const className = `${enabledMenuStyle?.style.toLowerCase()}-style`;
	const isGrid = enabledMenuStyle?.style.toLowerCase().includes("grid");

	const ul = getElement<HTMLElement>("#list");
	if (!ul) {
		return;
	}

	const fragment = document.createDocumentFragment();

	(await storageService.getServices())
		.filter(service => service.enabled)
		.forEach(service => {
			const li = createElement<HTMLLIElement>(
				"li",
				{
					rel: "noopener",
					style: `background-image: url(${service.icon});`,
					class: className,
					onclick: () => chrome.tabs.create({ url: service.url }),
				},
				isGrid ? "&zwnj;" : service.name
			);

			fragment.appendChild(li);
		});

	ul.appendChild(fragment);

	await handleContextMenu();
});
