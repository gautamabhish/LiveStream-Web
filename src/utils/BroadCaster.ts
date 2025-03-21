//@ts-nocheck
import { Base } from "./Base";

export class Broadcaster extends Base {
    private stream: MediaStream | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: BlobPart[] = [];
    private latestMagnetURI: string = "";
    private previousMagnetURI: string | null = null;
    private chunkMap: Map<string, string> = new Map(); // Stores next-chunk links

    constructor() {
        super();
    }

    /** ✅ Get Media Stream & Start Chunking */
    public async startStream(constraints: MediaStreamConstraints): Promise<string> {
        try {
            this.stopStream(); // ✅ Stop previous streams if running
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: "video/webm" });

            this.mediaRecorder.ondataavailable = async (event) => {
                this.chunks.push(event.data);

                if (this.chunks.length >= 5) {
                    const blob = new Blob(this.chunks, { type: "video/webm" });
                    this.chunks = [];
                    await this.seedVideoChunk(blob);
                }
            };

            this.mediaRecorder.start(1000); // ✅ Capture video every 1s
            console.log("🎥 Streaming started...");
            const video = document.getElementById("remoteVideo") as HTMLVideoElement;
            if(video){
                video.srcObject = this.stream;
            } 

            return new Promise((resolve) => {
                setTimeout(() => resolve(this.latestMagnetURI), 2000); // Return first link after 2s
            });
        } catch (error) {
            console.error("❌ Error accessing media devices.", error);
            throw error;
        }
    }

    /** ✅ Seed Video Chunks */
    private async seedVideoChunk(blob: Blob): Promise<void> {
        this.ensureClient();
        const fileName = `live_chunk_${Date.now()}.mp4`; 
        this.client.seed(blob,{name:fileName},(torrent) => {
            const magnetURI = torrent.magnetURI;

            // ✅ Store reference to next chunk
            if (this.previousMagnetURI) {
                this.chunkMap.set(this.previousMagnetURI, magnetURI);
            }

            this.previousMagnetURI = magnetURI;
            this.latestMagnetURI = magnetURI;

            console.log("🔹 Seeding chunk:", magnetURI);
        });
    }

    /** ✅ Stop Stream & Seeding */
    public stopStream(): void {
        console.log("🛑 Stopping stream...");

        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
        }

        if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
        }

        this.client?.destroy();
        this.latestMagnetURI = "";
    }

    /** ✅ Get Latest Magnet URI */
    public getFirstMagnetURI(): string {
        return this.latestMagnetURI;
    }

    /** ✅ Get Next Chunk URI */
    public getNextMagnetURI(currentMagnetURI: string): string | null {
        return this.chunkMap.get(currentMagnetURI) || null;
    }
}
