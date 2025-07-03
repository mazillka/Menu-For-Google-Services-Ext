async function handleContextMenu() {
    if (process.env.NODE_ENV !== "development") {
        document.addEventListener("contextmenu", event => event.preventDefault());
    }
}

export { handleContextMenu }
