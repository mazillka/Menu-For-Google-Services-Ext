import { storage, constants } from ".";
import { GoogleService, MenuStyle } from "../types";

const defaultServices: GoogleService[] = [
	new GoogleService("mail", "Google Mail", "https://mail.google.com/", "../icons/svg/icons8-gmail.svg"),
	new GoogleService("drive", "Google Drive", "https://drive.google.com", "../icons/svg/icons8-google-drive.svg"),
	new GoogleService("translate", "Google Translate", "https://translate.google.com", "../icons/svg/icons8-translate.svg"),
	new GoogleService("search", "Google Search", "https://google.com", "../icons/svg/icons8-google.svg"),
	new GoogleService("maps", "Google Maps", "https://maps.google.com", "../icons/svg/icons8-google-maps.svg"),
	new GoogleService("news", "Google News", "https://news.google.com", "../icons/svg/icons8-google-news.svg"),
	new GoogleService("contacts", "Google Contacts", "https://contacts.google.com", "../icons/svg/icons8-google-contacts.svg"),
	new GoogleService("photos", "Google Photos", "https://photos.google.com", "../icons/svg/icons8-google-photos.svg"),
	new GoogleService("keep", "Google Keep", "https://keep.google.com", "../icons/svg/icons8-google-keep-new.svg"),
	new GoogleService("calendar", "Google Calendar", "https://calendar.google.com", "../icons/svg/icons8-google-calendar.svg"),
	new GoogleService("meet", "Google Meet", "https://meet.google.com", "../icons/svg/icons8-google-meet.svg"),
	new GoogleService("play", "Google Play", "https://play.google.com", "../icons/svg/icons8-google-play-store.svg"),
	new GoogleService("youtube", "YouTube", "https://youtube.com", "../icons/svg/icons8-youtube.svg"),
	new GoogleService("youtube-music", "YouTube Music", "https://music.youtube.com/", "../icons/svg/icons8-youtube-music.svg"),
	new GoogleService("store", "Chrome Web Store", "https://chrome.google.com/webstore", "../icons/svg/icons8-chrome-web-store.svg"),
	new GoogleService("chat", "Google Chat", "https://mail.google.com/chat", "../icons/svg/icons8-google-chat.svg"),
	new GoogleService("gemini", "Google Gemini", "https://gemini.google.com/", "../icons/svg/icons8-gemini.svg"),
];

const defaultMenuStyles: MenuStyle[] = [
	new MenuStyle("Grid Menu", "grid", true),
	new MenuStyle("Line Menu", "line", false)
];

const initializeServicesState = async () => await storage.set(constants.Storage.Services, defaultServices);

const initializeMenuStylesState = async () => await storage.set(constants.Storage.MenuStyles, defaultMenuStyles);

const initializeBadgeVisibilityState = async () => await storage.set(constants.Storage.ShowBadge, true);

const updateServicesState = async () => {
	return await storage.get(constants.Storage.Services).then(async (services: GoogleService[]) => {
		defaultServices.forEach(defaultService => {
			const service = services.find(service => defaultService.id === service.id);
			if (service) {
				service.name = defaultService.name;
				service.url = defaultService.url;
				service.icon = defaultService.icon;
			} else {
				services.push(defaultService);
			}
		});

		services.forEach(service => {
			if (!defaultServices.some(defaultService => defaultService.id === service.id)) {
				services = services.filter(s => s.id !== service.id);
			}
		});

		await storage.set(constants.Storage.Services, services);
	});
};

const initializeData = async () => {
	if (!(await storage.get(constants.Storage.Services))) {
		await initializeServicesState();
	}

	if (!(await storage.get(constants.Storage.MenuStyles))) {
		await initializeMenuStylesState();
	}

	if (!(await storage.get(constants.Storage.ShowBadge))) {
		await initializeBadgeVisibilityState();
	}
};

const updateData = async () => await updateServicesState();

export { initializeData, updateData }
