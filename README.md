# 📡 WebTorrent Live Streaming

A **decentralized live streaming platform** using **WebRTC + WebTorrent**.  
This project enables **serverless, peer-to-peer (P2P) live streaming** where **broadcasters** can stream video, and **viewers** can watch using only a `magnet:` link.  

🚀 **No central server! No WebSockets! Just pure P2P streaming.**  

---

## **🎯 Features**
✅ **Live streaming over WebTorrent** (no need to download full video)  
✅ **Completely decentralized** (DHT-based peer discovery, no servers)  
✅ **Viewers help distribute the stream** (like torrents)  
✅ **Seamless playback while downloading** (WebTorrent exposes streams)  
✅ **Browser-only solution** (React + Vite + WebTorrent)  

---

## **🛠️ Technologies Used**
- **WebTorrent** → P2P streaming using `magnet:` links  
- **WebRTC** → Captures & shares live video  
- **MediaRecorder API** → Converts streams into WebM chunks  
- **DHT (Distributed Hash Table)** → Finds peers without a central server  
- **React + Vite** → Frontend for streaming & viewing  

---

## **📌 How It Works**
### **1️⃣ Broadcaster: Start a Live Stream**
1. Captures **video** using WebRTC  
2. **Chunks** it into **5-second WebM files**  
3. **Seeds each chunk via WebTorrent**  
4. Shares a `magnet:` link for viewers  

### **2️⃣ Viewer: Watch a Live Stream**
1. **Finds peers using DHT** (no need for a server)  
2. Fetches the **latest video chunks**  
3. **Streams while downloading** (no waiting)  

---

## **🚀 Getting Started**
### **1️⃣ Install Dependencies**
```sh
npm install
