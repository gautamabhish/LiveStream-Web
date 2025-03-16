import { Base } from "./Base";

export class Viewer extends Base {
    public playStream(magnetURI: string): void {
        this.client.add(magnetURI, (torrent) => {
            const file = torrent.files.find((file) => file.name.endsWith(".mp4") || file.name.endsWith(".webm"));

            if (!file) {
                console.error("❌ No video files found in torrent.");
                return;
            }

            const videoElement = document.getElementById("remoteVideo") as HTMLVideoElement;
            if (!videoElement) {
                console.error("❌ Video element not found!");
                return;
            }

            const mediaSource = new MediaSource();
            videoElement.src = URL.createObjectURL(mediaSource);

            // ✅ Wait for `sourceopen` event using a Promise
            new Promise<void>((resolve) => {
                mediaSource.addEventListener("sourceopen", () => {
                    console.log("✅ MediaSource is now open.");
                    resolve();
                });
            }).then(() => {
                const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9"');
                console.log("✅ SourceBuffer added successfully.");

                const stream = file.createReadStream();

                // ✅ Append data only when `sourceBuffer` is ready
                stream.on("data", (chunk: Buffer) => {
                    if (!sourceBuffer.updating && mediaSource.readyState === "open") {
                        try {
                            sourceBuffer.appendBuffer(new Uint8Array(chunk));
                            console.log('chunking');
                        } catch (error) {
                            console.error("❌ appendBuffer() error:", error);
                        }
                    }
                });

                stream.on("end", () => {
                    if (mediaSource.readyState === "open") {
                        mediaSource.endOfStream();
                        console.log("✅ Streaming finished.");
                    }
                });
            });

            // ✅ Handle media source errors
            mediaSource.addEventListener("error", (err) => {
                console.error("❌ MediaSource error:", err);
            });
        });
    }
}
