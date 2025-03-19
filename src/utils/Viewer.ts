import { Base } from "./Base";

export class Viewer extends Base {
    public async playStream(magnetURI: string): Promise<void> {
        this.client.add(magnetURI, async (torrent) => {
            console.log("✅ Torrent added:", torrent);

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

            console.log("🎥 Fetching Blob from File...");
            
            try {
                // ✅ Convert File to Blob
                const blob = await file.blob();
                
                // ✅ Convert Blob to Blob URL
                const blobURL = URL.createObjectURL(blob);
                
                console.log("✅ Blob URL Created:", blobURL);

                // ✅ Set video source to Blob URL
                video.src = blobURL;
                video.play();
            } catch (error) {
                console.error("❌ Error creating Blob URL:", error);
            }
        });
    }
}
