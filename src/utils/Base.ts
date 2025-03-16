//@ts-nocheck
import WebTorrent from "webtorrent"

export class Base {
    public  client : WebTorrent.Instance = new WebTorrent();
    
};