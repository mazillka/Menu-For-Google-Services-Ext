import "./scss/options.scss";
import sortable from "sortablejs";
import { createElement, storage, constants } from "./helpers";
import { GoogleService, MenuStyle } from "./types";

async function renderServicesList() {
	const ul = document.querySelector("#list") as HTMLElement;
	if (!ul) {
		return;
	}

	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}

	const services: GoogleService[] = await storage.get(constants.Storage.Services);
	services.forEach(service => {
		const input: any = createElement("input", {
			type: "checkbox",
			value: service.id,
			id: service.id,
			...(service.enabled && { checked: true }),
		});
		const label: any = createElement("label", { htmlFor: service.id }, ` ${service.name}`);
		const p: any = createElement("p", {}, [input, label]);
		const li: any = createElement("li", { style: `background-image: url(${service.icon});` }, p);

		ul.appendChild(li);
	});

	sortable.create(ul, {
		animation: 150,
		onUpdate: async (event: sortable.SortableEvent) => {
			const { oldIndex, newIndex } = event;
			if (typeof oldIndex !== "number" || typeof newIndex !== "number") {
				return;
			}
			const services: GoogleService[] = await storage.get(constants.Storage.Services);
			const movedElement = services[oldIndex];
			services.splice(oldIndex, 1);
			services.splice(newIndex, 0, movedElement);
			await storage.set(constants.Storage.Services, services);
		},
	});

	addServiceCheckboxesEventListeners();
}

function addServiceCheckboxesEventListeners() {
	document.querySelectorAll<HTMLInputElement>(`input[type="checkbox"]`)
		.forEach(input => {
			input.addEventListener("click", async event => {
				const element = event.target as HTMLInputElement;
				if (element.value === "unread-counter") {
					storage.set(constants.Storage.ShowBadge, element.checked);
				} else {
					const services: GoogleService[] = await storage.get(constants.Storage.Services);
					const changedServices = services
						.map(service => {
							if (service.id === element.value) {
								service.enabled = element.checked;
							}
							return service;
						})
						.sort((x, y) => (x.enabled === y.enabled ? 0 : x.enabled ? -1 : 1));

					await storage.set(constants.Storage.Services, changedServices);
					await renderServicesList();
				}
			});
		});
}

async function renderStyleList() {
	const menuStyles: MenuStyle[] = await storage.get(constants.Storage.MenuStyles);
	menuStyles.forEach(style => {
		const input: any = createElement("input", {
			type: "radio",
			name: "style",
			value: style.name,
			id: style.name,
			...(style.enabled && { checked: true }),
		});
		const label: any = createElement("label", { htmlFor: style.name }, ` ${style.name}`);
		const p: any = createElement("p", {}, [input, label]);
		input.addEventListener("click", async (event: { target: HTMLInputElement; }) => {
			const storageStyles: MenuStyle[] = await storage.get(constants.Storage.MenuStyles);
			const changedStyles = storageStyles.map((style: MenuStyle) => {
				style.enabled = style.name === (event.target as HTMLInputElement).value;
				return style;
			});
			await storage.set(constants.Storage.MenuStyles, changedStyles);
		});

		const styles = document.querySelector("#style-list");
		if (styles != null) {
			styles.appendChild(p);
		}
	});
}

async function initializeUnreadCountCheckbox() {
	const checkbox = document.querySelector<HTMLInputElement>("#show-unread-count-checkbox");
	if (checkbox != null) {
		checkbox.checked = await storage.get(constants.Storage.ShowBadge);
	}
}

function initializeTabs() {
	const tabLinks = document.querySelectorAll<HTMLElement>(".tab-links");
	tabLinks.forEach(element => {
		element.addEventListener("click", event => openTab(event, (event.target as HTMLInputElement).value));
	});

	if (tabLinks.length > 0) {
		(tabLinks[0] as HTMLElement).click();
	}
}

function openTab(event: Event, tabName: string) {
	document.querySelectorAll<HTMLElement>(".tab-content")
		.forEach(element => (element.style.display = "none"));

	document.querySelectorAll<HTMLElement>(".tab-links")
		.forEach(element => element.classList.remove("active"));

	const tab = document.getElementById(tabName);
	if (tab) {
		tab.style.display = "block";
	}
	(event.currentTarget as HTMLElement).classList.add("active");
}

document.addEventListener("DOMContentLoaded", async () => {
	await renderServicesList();
	await renderStyleList();
	await initializeUnreadCountCheckbox();
	initializeTabs();
});

document.addEventListener("contextmenu", event => event.preventDefault());
