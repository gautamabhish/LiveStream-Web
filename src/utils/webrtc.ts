//@ts-nocheck
import { BroadCaster } from "./BroadCaster";
export class WebRtc {

    private brodcast:BroadCaster = new BroadCaster();

    private stream: MediaStream | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: BlobPart[] = []; // Store video chunks


    public async getUsermedia(constraints): Promise<MediaStream> {
        try {
            this.stream= await navigator.mediaDevices.getUserMedia(constraints);
            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: "video/webm" });
            this.startChunking();
            return this.brodcast.getLatestMagnetURI();    
        } catch (error) {
            console.error('Error accessing media devices.', error);
            throw error;
        }
    }

    public async startChunking(): Promise<void> {
        if (!this.mediaRecorder) {
            console.error("MediaRecorder is not initialized.");
            return;
        }

        this.mediaRecorder.ondataavailable = async (event) => {
            this.chunks.push(event.data);

            // Every 5 chunks (~5 seconds), convert to a Blob & seed
            if (this.chunks.length >= 5) {
                const blob = new Blob(this.chunks, { type: "video/webm" });
                this.chunks = []; // Clear for next segment

                // Send chunk to WebTorrent
                await this.brodcast.seedVideoChunk(blob);
            }
        };

        this.mediaRecorder.start(1000); // Record in 1-second intervals
        console.log("Chunking started...");
    }


    

    public stopStream(): void {
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
            this.stream = null;
        }
    }
    public getLatestMagnetURI(): string {
        return this.brodcast.getLatestMagnetURI();
    }

    
}