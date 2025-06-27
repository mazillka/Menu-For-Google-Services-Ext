export default class MenuStyle {
    public name: string;
    public style: string;
    public enabled: boolean;

    constructor(name: string, url: string, enabled: boolean) {
        this.name = name;
        this.style = url;
        this.enabled = enabled;
    }
}
