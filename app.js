const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const socketio = require('socket.io');
const {ensureAuthenticated} = require('./config/auth');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const chatAppName = 'ChatBot';
const Room = require('./models/Rooms');
const Session = require('./models/Session');
const sequelize = require('sequelize');
const sequielizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

const io = socketio(server);


require('./config/passport')(passport);

const db = require('./config/database');
const ChatMessages = require('./models/ChatMessages');

app.use(express.json())
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));

// Express session

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new sequielizeStore({
      db: db,
      table: 'Session',
      checkExpirationInterval: 15 * 60 * 1000,
      expiration: 24 * 60 * 60 * 1000
    })
  })
);

db.authenticate().then(() => {
  console.log('Database connected...');
}).catch(err => {
  console.log('Error: ', err);
});


app.use(passport.initialize());
app.use(passport.session())

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/chat', require('./routes/chat'));
app.use('/dashboard', require('./routes/dashboard'));


app.use(ensureAuthenticated);
// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(chatAppName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(chatAppName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    console.log(user);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
    Room.findOne({where: {title: user.room}}).then(room => {
      ChatMessages.create({
        room_id: room.id,
        username: user.username,
        text: msg
      });
    }).catch(err => {
      console.log(err);
    })
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(chatAppName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});


