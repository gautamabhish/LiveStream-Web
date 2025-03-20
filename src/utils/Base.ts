import WebTorrent from "webtorrent";

export class Base {
    public client: WebTorrent.Instance;

    constructor() {
        this.client = new WebTorrent();
        this.client.setMaxListeners(50); // ✅ Prevents memory leak warnings
    }

    /** ✅ Ensure WebTorrent is always running */
    protected ensureClient() {
        if (!this.client || this.client.destroyed) {
            console.log("🔄 Reinitializing WebTorrent client...");
            this.client = new WebTorrent();
            this.client.setMaxListeners(50);
        }
    }
}
