var State = Object.freeze({
    PAUSED: 0,
    PLAYING: 1
});

class Room {
    constructor() {
        this.id = this.genId();
        this.hostId = null;
        this.members = [];
        this.createdAt = Date.now();
        this.capacity = 20;
        this.messages = []; //List of message objects
        this.state = State.PAUSED;
    }

    // Method
    genId() {
        return Math.random().toString(36).slice(2);
    }

    addMember(userId) {
        if (!this.isFull()) {
            this.members.push(userId);
        }
    }

    removeMember(userId) {
        var index = this.members.indexOf(userId);
        if (index > -1) {
            this.members.splice(index, 1);
        }
    }

    addMessage(message) {
        this.messages.push(message);
    }

    isEmpty() {
        return this.members.length == 0;
    }

    getSize() {
        return this.members.length;
    }

    isFull() {
        return this.members.length == this.capacity;
    }
}

module.exports = Room;