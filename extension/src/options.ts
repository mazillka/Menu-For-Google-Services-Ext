import "./scss/options.scss";
import sortable from "sortablejs";
import { createElement, storageService, handleContextMenu } from "./helpers";
import { GoogleService } from "./types";

const renderServicesList = async () => {
	const ul = document.querySelector("#list") as HTMLElement;
	if (!ul) {
		return;
	}

	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}

	(await storageService.getServices()).forEach(service => {
		const input = createElement("input", {
			type: "checkbox",
			value: service.id,
			id: service.id,
			...(service.enabled && { checked: true }),
		}) as HTMLInputElement;
		const label = createElement("label", { for: service.id }, ` ${service.name}`) as HTMLLabelElement;
		const p = createElement("p", {}, [input, label]) as HTMLParagraphElement;
		const li: any = createElement("li", { style: `background-image: url(${service.icon});` }, p) as HTMLLIElement;

		ul.appendChild(li);
	});

	sortable.create(ul, {
		animation: 150,
		onUpdate: async (event: sortable.SortableEvent) => {
			const { oldIndex, newIndex } = event;
			if (typeof oldIndex !== "number" || typeof newIndex !== "number") {
				return;
			}
			const services = await storageService.getServices();
			const movedElement = services[oldIndex];
			services.splice(oldIndex, 1);
			services.splice(newIndex, 0, movedElement);
			await storageService.setServices(services);
		},
	});

	await addServiceCheckboxesEventListeners();
};

const addServiceCheckboxesEventListeners = async () => {
	document.querySelectorAll<HTMLInputElement>(`input[type="checkbox"]`).forEach(input => {
		input.addEventListener("click", async event => {
			const element = event.target as HTMLInputElement;
			if (element.value === "unread-counter") {
				await storageService.setShowBadge(element.checked);
			} else {
				const services = await storageService.getServices();
				const changedServices = services
					.map(service => {
						if (service.id === element.value) {
							service.enabled = element.checked;
						}
						return service;
					})
					.sort((x, y) => (x.enabled === y.enabled ? 0 : x.enabled ? -1 : 1));

				await storageService.setServices(changedServices);
				await renderServicesList();
			}
		});
	});
};

const renderStyleList = async () => {
	const styles = document.querySelector("#style-list");
	if (!styles) {
		return;
	}
	styles.innerHTML = "";

	(await storageService.getMenuStyles()).forEach(async style => {
		const input = createElement("input", {
			type: "radio",
			name: "style",
			value: style.name,
			id: style.name,
			...(style.enabled && { checked: true }),
			onclick: async (event: { target: HTMLInputElement }) => {
				const changedStyles = (await storageService.getMenuStyles()).map(style => {
					style.enabled = style.name === (event.target as HTMLInputElement).value;
					return style;
				});
				await storageService.setMenuStyles(changedStyles);
			},
		}) as HTMLInputElement;
		const label = createElement("label", { for: style.name }, ` ${style.name}`) as HTMLLabelElement;
		const p = createElement("p", {}, [input, label]) as HTMLParagraphElement;

		styles.appendChild(p);
	});
};

const initializeUnreadCountCheckbox = async () => {
	const checkbox = document.querySelector<HTMLInputElement>("#show-unread-count-checkbox");
	if (checkbox != null) {
		checkbox.checked = await storageService.getShowBadge();
	}
};

const initializeTabs = async () => {
	const tabLinks = document.querySelectorAll<HTMLElement>(".tab-links");
	tabLinks.forEach(element => {
		element.addEventListener("click", event => openTab(event, (event.target as HTMLInputElement).value));
	});

	if (tabLinks.length > 0) {
		(tabLinks[0] as HTMLElement).click();
	}
};

const openTab = async (event: Event, tabName: string) => {
	document.querySelectorAll<HTMLElement>(".tab-content").forEach(element => (element.style.display = "none"));

	document.querySelectorAll<HTMLElement>(".tab-links").forEach(element => element.classList.remove("active"));

	const tab = document.getElementById(tabName);
	if (tab) {
		tab.style.display = "block";
	}
	(event.currentTarget as HTMLElement).classList.add("active");
};

document.addEventListener("DOMContentLoaded", async () => {
	await renderServicesList();
	await renderStyleList();
	await initializeUnreadCountCheckbox();
	await initializeTabs();

	await handleContextMenu();

	const form = document.getElementById("custom-service-form");
	if (form) {
		form.addEventListener("submit", async (event: any) => {
			event.preventDefault();

			const nameEl = document.getElementById("service-name") as HTMLInputElement;
			const urlEl = document.getElementById("service-url") as HTMLInputElement;
			const iconEl = document.getElementById("service-icon") as HTMLInputElement;

			const name = nameEl.value.trim();
			const url = urlEl.value.trim();

			if (!name || !url) {
				return;
			}

			let iconDataUrl = "";
			if (iconEl && iconEl.files && iconEl.files[0]) {
				const file = iconEl.files[0];
				iconDataUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
			}

			const services = await storageService.getServices();

			const id = crypto.randomUUID();

			services.push(new GoogleService(id, name, url, iconDataUrl, true, true));

			await storageService.setServices(services);

			await renderServicesList();

			event.target.reset();

			if (iconEl) {
				iconEl.value = "";
			}
		});
	}
});
