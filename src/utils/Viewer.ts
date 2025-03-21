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
            console.log(file);
            
            file.getBlob((err, blob) => {
                if (err || !blob || blob.size === 0) {
                    console.error("❌ Error retrieving blob:", err);
                    return;
                }
    
                const blobURL = URL.createObjectURL(blob);
                console.log("✅ Blob URL Created:", blobURL);
    
                // ✅ Set video source to Blob URL
                video.src = blobURL;
                video.play();
    
                console.log("🎥 Playing chunk:", magnetURI);
    
                // ✅ Fetch the next chunk
                setTimeout(() => {
                    const nextMagnetURI = this.getNextMagnetURI(magnetURI);
                    if (nextMagnetURI) {
                        this.playChunk(nextMagnetURI);
                    } else {
                        console.log("✅ Stream Ended.");
                    }
                }, 5000);
            });
        });
    }

    /** ✅ Get Next Magnet URI from Broadcaster */
    private getNextMagnetURI(currentMagnetURI: string): string | null {
        return (window as any).broadcasterInstance?.getNextMagnetURI(currentMagnetURI) || null;
    }
}
