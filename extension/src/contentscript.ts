import { constants } from "./helpers";

chrome.runtime.sendMessage({ message: constants.Message.UpdateUnreadCounter });
