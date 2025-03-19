import { BroadCaster } from "./BroadCaster";

export class WebRtc {
    private brodcast: BroadCaster = new BroadCaster();
    private stream: MediaStream | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: BlobPart[] = []; // Store video chunks
    private latestMagnetURI: string = "";

    /** ✅ Get Media Stream & Start Chunking */
    public async getUsermedia(constraints): Promise<MediaStream> {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: "video/webm" });

            this.mediaRecorder.onstart = () => this.startChunking();
            this.mediaRecorder.start(1000); // Record in 1-second intervals

            return this.stream;
        } catch (error) {
            console.error("❌ Error accessing media devices.", error);
            throw error;
        }
    }

    /** ✅ Get List of Video & Audio Devices */
    public async getConnectedDevices(type: string): Promise<MediaDeviceInfo[]> {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === type);
    }

    /** ✅ Start Chunking & Seeding */
    private async startChunking(): Promise<void> {
        if (!this.mediaRecorder) {
            console.error("❌ MediaRecorder is not initialized.");
            return;
        }

        this.mediaRecorder.ondataavailable = async (event) => {
            this.chunks.push(event.data);

            if (this.chunks.length >= 5) {
                const blob = new Blob(this.chunks, { type: "video/webm" });
                this.chunks = [];

                // ✅ Ensure WebTorrent is restarted if needed
                await this.brodcast.seedVideoChunk(blob);
                this.latestMagnetURI = this.brodcast.getLatestMagnetURI();
            }
        };

        console.log("🎥 Chunking started...");
    }

    /** ✅ Stop Stream & WebTorrent */
    public stopStream(): void {
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
        }
        if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
        }

        this.brodcast.stopSeeding(); // ✅ Stop WebTorrent & allow reinitialization
    }

    /** ✅ Get Latest Magnet URI */
    public getLatestMagnetURI(): string {
        return this.latestMagnetURI;
    }
}
