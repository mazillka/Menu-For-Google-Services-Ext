import { storageService } from ".";
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
	new GoogleService("tasks", "Google Tasks", "https://tasks.google.com/", "../icons/svg/tasks.svg"),
];

const defaultMenuStyles: MenuStyle[] = [new MenuStyle("Grid Menu", "grid", true), new MenuStyle("Line Menu", "line", false)];

const defaultShowBadge = true;

const initializeData = async () => {
	const [services, menuStyles, showBadge] = await Promise.all([storageService.getServices(), storageService.getMenuStyles(), storageService.getShowBadge()]);

	if (!services || services.length === 0) {
		await storageService.setServices(defaultServices);
	}

	if (!menuStyles || menuStyles.length === 0) {
		await storageService.setMenuStyles(defaultMenuStyles);
	}

	if (typeof showBadge !== "boolean") {
		await storageService.setShowBadge(defaultShowBadge);
	}
};

const updateData = async () => {
	return await storageService.getServices().then(async (services: GoogleService[]) => {
		// Add or update default services
		defaultServices.forEach(defaultService => {
			const existing = services.find(service => defaultService.id === service.id);
			if (existing) {
				existing.name = defaultService.name;
				existing.url = defaultService.url;
				existing.icon = defaultService.icon;
			} else {
				services.push(defaultService);
			}
		});

		// Remove non-custom services and services that are not in defaults
		services = services.filter(service => service.custom || defaultServices.some(def => def.id === service.id));

		await storageService.setServices(services);
	});
};

export { initializeData, updateData };
