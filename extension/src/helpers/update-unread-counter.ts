import { storage, throttle } from ".";
import { XMLParser } from "fast-xml-parser";

const isBadgeActive = async (): Promise<boolean> => {
	const item = await storage.get(storage.StorageKeys.showBadge);
	return !!item.showBadge;
};

const setBadgeText = (text: string) => chrome.action.setBadgeText({ text });

const counter: { number: number | null } = { number: null };

const localUnreadCounter = new Proxy(counter, {
	set(target: any, objectKey: string, value: any) {
		target[objectKey] = value;
		if (objectKey === "number" && !Number.isNaN(value)) {
			isBadgeActive().then((active) => {
				if (active) {
					setBadgeText(value > 0 ? value.toString() : "");
				}
			});
		}
		return true;
	},
	get(object, key) {
		return object[key];
	},
});

export const refreshBadgeVisibility = (visibility: boolean) =>
	setBadgeText(visibility && localUnreadCounter.number ? localUnreadCounter.number.toString() : "");

export const updateUnreadCounter = throttle(() => {
	fetch("https://mail.google.com/mail/feed/atom")
		.then(response => response.text())
		.then(xmlString => new XMLParser().parse(xmlString))
		.then(xmlData => {
			const unreadNumber = Number(xmlData.feed.fullcount);

			if (!Number.isNaN(unreadNumber) && unreadNumber !== localUnreadCounter.number) {
				localUnreadCounter.number = unreadNumber;
			}
		});
}, 1000);
