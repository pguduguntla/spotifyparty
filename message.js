class Message {
    constructor(roomId, senderId, content) {
        this.senderId = senderId;
        this.roomId = roomId;
        this.createdAt = Date.now();
        this.content = content;       
    }
}

module.exports = Message;