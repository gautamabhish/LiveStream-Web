import { Base } from "./Base";
import WebTorrent from "webtorrent"
export class BroadCaster extends Base {
    private latestMagnetURI: string = "";

    /** ✅ Ensure WebTorrent Client is Available */
    private ensureClient() {
        if (!this.client) {
            console.log("🔄 Reinitializing WebTorrent client...");
            this.client = new WebTorrent();
        }
    }

  
    public async seedVideoChunk(blob: Blob): Promise<void> {
        this.ensureClient(); // ✅ Ensure WebTorrent is running

        this.client.seed(blob, (torrent: any) => {
            this.latestMagnetURI = torrent.magnetURI;
            console.log("🔹 Seeding chunk:", this.latestMagnetURI);
        });
    }

    public getLatestMagnetURI(): string {
        return this.latestMagnetURI;
    }

    /** ✅ Destroy WebTorrent Client */
    public stopSeeding() {
        if (this.client) {
            console.log(" Stopping WebTorrent seeding...");
            this.client.destroy();
            this.client = null; //  Mark as null so it can be reinitialized
            this.latestMagnetURI = ""; //  Reset Magnet URI
        }
    }
}
