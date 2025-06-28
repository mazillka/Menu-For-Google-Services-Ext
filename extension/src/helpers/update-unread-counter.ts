import { storage, throttle, constants } from ".";
import { XMLParser } from "fast-xml-parser";

const isBadgeActive = async (): Promise<boolean> => await storage.get(constants.Storage.ShowBadge);

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
	fetch(constants.Url.MailCount)
		.then(response => response.text())
		.then(xmlString => new XMLParser().parse(xmlString))
		.then(xmlData => {
			if (!xmlData || !xmlData.feed || !xmlData.feed.fullcount) {
				throw new Error("Invalid XML structure or missing fullcount");
			}
			const unreadNumber = Number(xmlData.feed.fullcount);
			if (!Number.isNaN(unreadNumber) && unreadNumber !== localUnreadCounter.number) {
				localUnreadCounter.number = unreadNumber;
			}
		})
		.catch(error => {
			console.error(`Error updating unread counter: ${error}`);
		});
}, 1000);
