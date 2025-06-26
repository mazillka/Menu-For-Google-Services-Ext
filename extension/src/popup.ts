import "./scss/popup.scss";
import { createElement, storage } from "./helpers";
import { Service } from "./types";

document.addEventListener("DOMContentLoaded", async () => {
	const style = (await storage.get(storage.StorageKeys.menuStyles)).find((style: { enabled: boolean; }) => style.enabled).style;
	const ul = document.querySelector("#list") as HTMLElement;

	await storage.get(storage.StorageKeys.services).then((services: Service[]) => {
		services
			.filter(service => service.enabled)
			.forEach(service => {
				const attributes = {
					rel: "noopener",
					style: `background-image: url(${service.icon});`,
					class: `${style}-style`,
					onclick: () => chrome.tabs.create({ url: service.url }),
				};

				const li: any = createElement("li", attributes, style === "grid" ? "&zwnj;" : service.name);

				ul.appendChild(li);
			});
	});
});

document.addEventListener("contextmenu", event => event.preventDefault());
