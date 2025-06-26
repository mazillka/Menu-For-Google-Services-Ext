import { createElement } from "./dom";
import { throttle } from "./trottle";
import { updateUnreadCounter, refreshBadgeVisibility } from "./update-unread-counter";
import storage from "./storage";
import { initializeData, updateData } from "./initialize-storage-data";

export { throttle, storage, createElement, updateUnreadCounter, refreshBadgeVisibility, initializeData, updateData };
