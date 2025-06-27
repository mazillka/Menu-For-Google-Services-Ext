export const get = async (key: any): Promise<any> =>
	new Promise(resolve => {
		chrome.storage.sync.get([key], item => resolve(item[key] || null));
	});

export const set = async (key: any, value: any): Promise<void> =>
	chrome.storage.sync.set({ [key]: value });

export const remove = async (key: string | number | (string | number)[]): Promise<void> =>
	chrome.storage.sync.remove(key);

export const clear = async (): Promise<void> =>
	chrome.storage.sync.clear();

export const onChange = (
	cb: (arg0: { [key: string]: chrome.storage.StorageChange }) => void
): void =>
	chrome.storage.onChanged.addListener((changes, namespace) =>
		namespace === "sync" ? cb(changes) : undefined
	);

export default {
	get,
	set,
	remove,
	clear,
	onChange
};
