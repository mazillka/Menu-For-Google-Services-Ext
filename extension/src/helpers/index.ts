import { createElement } from "./dom";
import { updateUnreadCounter, refreshBadgeVisibility } from "./update-unread-counter";
import storage from "./storage";
import { initializeData, updateData } from "./initialize-storage-data";
import { constants } from "./constants"
import { handleContextMenu } from "./contextmenu";
import storageService from "./storageService";

export {
    storage,
    createElement,
    updateUnreadCounter,
    refreshBadgeVisibility,
    initializeData,
    updateData,
    constants,
    handleContextMenu,
    storageService
};
