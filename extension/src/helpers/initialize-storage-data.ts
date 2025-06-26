import { storage } from ".";
import { Service, Style } from "../types";

const defaultServices: Service[] = [
    new Service("mail", "Google Mail", "https://mail.google.com/", "../images/gmail.png"),
    new Service("drive", "Google Drive", "https://drive.google.com", "../images/google_drive.png"),
    new Service("translate", "Google Translate", "https://translate.google.com", "../images/google_translate.png"),
    new Service("search", "Google Search", "https://google.com", "../images/google_search.png"),
    new Service("maps", "Google Maps", "https://maps.google.com", "../images/google_maps.png"),
    new Service("news", "Google News", "https://news.google.com", "../images/google_news.png"),
    new Service("contacts", "Google Contacts", "https://contacts.google.com", "../images/google_contacts.png"),
    new Service("photos", "Google Photos", "https://photos.google.com", "../images/google_photos.png"),
    new Service("keep", "Google Keep", "https://keep.google.com", "../images/google_keep.png"),
    new Service("calendar", "Google Calendar", "https://calendar.google.com", "../images/google_calendar.png"),
    new Service("hangouts", "Google Hangouts", "https://hangouts.google.com", "../images/hangouts.png"),
    new Service("meet", "Google Meet", "https://meet.google.com", "../images/google_meet.png"),
    new Service("play", "Google Play", "https://play.google.com", "../images/google_play_store.png"),
    new Service("youtube", "YouTube", "https://youtube.com", "../images/youtube.png"),
    new Service("youtube-music", "YouTube Music", "https://music.youtube.com/", "../images/youtube_music.png"),
    new Service("store", "Chrome Web Store", "https://chrome.google.com/webstore", "../images/store.png"),
];

const defaultMenuStyles: Style[] = [
	new Style("Grid Menu", "grid", true),
	new Style("Line Menu", "line", false)
];

const initializeServicesState = async () => await storage.set(storage.StorageKeys.services, defaultServices);

const updateServicesState = async () => {
	return await storage.get(storage.StorageKeys.services).then((services: Service[]) => {
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

		storage.set(storage.StorageKeys.services, services);
	});
};

const initializeMenuStylesState = async () => await storage.set(storage.StorageKeys.menuStyles, defaultMenuStyles);

const initializeBadgeVisibilityState = async () => await storage.set(storage.StorageKeys.showBadge, true);

export const initializeData = async () => {
	if (!(await storage.get(storage.StorageKeys.services))) {
		await initializeServicesState();
	}

	if (!(await storage.get(storage.StorageKeys.menuStyles))) {
		await initializeMenuStylesState();
	}

	if (!(await storage.get(storage.StorageKeys.showBadge))) {
		await initializeBadgeVisibilityState();
	}
};

export const updateData = async () => await updateServicesState();
