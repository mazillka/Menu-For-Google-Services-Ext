const get = async (key: any): Promise<any> => {
    const item = await chrome.storage.local.get([key]);
    return item[key] ?? undefined;
};

const set = async (key: any, value: any): Promise<void> =>
	await chrome.storage.local.set({ [key]: value });

const remove = async (key: string | number | (string | number)[]): Promise<void> =>
	await chrome.storage.local.remove(key);

const clear = async (): Promise<void> =>
	await chrome.storage.local.clear();

const onChange = (
	cb: (arg0: { [key: string]: chrome.storage.StorageChange }) => void
): void =>
	chrome.storage.onChanged.addListener((changes, namespace) =>
		namespace === "sync" ? cb(changes) : undefined);

export default {
	get,
	set,
	remove,
	clear,
	onChange
};
