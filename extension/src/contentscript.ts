import { constants } from "./helpers";

await chrome.runtime.sendMessage({ message: constants.Message.UpdateUnreadCounter });
