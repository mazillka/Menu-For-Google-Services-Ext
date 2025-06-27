import "./scss/popup.scss";
import { createElement, storage, constants } from "./helpers";
import { GoogleService } from "./types";

document.addEventListener("DOMContentLoaded", async () => {
	const style = (await storage.get(constants.Storage.MenuStyles)).find((style: { enabled: boolean; }) => style.enabled).style;
	const ul = document.querySelector("#list") as HTMLElement;

	await storage.get(constants.Storage.Services).then((services: GoogleService[]) => {
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

if (process.env.NODE_ENV !== "development") {
	document.addEventListener("contextmenu", event => event.preventDefault());
}
