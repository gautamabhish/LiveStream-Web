import { Base } from "./Base";

export class BroadCaster extends Base{

    
    private latestMagnetURI:string ='';
   
    
    public seedVideoChunk = async (blob: Blob): Promise<void> => {
        this.client.seed(blob, (torrent:any) => {
            this.latestMagnetURI = torrent.magnetURI;
            console.log("🔹 Seeding chunk:", this.latestMagnetURI);
        });
    };


   
  

    public getLatestMagnetURI(): string {
        return this.latestMagnetURI;
    }
    
}