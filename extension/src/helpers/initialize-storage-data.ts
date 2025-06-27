import { storage, constants } from ".";
import { GoogleService, MenuStyle } from "../types";

const defaultServices: GoogleService[] = [
    new GoogleService("mail", "Google Mail", "https://mail.google.com/", "../images/gmail.png"),
    new GoogleService("drive", "Google Drive", "https://drive.google.com", "../images/google_drive.png"),
    new GoogleService("translate", "Google Translate", "https://translate.google.com", "../images/google_translate.png"),
    new GoogleService("search", "Google Search", "https://google.com", "../images/google_search.png"),
    new GoogleService("maps", "Google Maps", "https://maps.google.com", "../images/google_maps.png"),
    new GoogleService("news", "Google News", "https://news.google.com", "../images/google_news.png"),
    new GoogleService("contacts", "Google Contacts", "https://contacts.google.com", "../images/google_contacts.png"),
    new GoogleService("photos", "Google Photos", "https://photos.google.com", "../images/google_photos.png"),
    new GoogleService("keep", "Google Keep", "https://keep.google.com", "../images/google_keep.png"),
    new GoogleService("calendar", "Google Calendar", "https://calendar.google.com", "../images/google_calendar.png"),
    new GoogleService("hangouts", "Google Hangouts", "https://hangouts.google.com", "../images/hangouts.png"),
    new GoogleService("meet", "Google Meet", "https://meet.google.com", "../images/google_meet.png"),
    new GoogleService("play", "Google Play", "https://play.google.com", "../images/google_play_store.png"),
    new GoogleService("youtube", "YouTube", "https://youtube.com", "../images/youtube.png"),
    new GoogleService("youtube-music", "YouTube Music", "https://music.youtube.com/", "../images/youtube_music.png"),
    new GoogleService("store", "Chrome Web Store", "https://chrome.google.com/webstore", "../images/store.png"),
];

const defaultMenuStyles: MenuStyle[] = [
	new MenuStyle("Grid Menu", "grid", true),
	new MenuStyle("Line Menu", "line", false)
];

const initializeServicesState = async () => await storage.set(constants.Storage.Services, defaultServices);

const updateServicesState = async () => {
	return await storage.get(constants.Storage.Services).then((services: GoogleService[]) => {
		defaultServices.forEach(defaultService => {
			const service = services.find(service => defaultService.id === service.id);
			if (!service) {
				services.push(defaultService);
			}
		});

		services.forEach(service => {
			if (!defaultServices.some(defaultService => defaultService.id === service.id)) {
				services = services.filter(s => s.id !== service.id);
			}
		});

		storage.set(constants.Storage.Services, services);
	});
};

const initializeMenuStylesState = async () => await storage.set(constants.Storage.MenuStyles, defaultMenuStyles);

const initializeBadgeVisibilityState = async () => await storage.set(constants.Storage.ShowBadge, true);

export const initializeData = async () => {
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

export const updateData = async () => await updateServicesState();
