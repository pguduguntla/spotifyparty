var createError = require('http-errors');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Message = require('./message');
var { createUser, createRoom, getUserBySocketId } = require('./helper');

var indexRouter = require('./routes/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

var rooms = {};
var users = {};

io.on('connection', function(socket){
  
  socket.on('createRoom', function(data, callback) {
    console.log('a user connected');

    var user = createUser(socket, true, users); // isHost = true, user id = socket.id
    var room = createRoom(user.id, rooms); // Creates empty room

    room.hostId = user.id; // Set the room host to the host who created the room.
    user.roomId = room.id; // Set the room id of this user to to the created room.

    rooms[room.id] = room; // Add room to global rooms
    users[user.id] = user; // Add user to global users

    socket.join(room.id);
    io.to(room.id).emit('message', 'Created new room with id: ' + room.id);

  });

  socket.on('joinRoom', function(data, callback) {
    var { roomId } = data; // The room id to join

    if (!rooms.hasOwnProperty(roomId)) {
      // Invalid room id error (room doesn't exist)
      callback({error: 'Room ' + roomId + " does not exist."});

      return;

    }

    if (rooms[roomId].isFull()) {
      // Then, we need to send a message back saying it's full.
      callback({ error: "Room " + room.id + "is full!" });
      return;
    }

    var user = createUser(socket, false, users); // isHost = false
    user.roomId = roomId; // Set the room id of this user who is joining the specified room.

    // Generate a unique random nickname in the room.
    var existingNicknames = room.members.map(id => users[id].nickname);
    while (!existingNicknames.includes(user.nickname)) {
      user.nickname = user.genNickname();
    }
    
    rooms[roomId].addMember(user.id); //Add this user to the room

    socket.join(roomId);
    io.to(roomId).emit('message', "User " + user.id + " joined room with id: " + room.id);

  });

  socket.on('closeRoom', function(data, callback) {
    var user = users[socket.id];

    io.sockets.clients(user.roomId).forEach(function(s){
      s.leave(user.roomId);
    });

    delete rooms[user.roomId];
    delete users[socket.id];

  });

  socket.on('disconnect', function(data){

    console.log('user disconnected');

    var user = users[socket.id];

    if (user == null) {
      console.log({ error: 'User ' + socket.id + " does not exist."});
      return;
    }

    var room = rooms[user.roomId];
    
    if (user.isHost) {
       // If the host leaves, but there are still people in the room.

      if (!room.isEmpty()) {
        room.hostId = room.members[0]; // Set the second member to join to be the new host.
      }

      // If the room is just empty AND the host is leaving too, then delete the room.
      delete rooms[user.roomId];

    } else {
      // If the user leaving is not a host, then we just remove that user from the room.
      room.removeMember(user.id);
    }

    io.to(user.roomId).emit('message', 'User ' + user.id + " left room with id: " + user.roomId);

    // Delete the user from the global users.
    delete users[user.id];
    
  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

module.exports = app;
