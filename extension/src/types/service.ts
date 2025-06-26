export default class Service {
    public id: string;
    public name: string;
    public url: string;
    public icon: string;
    public enabled: boolean;

    constructor(id: string, name: string, url: string, incon: string, enabled: boolean = true) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.icon = incon;
        this.enabled = enabled;
    }
}
