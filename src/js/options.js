import "../scss/options.scss";
import sortable from "sortablejs";
import { createElement, storage } from "./helpers";

async function renderServicesList() {
	const ul = document.querySelector("#list");
	while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
	}

	await storage.get("services").then(services => {
		services.forEach(service => {
			const input = createElement("input", {
				type: "checkbox",
				value: service.id,
				id: service.id,
				...(service.enabled && { checked: true }),
			});
			const label = createElement("label", { for: service.id }, ` ${service.name}`);
			const p = createElement("p", {}, [input, label]);
			const li = createElement("li", { style: `background-image: url(${service.icon});` }, p);

			ul.appendChild(li);
		});
	});

	sortable.create(ul, {
		animation: 150,
		onUpdate: async event => {
			const services = await storage.get("services");
			const movedElement = services[event.oldIndex];

			services.splice(event.oldIndex, 1);
			services.splice(event.newIndex, 0, movedElement);

			await storage.set("services", services);
		},
	});

	addServiceCheckboxesEventListeners();
}

function addServiceCheckboxesEventListeners() {
	const inputs = document.querySelectorAll(`input[type="checkbox"]`);
	[...inputs].forEach(input => {
		input.addEventListener("click", async event => {
			const element = event.target;
			if (element.value === "unread-counter") {
				storage.set("showBadge", element.checked);
			} else {
				const services = await storage.get("services");
				const changedServices = services
					.map(service => {
						if (service.id === element.value) {
							service.enabled = element.checked;
						}
						return service;
					})
					.sort((x, y) => (x.enabled === y.enabled ? 0 : x.enabled ? -1 : 1));

				await storage.set("services", changedServices);
				await renderServicesList();
			}
		});
	});
}

async function renderStyleList() {
	const styles = document.querySelector("#style-list");
	await storage.get("menuStyles").then(menuStyles => {
		menuStyles.forEach(style => {
			const input = createElement("input", {
				type: "radio",
				name: "style",
				value: style.name,
				id: style.name,
				...(style.enabled && { checked: true }),
			});
			const label = createElement("label", { for: style.name }, ` ${style.name}`);
			const p = createElement("p", {}, [input, label]);
			input.addEventListener("click", async event => {
				const storageStyles = await storage.get("menuStyles");
				const changedStyles = storageStyles.map(style => {
					style.enabled = style.name === event.target.value;
					return style;
				});
				await storage.set("menuStyles", changedStyles);
			});

			styles.appendChild(p);
		});
	});
}

async function initializeUnreadCountCheckbox() {
	document.querySelector("#show-unread-count-checkbox").checked = await storage.get("showBadge");
}

function initializeTabs() {
	const tabLinks = document.querySelectorAll(".tab-links");
	[...tabLinks].forEach(element => {
		element.addEventListener("click", event => openTab(event, event.target.value));
	});
	tabLinks[0].click();
}

function openTab(event, tabName) {
	const tabContent = document.querySelectorAll(".tab-content");
	const tabLinks = document.querySelectorAll(".tab-links");

	[...tabContent].forEach(element => (element.style.display = "none"));
	[...tabLinks].forEach(element => element.classList.remove("active"));

	document.getElementById(tabName).style.display = "block";
	event.currentTarget.classList.add("active");
}

document.addEventListener("DOMContentLoaded", async () => {
	await renderServicesList();
	await renderStyleList();
	await initializeUnreadCountCheckbox();
	initializeTabs();
});

document.addEventListener("contextmenu", event => event.preventDefault());
