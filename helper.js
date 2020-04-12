var Room = require('./room');
var User = require('./user');

var createRoom = (hostId, existingRooms) => {
    var room = new Room(hostId);

    while (existingRooms.hasOwnProperty(room.id)) {
      room.id = room.genId();
    }

    return room;
};

var createUser = (socket, isHost, existingUsers) => {
    var user = new User(socket, isHost);

    // while (existingUsers.hasOwnProperty(user.id)) {
    //   user.id = user.genId();
    // }

    return user;
};

module.exports = {
    createRoom,
    createUser
};