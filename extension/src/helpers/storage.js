export const get = async key => new Promise(async resolve => await chrome.storage.sync.get([key], item => resolve(item[key] || null)));
export const set = async (key, value) => await chrome.storage.sync.set({ [key]: value });
export const remove = async key => chrome.storage.sync.remove(key);
export const clear = async () => chrome.storage.sync.clear();
export const onChange = cb => chrome.storage.onChanged.addListener((changes, namespace) => (namespace === "sync" ? cb(changes) : false));

export default {
	get,
	set,
	remove,
	clear,
	onChange,
};
