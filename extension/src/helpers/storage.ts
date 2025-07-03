const get = async (key: any): Promise<any> =>
	new Promise(resolve => {
		chrome.storage.sync.get([key], item => resolve(item[key] || null));
	});

const set = async (key: any, value: any): Promise<void> =>
	await chrome.storage.sync.set({ [key]: value });

const remove = async (key: string | number | (string | number)[]): Promise<void> =>
	await chrome.storage.sync.remove(key);

const clear = async (): Promise<void> =>
	await chrome.storage.sync.clear();

const onChange = (
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
