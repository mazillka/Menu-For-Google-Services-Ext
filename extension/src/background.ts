import { refreshBadgeVisibility, storage, updateUnreadCounter, initializeData, updateData } from "./helpers";

storage.onChange(changes => {
	if (changes.hasOwnProperty(storage.StorageKeys.showBadge)) {
		refreshBadgeVisibility(changes.showBadge.newValue);
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "update-unread-counter") {
		updateUnreadCounter();
	}
});

chrome.runtime.onInstalled.addListener(async details => {
	switch (details.reason) {
		case "install":
			await initializeData();
			chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
			break;
		case "update":
			await updateData();
			break;
	}
});

chrome.tabs.onUpdated.addListener(updateUnreadCounter);
chrome.tabs.onActivated.addListener(updateUnreadCounter);
chrome.tabs.onRemoved.addListener(updateUnreadCounter);
chrome.tabs.onHighlighted.addListener(updateUnreadCounter);
chrome.windows.onFocusChanged.addListener(updateUnreadCounter);
