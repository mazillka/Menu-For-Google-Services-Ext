import { createElement, getElement, getElements  } from "./dom";
import { updateUnreadCounter, refreshBadgeVisibility } from "./update-unread-counter";
import storage from "./storage";
import { initializeData, updateData } from "./initialize-storage-data";
import { constants } from "./constants"
import { handleContextMenu } from "./contextmenu";
import storageService from "./storageService";
import { onContentLoaded } from "./common";

export {
    storage,
    createElement,
    getElement,
    getElements,
    updateUnreadCounter,
    refreshBadgeVisibility,
    initializeData,
    updateData,
    constants,
    handleContextMenu,
    storageService,
    onContentLoaded
};
