import { Base } from "./Base";

export class Viewer extends Base {


    public playStream(magnetURI: string, callback: (url: string) => void): void {
        this.client.add(magnetURI, (torrent) => {
            torrent.files[0].getBlobURL((err, url) => {
                if (!err) {
                    console.log("🎥 Streaming live video:", url);
                    callback(url); // ✅ Pass URL to a callback
                }
            });
        });
    }

}