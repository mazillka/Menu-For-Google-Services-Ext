import { GoogleService, MenuStyle } from "../types";
import storage from "./storage";
import { constants } from "./constants";

const getServices = async (): Promise<GoogleService[]> =>
    await storage.get(constants.Storage.Services);

const setServices = async (services: GoogleService[]): Promise<void> =>
    await storage.set(constants.Storage.Services, services);

const getMenuStyles = async (): Promise<MenuStyle[]> =>
    await storage.get(constants.Storage.MenuStyles);

const setMenuStyles = async (menuStyles: MenuStyle[]): Promise<void> =>
    await storage.set(constants.Storage.MenuStyles, menuStyles);

const getEnabledMenuStyle = async (): Promise<MenuStyle | undefined> =>
    await storage
        .get(constants.Storage.MenuStyles)
        .then((menuStyles: MenuStyle[]) =>
            menuStyles.find((style: { enabled: boolean }) => style.enabled));

const getShowBadge = async (): Promise<boolean> =>
    await storage.get(constants.Storage.ShowBadge);

const setShowBadge = async (isChecked: boolean): Promise<void> =>
    await storage.set(constants.Storage.ShowBadge, isChecked);

export default {
    getServices,
    setServices,
    getMenuStyles,
    setMenuStyles,
    getEnabledMenuStyle,
    getShowBadge,
    setShowBadge,
};
