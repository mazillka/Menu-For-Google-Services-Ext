export default class GoogleService {
    public id: string;
    public name: string;
    public url: string;
    public icon: string;
    public enabled: boolean;
    public custom: boolean;

    constructor(id: string, name: string, url: string, icon: string, enabled: boolean = true, custom: boolean = false) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.icon = icon;
        this.enabled = enabled;
        this.custom = custom;
    }
}
