//@ts-nocheck
import { Base } from "./Base";

export class Viewer extends Base {
    public async playStream(firstMagnetURI: string): Promise<void> {
        console.log("📥 Fetching first chunk:", firstMagnetURI);
        this.playChunk(firstMagnetURI);
    }

    private async playChunk(magnetURI: string): Promise<void> {
        this.client.add(magnetURI, async (torrent) => {
            console.log("✅ Downloaded chunk:", magnetURI);
            console.log(torrent)
            const file = torrent.files.find((file) =>
                file.name.match(/\.(mp4|webm|ogg|mkv|avi|mov|flv)$/i)
            );

            if (!file) {
                console.error("❌ No supported video files found in the torrent.");
                return;
            }

            const video = document.getElementById("remoteVideo") as HTMLVideoElement;
            if (!video) {
                console.error("❌ Video element not found!");
                return;
            }

            const blob = await file.blob();
            const blobURL = URL.createObjectURL(blob);
            video.src = blobURL;
            video.play();

            console.log("🎥 Playing chunk:", magnetURI);

            // ✅ Fetch the next chunk
            const nextMagnetURI = this.getNextMagnetURI(magnetURI);
            if (nextMagnetURI) {
                setTimeout(() => this.playChunk(nextMagnetURI), 5000);
            } else {
                console.log("✅ Stream Ended.");
            }
        });
    }

    /** ✅ Get Next Magnet URI from Broadcaster */
    private getNextMagnetURI(currentMagnetURI: string): string | null {
        return (window as any).broadcasterInstance?.getNextMagnetURI(currentMagnetURI) || null;
    }
}
