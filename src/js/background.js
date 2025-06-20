import { initializeData, updateData } from "./helpers/initialize-storage-data";
import { refreshBadgeVisibility, storage, updateUnreadCounter } from "./helpers";

// set up listeners
storage.onChange(changes => {
	if (changes.hasOwnProperty("showBadge")) {
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
