const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

// Environment variables
const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0'; // Use '0.0.0.0' for production
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log('Next.js app prepared');

  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      // Handle WebSocket upgrade requests
      if (parsedUrl.pathname === '/api/socketio' && req.headers.upgrade === 'websocket') {
        console.log('WebSocket upgrade request detected, letting Socket.io handle it');
        return;
      }

      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Handle WebSocket upgrades
  server.on('upgrade', (req, socket, head) => {
    const parsedUrl = parse(req.url, true);

    // Check if this is a Socket.IO request
    if (parsedUrl.pathname === '/api/socketio' || (parsedUrl.pathname.startsWith('/api/socketio') && parsedUrl.query.EIO)) {
      console.log('Socket.IO WebSocket upgrade request detected');
    } else {
      console.log(`Non-Socket.IO WebSocket request to ${parsedUrl.pathname}, closing connection`);
      socket.destroy();
    }
  });

  // Initialize Socket.io server
  const io = new Server(server, {
    path: '/api/socketio',
    cors: {
      origin: '*', // Allow all origins (or specify your domain)
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
    },
    transports: ['polling', 'websocket'], // Enable both polling and WebSocket
    pingInterval: 30000, // Ping every 30 seconds
    pingTimeout: 180000, // 3-minute timeout
    cookie: false, // Disable cookies
  });

  // Store io instance globally
  global.io = io;

  // Log successful Socket.io initialization
  console.log('Socket.io server initialized with WebSocket support');

  // Middleware for tracking connections
  io.use((socket, next) => {
    const clientId = socket.id;
    console.log(`Socket connection attempt: ${clientId}`);

    // Add connection timestamp for debugging
    socket.connectionTime = new Date().toISOString();

    // Log client info
    const clientInfo = {
      id: socket.id,
      transport: socket.conn.transport.name,
      remoteAddress: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent'] || 'unknown',
      time: socket.connectionTime,
    };
    console.log(`New socket connection: ${JSON.stringify(clientInfo)}`);

    // Custom error handler
    socket.on('connect_error', (err) => {
      console.error(`Socket ${clientId} connect error:`, err.message);
    });

    next();
  });

  // Event handlers
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} at ${socket.connectionTime}`);

    // Handle client pings
    socket.on('client-ping', (data) => {
      socket.emit('server-pong', {
        timestamp: data.timestamp,
        serverTime: Date.now(),
      });
    });

    // Track active rooms for cleanup
    const activeRooms = new Set();

    // Handle chat room subscription
    socket.on('join-room', (room) => {
      try {
        if (!room || typeof room !== 'string') {
          console.error(`Invalid room format: ${room}`);
          socket.emit('error', { message: 'Invalid room format' });
          return;
        }

        socket.join(room);
        activeRooms.add(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);

        // Acknowledge successful join
        socket.emit('room-joined', { room });
      } catch (error) {
        console.error(`Error joining room ${room}:`, error);
        socket.emit('error', { message: `Failed to join room: ${error.message}` });
      }
    });

    // Handle leaving chat room
    socket.on('leave-room', (room) => {
      try {
        if (!room || typeof room !== 'string') {
          console.error(`Invalid room format: ${room}`);
          return;
        }

        socket.leave(room);
        activeRooms.delete(room);
        console.log(`Socket ${socket.id} left room: ${room}`);
      } catch (error) {
        console.error(`Error leaving room ${room}:`, error);
      }
    });

    // Handle message events with ack
    socket.on('send-message', (data, ack) => {
      try {
        if (!data || !data.chatRoom || !data.messageData) {
          console.error('Invalid message data format:', data);
          if (typeof ack === 'function') ack({ success: false, error: 'Invalid message format' });
          return;
        }

        // Broadcast to all clients in the room
        io.to(data.chatRoom).emit('incoming-message', data.messageData);

        // Notify recipient of new message
        if (data.messageData.recipientId) {
          const recipientRoom = `user:${data.messageData.recipientId}`;
          io.to(recipientRoom).emit('new_message', data.messageData);
        }

        // Acknowledge successful send
        if (typeof ack === 'function') ack({ success: true });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
        if (typeof ack === 'function') ack({ success: false, error: error.message });
      }
    });

    // Handle message read events with ack
    socket.on('mark-as-read', (data, ack) => {
      try {
        if (!data || !data.chatRoom) {
          console.error('Invalid read receipt data:', data);
          if (typeof ack === 'function') ack({ success: false, error: 'Invalid data format' });
          return;
        }

        io.to(data.chatRoom).emit('message-read', {
          userId: data.userId,
          messageId: data.messageId,
        });

        // Acknowledge successful mark as read
        if (typeof ack === 'function') ack({ success: true });
      } catch (error) {
        console.error('Error marking message as read:', error);
        if (typeof ack === 'function') ack({ success: false, error: error.message });
      }
    });

    // Handle disconnection with room cleanup
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);

      // Clean up all rooms this socket was in
      activeRooms.forEach((room) => {
        try {
          socket.leave(room);
        } catch (error) {
          console.error(`Error leaving room ${room} during disconnect:`, error);
        }
      });

      console.log(`Client will attempt to reconnect automatically`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket ${socket.id} error:`, error);
    });
  });

  // Handle server-side errors
  io.engine.on('connection_error', (err) => {
    console.error('Connection error:', err);
  });

  // Start the server
  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('> Socket.io server initialized at startup');
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}).catch((err) => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
});