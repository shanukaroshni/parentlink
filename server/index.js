const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// ICE servers including TURN relay so phones on Jio/Airtel/BSNL can connect
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  }
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, '../public')));

// Send ICE config to anyone who asks
app.get('/ice-config', (req, res) => {
  res.json({ iceServers: ICE_SERVERS });
});

const sessions = {};

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('create-session', () => {
    const sessionId = uuidv4();
    sessions[sessionId] = { child: socket.id, parent: null };
    socket.join(sessionId);
    socket.emit('session-created', { sessionId });
    console.log('Session created:', sessionId);
  });

  socket.on('join-session', ({ sessionId }) => {
    const session = sessions[sessionId];
    if (!session) {
      socket.emit('error', { message: 'Session not found or expired.' });
      return;
    }
    session.parent = socket.id;
    socket.join(sessionId);
    io.to(session.child).emit('parent-joined', { sessionId });
    socket.emit('joined-session', { sessionId });
    console.log('Parent joined:', sessionId);
  });

  socket.on('signal', ({ sessionId, data }) => {
    socket.to(sessionId).emit('signal', { data });
  });

  socket.on('disconnect', () => {
    for (const [sessionId, session] of Object.entries(sessions)) {
      if (session.child === socket.id || session.parent === socket.id) {
        io.to(sessionId).emit('peer-disconnected');
        delete sessions[sessionId];
        console.log('Session ended:', sessionId);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ParentLink running on port ${PORT}`);
});