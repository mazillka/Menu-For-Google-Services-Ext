import { refreshBadgeVisibility, storage, updateUnreadCounter, initializeData, updateData, constants } from "./helpers";

storage.onChange(changes => {
	if (changes.hasOwnProperty(constants.Storage.ShowBadge)) {
		refreshBadgeVisibility(changes[constants.Storage.ShowBadge].newValue);
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === constants.Message.UpdateUnreadCounter) {
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
