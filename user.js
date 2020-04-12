class User {
    constructor(socket, isHost) {
        this.roomId = null;
        this.isHost = isHost;
        this.id = socket.id;
        this.createdAt = Date.now();
        this.nickname = this.genNickname();
        this.socket = socket;
        this.typing = false;
    }

    // Method
    // genId() {
    //     return Math.random().toString(16).slice(2);
    // }

    genNickname() {
        var animals = ["Cow", "Rabbit", "Duck", "Shrimp", "Pig", "Goat", "Crab", "Deer", "Bee", "Sheep", "Fish",
            "Turkey", "Dove", "Chicken", "Horse", "Dog", "Turtle", "Parrot", "Cat", "Mouse"
        ];

        var randIndex = Math.floor(Math.random() * animals.length);
        return "Anonymous " + animals[randIndex];
    }
}

module.exports = User;