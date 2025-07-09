import "./scss/popup.scss";
import { createElement, storageService, handleContextMenu } from "./helpers";

document.addEventListener("DOMContentLoaded", async () => {
	const enabledMenuStyle = await storageService.getEnabledMenuStyle();
	const className = `${enabledMenuStyle?.style.toLowerCase()}-style`;
	const isGrid = enabledMenuStyle?.style.toLowerCase().includes("grid");

	const ul = document.querySelector("#list") as HTMLElement;

	const fragment = document.createDocumentFragment();

	(await storageService.getServices())
		.filter(service => service.enabled)
		.forEach(service => {
			const li = createElement(
				"li",
				{
					rel: "noopener",
					style: `background-image: url(${service.icon});`,
					class: className,
					onclick: () => chrome.tabs.create({ url: service.url }),
				},
				isGrid ? "&zwnj;" : service.name
			) as HTMLLIElement;

			fragment.appendChild(li);
		});

	ul.appendChild(fragment);

	await handleContextMenu();
});
