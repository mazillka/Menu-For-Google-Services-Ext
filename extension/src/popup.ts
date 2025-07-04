import "./scss/popup.scss";
import { createElement, storage, constants, handleContextMenu } from "./helpers";
import { GoogleService } from "./types";

document.addEventListener("DOMContentLoaded", async () => {
	const style = (await storage.get(constants.Storage.MenuStyles)).find((style: { enabled: boolean; }) => style.enabled).style;
	const ul = document.querySelector("#list") as HTMLElement;

	await storage.get(constants.Storage.Services).then((services: GoogleService[]) => {
		services
			.filter(service => service.enabled)
			.forEach(service => {
				const li: any = createElement("li", {
					rel: "noopener",
					style: `background-image: url(${service.icon});`,
					class: `${style}-style`,
					onclick: () => chrome.tabs.create({ url: service.url }),
				}, style === "grid" ? "&zwnj;" : service.name);

				ul.appendChild(li);
			});
	});

	await handleContextMenu();
});
