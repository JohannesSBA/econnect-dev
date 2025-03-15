const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);



// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log('Next.js app prepared');
  
  const server = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      
      // Handle WebSocket upgrade requests separately
      if (parsedUrl.pathname === '/api/socketio' && req.headers.upgrade === 'websocket') {
        // Socket.io will handle this itself through its middleware
        console.log('WebSocket upgrade request detected, letting Socket.io handle it');
        // Don't do anything here, socket.io will catch this later
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

  // We need to set up the WebSocket server BEFORE initializing Socket.io
  // This ensures we correctly handle upgrades
  server.on('upgrade', (req, socket, head) => {
    const parsedUrl = parse(req.url, true);
    
    // Check if this is a Socket.IO request - note that Socket.IO requests have the EIO query parameter
    if (parsedUrl.pathname === '/api/socketio' || 
        (parsedUrl.pathname.startsWith('/api/socketio') && parsedUrl.query.EIO)) {
      console.log('Socket.IO WebSocket upgrade request detected');
      // Let Socket.io handle this
      // We don't do anything here, as we let the io instance initialize below handle it
    } else {
      console.log(`Non-Socket.IO WebSocket request to ${parsedUrl.pathname}, closing connection`);
      // For non-socket.io WebSocket connections, close them
      socket.destroy();
    }
  });

  // Initialize Socket.io server with more reliable settings
  const io = new Server(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: '*',  // Allow any origin for maximum compatibility
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true
    },
    connectTimeout: 300000,               // 5 minutes connection timeout
    transports: ['polling'],              // Only use polling for maximum reliability
    pingInterval: 30000,                  // Ping every 30 seconds
    pingTimeout: 180000,                  // Very long ping timeout (3 minutes)
    allowUpgrades: false,                 // Never upgrade to WebSocket
    perMessageDeflate: false,             // Disable compression
    httpCompression: false,
    maxHttpBufferSize: 1e8,               // 100MB buffer size
    cookie: false,                        // No cookies
    // Basic options only - remove complex settings
    serveClient: false
  });
  
  // Store io instance globally to be accessible from other modules
  global.io = io;
  
  // Log successful Socket.io initialization
  console.log('Socket.io server initialized with WebSocket support');
  
  // Add middleware for tracking connections
  io.use((socket, next) => {
    const clientId = socket.id;
    console.log(`Socket connection attempt: ${clientId}`);
    
    // Add connection timestamp for debugging
    socket.connectionTime = new Date().toISOString();
    
    // Add client info for better debugging
    const clientInfo = {
      id: socket.id,
      transport: socket.conn.transport.name,
      remoteAddress: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent'] || 'unknown',
      time: socket.connectionTime
    };
    
    console.log(`New socket connection: ${JSON.stringify(clientInfo)}`);
    
    // Disable all timeouts
    if (socket.conn) {
      // Track connection details in socket object
      socket.transportName = socket.conn.transport.name;
      socket.handshakeTime = socket.handshake.issued;
      
      // Disable ping timeout on transport
      if (socket.conn.transport) {
        try {
          socket.conn.transport.removeAllListeners('close');
          socket.conn.transport.on('close', (reason) => {
            console.log(`Transport close intercepted for ${socket.id}, reason: ${reason}`);
            // Don't do anything - this prevents automatic disconnection
          });
          
          // Set a longer ping timeout
          if (socket.conn.transport.pingTimeoutTimer) {
            clearTimeout(socket.conn.transport.pingTimeoutTimer);
          }
        } catch (e) {
          console.error('Error disabling transport close:', e);
        }
      }
    }
    
    // Custom error handler
    socket.on("connect_error", (err) => {
      console.error(`Socket ${clientId} connect error:`, err.message);
    });
    
    next();
  });
  
  // Set up event handlers
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} at ${socket.connectionTime}`);
    
    // Disable all automatic socket timeouts
    if (socket.conn) {
      try {
        // Disable automatic disconnect
        if (socket.conn.transport) {
          socket.conn.transport.removeAllListeners('close');
          socket.conn.transport.on('close', () => {
            console.log(`Transport close event intercepted for ${socket.id}`);
          });
        }
      } catch (err) {
        console.error('Error disabling timeouts:', err);
      }
    }

    // Handle client pings
    socket.on('client-ping', (data) => {
      // Respond with pong
      socket.emit('server-pong', {
        timestamp: data.timestamp,
        serverTime: Date.now()
      });
    });

    // Track active rooms for this socket for cleanup
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
    
    // Add a ping event to keep connections alive
    socket.on('ping', (callback) => {
      socket.emit('pong');
      if (typeof callback === 'function') callback();
    });
    
    // Handle disconnection with room cleanup
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
      
      // Clean up all rooms this socket was in
      activeRooms.forEach(room => {
        try {
          socket.leave(room);
        } catch (error) {
          console.error(`Error leaving room ${room} during disconnect:`, error);
        }
      });
      
      // Log attempt to reconnect
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

  // Listen on the specified port
  try {
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
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
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please try a different port or close the application using port ${port}.`);
      process.exit(1);
    } else {
      console.error('Error starting server:', err);
      process.exit(1);
    }
  }
}); 