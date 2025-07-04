import { refreshBadgeVisibility, storage, updateUnreadCounter, initializeData, updateData, constants } from "./helpers";

storage.onChange(async (changes: any) => {
	if (changes.hasOwnProperty(constants.Storage.ShowBadge)) {
		await refreshBadgeVisibility(changes[constants.Storage.ShowBadge].newValue);

		await HandleAlarm();
	}
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	switch (request.message) {
		case constants.Message.UpdateUnreadCounter:
			await HandleAlarm(true)
			break;
	}
});

chrome.runtime.onInstalled.addListener(async details => {
	await HandleAlarm();

	switch (details.reason) {
		case "install":
			await initializeData();
			await chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
			break;
		case "update":
			await updateData();
			break;
	}
});

async function HandleAlarm(forceUpdate: boolean = false) {
	await storage.get(constants.Storage.ShowBadge).then(async (active: boolean) => {
		if (forceUpdate && active) {
			await updateUnreadCounter();
		} else {
			const alarm = await chrome.alarms.get(constants.Alarm.UpdateUnreadCounter);
			if (active) {
				if (!alarm) {
					await chrome.alarms.create(constants.Alarm.UpdateUnreadCounter, { periodInMinutes: 0.5 }); // every 30 seconds
				}
			} else {
				if (alarm) {
					await chrome.alarms.clear(constants.Alarm.UpdateUnreadCounter);
				}
			}
		}
	});
}

chrome.tabs.onUpdated.addListener(async () => await HandleAlarm(true));

chrome.tabs.onActivated.addListener(async () => await HandleAlarm(true));

chrome.tabs.onRemoved.addListener(async () => await HandleAlarm(true));

chrome.tabs.onHighlighted.addListener(async () => await HandleAlarm(true));

chrome.windows.onFocusChanged.addListener(async () => await HandleAlarm(true));

chrome.alarms.onAlarm.addListener(async (alarm) => {
	switch (alarm.name) {
		case constants.Alarm.UpdateUnreadCounter:
			await HandleAlarm(true);
			break;
	}
});