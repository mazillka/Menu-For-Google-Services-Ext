const handleContextMenu = async (): Promise<void> => {
    if (process.env.NODE_ENV !== "development") {
        document.addEventListener("contextmenu", event => event.preventDefault(), { passive: false });
    }
};

export {
    handleContextMenu
}
