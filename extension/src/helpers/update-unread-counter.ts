import { storage, constants } from ".";
import { XMLParser } from "fast-xml-parser";

const setBadgeText = async (text: string) => await chrome.action.setBadgeText({ text });

const counter: { number: number | null } = { number: null };

const localUnreadCounter = new Proxy(counter, {
	set(target: any, objectKey: string, value: any) {
		target[objectKey] = value;
		if (objectKey === "number" && !Number.isNaN(value)) {
			storage.get(constants.Storage.ShowBadge).then(async (active: boolean) => {
				if (active) {
					await setBadgeText(value > 0 ? value.toString() : "");
				}
			});
		}
		return true;
	},
	get(object, key) {
		return object[key];
	},
});

const refreshBadgeVisibility = async (visibility: boolean) =>
	setBadgeText(visibility && localUnreadCounter.number ? localUnreadCounter.number.toString() : "");

const updateUnreadCounter = async () => {
	await fetch(constants.Url.MailCount)
		.then(response => response.text())
		.then(xmlString => new XMLParser().parse(xmlString))
		.then(xmlData => {
			const unreadNumber = Number(xmlData.feed.fullcount);
			if (!Number.isNaN(unreadNumber) && unreadNumber !== localUnreadCounter.number) {
				localUnreadCounter.number = unreadNumber;
			}
		})
		.catch(error => {
			console.error(`Error updating unread counter: ${error}`);
		});
};

export { updateUnreadCounter, refreshBadgeVisibility }