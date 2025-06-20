import { storage } from "./";

const defaultServices = [
	{
		id: "mail",
		name: "Google Mail",
		url: "https://mail.google.com/",
		icon: "../images/gmail.png",
		enabled: true,
	},
	{
		id: "drive",
		name: "Google Drive",
		url: "https://drive.google.com",
		icon: "../images/google_drive.png",
		enabled: true,
	},
	{
		id: "translate",
		name: "Google Translate",
		url: "https://translate.google.com",
		icon: "../images/google_translate.png",
		enabled: true,
	},
	{
		id: "search",
		name: "Google Search",
		url: "https://google.com",
		icon: "../images/google_search.png",
		enabled: true,
	},
	{
		id: "maps",
		name: "Google Maps",
		url: "https://maps.google.com",
		icon: "../images/google_maps.png",
		enabled: true,
	},
	{
		id: "news",
		name: "Google News",
		url: "https://news.google.com",
		icon: "../images/google_news.png",
		enabled: true,
	},
	{
		id: "contacts",
		name: "Google Contacts",
		url: "https://contacts.google.com",
		icon: "../images/google_contacts.png",
		enabled: true,
	},
	{
		id: "photos",
		name: "Google Photos",
		url: "https://photos.google.com",
		icon: "../images/google_photos.png",
		enabled: true,
	},
	{
		id: "keep",
		name: "Google Keep",
		url: "https://keep.google.com",
		icon: "../images/google_keep.png",
		enabled: true,
	},
	{
		id: "calendar",
		name: "Google Calendar",
		url: "https://calendar.google.com",
		icon: "../images/google_calendar.png",
		enabled: true,
	},
	{
		id: "hangouts",
		name: "Google Hangouts",
		url: "https://hangouts.google.com",
		icon: "../images/hangouts.png",
		enabled: true,
	},
	{
		id: "music",
		name: "Google Play Music",
		url: "https://music.google.com",
		icon: "../images/google_play_music.png",
		enabled: true,
	},
	{
		id: "duo",
		name: "Google Duo",
		url: "https://duo.google.com",
		icon: "../images/google_duo.png",
		enabled: true,
	},
	{
		id: "meet",
		name: "Google Meet",
		url: "https://meet.google.com",
		icon: "../images/google_meet.png",
		enabled: true,
	},
	{
		id: "play",
		name: "Google Play",
		url: "https://play.google.com",
		icon: "../images/google_play_store.png",
		enabled: true,
	},
	{
		id: "youtube",
		name: "YouTube",
		url: "https://youtube.com",
		icon: "../images/youtube.png",
		enabled: true,
	},
	{
		id: "youtube-music",
		name: "YouTube Music",
		url: "https://music.youtube.com/",
		icon: "../images/youtube_music.png",
		enabled: true,
	},
	{
		id: "store",
		name: "Chrome Web Store",
		url: "https://chrome.google.com/webstore",
		icon: "../images/store.png",
		enabled: true,
	},
];

const defaultMenuStyles = [
	{ name: "Grid Menu", style: "grid", enabled: true },
	{ name: "Line Menu", style: "line", enabled: false },
];

const initializeServicesState = async () => await storage.set("services", defaultServices);

const updateServicesState = async () => {
	return await storage.get("services").then(services => {
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

		storage.set("services", services);
	});
};

const initializeMenuStylesState = async () => await storage.set("menuStyles", defaultMenuStyles);

const initializeBadgeVisibilityState = async () => await storage.set("showBadge", true);

export const initializeData = async () => {
	if (!(await storage.get("services"))) {
		await initializeServicesState();
	}

	if (!(await storage.get("menuStyles"))) {
		await initializeMenuStylesState();
	}

	if (!(await storage.get("showBadge"))) {
		await initializeBadgeVisibilityState();
	}
};

export const updateData = async () => await updateServicesState();
