import { DOMParser } from 'xmldom';
import { throttle } from "./trottle";

const isBadgeActive = () => new Promise(resolve => chrome.storage.sync.get(["showBadge"], item => resolve(item.showBadge)));
const setBadgeText = text => chrome.action.setBadgeText({ text });
const counter = { number: null };

const localUnreadCounter = new Proxy(counter, {
	set: async (target, objectKey, value) => {
		target[objectKey] = value;
		if (objectKey === "number" && !Number.isNaN(value) && (await isBadgeActive())) {
			setBadgeText(value > 0 ? value.toString() : "");
		}
		return true;
	},
	get: (object, key) => {
		return object[key];
	},
});

export const refreshBadgeVisibility = visibility => setBadgeText(visibility && localUnreadCounter.number ? localUnreadCounter.number.toString() : "");

export const updateUnreadCounter = throttle(() => {
	const parser = new DOMParser();

	fetch("https://mail.google.com/mail/feed/atom")
		.then(response => response.text())
		.then(xmlString => parser.parseFromString(xmlString, "text/xml"))
		.then(xmlDoc => {
			if (xmlDoc) {
				const tag = xmlDoc.getElementsByTagNameNS("http://purl.org/atom/ns#", "fullcount")[0];
				if (tag) {
					const unreadNumber = Number(tag.textContent);

					if (!Number.isNaN(unreadNumber) && unreadNumber !== localUnreadCounter.number) {
						localUnreadCounter.number = unreadNumber;
					}
				}
			}
		});
}, 1000);
