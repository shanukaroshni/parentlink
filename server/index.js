const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Serve the frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Store active sessions: sessionId -> { child, parent }
const sessions = {};

io.on('connection', (socket) => {
  console.log('Someone connected:', socket.id);

  // CHILD creates a session and gets a link to send to parent
  socket.on('create-session', () => {
    const sessionId = uuidv4();
    sessions[sessionId] = { child: socket.id, parent: null };
    socket.join(sessionId);
    socket.emit('session-created', { sessionId });
    console.log('Session created:', sessionId);
  });

  // PARENT joins by clicking the link
  socket.on('join-session', ({ sessionId }) => {
    const session = sessions[sessionId];
    if (!session) {
      socket.emit('error', { message: 'Session not found or expired.' });
      return;
    }
    session.parent = socket.id;
    socket.join(sessionId);
    // Tell the child that parent has joined
    io.to(session.child).emit('parent-joined', { sessionId });
    socket.emit('joined-session', { sessionId });
    console.log('Parent joined session:', sessionId);
  });

  // WebRTC signaling — pass messages between child and parent
  socket.on('signal', ({ sessionId, data }) => {
    // Forward signal to the other person in the session
    socket.to(sessionId).emit('signal', { data });
  });

  // Clean up when someone disconnects
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
  console.log(`ParentLink server running on port ${PORT}`);
});
