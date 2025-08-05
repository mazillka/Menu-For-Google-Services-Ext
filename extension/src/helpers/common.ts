const onContentLoaded = async (callback: any) => {
	return new Promise(async (resolve, reject) => {
		callback ||= resolve;
		if (document.readyState === "interactive" || document.readyState === "complete") {
			await callback();
		} else {
			document.addEventListener("DOMContentLoaded", async () => {
				await callback();
			});
		}
	});
};

export {
    onContentLoaded
};
