import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import io, { Socket } from "socket.io-client";

// Utility function to transform keys for Pusher
export const toPusherKey = (key: string) => key.replace(/:/g, "__");

// Socket.IO server access (server-side only)
export const socketIO = {
  getIO: () => {
    if (typeof window !== "undefined") {
      console.warn("Socket.io server access attempted on client-side");
      return null;
    }
    return (global as any)?.io || null;
  },
};

// Client-side socket management
let socketClient: Socket | null = null;
let reconnectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 10;
const RECONNECTION_DELAY = 1000;
let messageQueue: Array<{
  event: string;
  data: any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timestamp: number;
  retries: number;
}> = [];
let pendingOperations: Array<() => void> = [];
let pendingRoomOperations: Map<
  string,
  { action: "join" | "leave"; room: string }
> = new Map();
let connectionStatus:
  | "connecting"
  | "connected"
  | "disconnected"
  | "error"
  | "failed" = "connecting";
let reconnectTimer: NodeJS.Timeout | undefined;
let initializing = false;
let initPromise: Promise<Socket | null> | null = null;
const pendingMessages = new Map<
  string,
  {
    timeoutId: NodeJS.Timeout;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }
>();
const MESSAGE_TIMEOUT = 15000;

// Execute all pending operations when connected
const executePendingOperations = () => {
  if (!socketClient || !socketClient.connected) return;

  // Execute general operations
  while (pendingOperations.length > 0) {
    const operation = pendingOperations.shift();
    if (operation) {
      try {
        operation();
      } catch (error) {
        console.error("Error executing pending operation:", error);
      }
    }
  }

  // Execute room operations (join/leave)
  pendingRoomOperations.forEach((opInfo, id) => {
    try {
      console.log(
        `Executing pending room operation: ${opInfo.action} for room ${opInfo.room}`
      );
      if (!socketClient) {
        throw new Error("Socket client is not initialized");
      }
      socketClient.emit(
        `${opInfo.action}-room`,
        opInfo.room,
        (response: any) => {
          if (response?.success) {
            console.log(`Successfully ${opInfo.action}ed room: ${opInfo.room}`);
          } else {
            console.warn(`Failed to ${opInfo.action} room: ${opInfo.room}`);
          }
        }
      );
    } catch (error) {
      console.error(
        `Error executing ${opInfo.action} for room ${opInfo.room}:`,
        error
      );
    }
  });
  pendingRoomOperations.clear();
};

// Clean up socket listeners
const cleanupSocketListeners = (socket: Socket) => {
  if (!socket) return;
  socket.removeAllListeners();
};

// Process queued messages
const processMessageQueue = () => {
  if (!socketClient || !socketClient.connected || messageQueue.length === 0)
    return;
  console.log(`Processing ${messageQueue.length} queued messages`);
  while (messageQueue.length > 0) {
    const { event, data, resolve, reject, timestamp } = messageQueue.shift()!;
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      reject(new Error("Message expired"));
      continue;
    }
    try {
      socketClient.emit(event, data, (response: any) => {
        if (response?.success) {
          resolve(response);
        } else {
          reject(new Error(response?.error || "Failed to send message"));
        }
      });
    } catch (error) {
      reject(error);
      console.error("Error sending queued message:", error);
    }
  }
};

// Enhanced emit function
export const safeEmit = (
  event: string,
  data: any,
  callback?: (response: any) => void
) => {
  const socket = getSocketClient();
  if (!socket) {
    console.error(`Failed to get socket reference for emit: ${event}`);
    if (callback) callback({ success: false, error: "Socket not available" });
    return;
  }

  // Handle join/leave room operations
  if (event === "join-room" || event === "leave-room") {
    const opId = crypto.randomUUID();
    const action = event === "join-room" ? "join" : "leave";

    if (!socket.connected) {
      console.log(
        `Socket not connected, queueing ${action} room operation for ${data}`
      );
      pendingRoomOperations.set(opId, { action, room: data });
      return;
    }
  }

  // Emit immediately if connected
  if (socket.connected) {
    try {
      socket.emit(event, data, callback);
    } catch (error) {
      console.error(`Error emitting ${event}:`, error);
      if (callback) callback({ success: false, error: String(error) });
    }
  } else {
    console.log(`Socket not connected, queueing event: ${event}`);
    pendingOperations.push(() => {
      try {
        socket.emit(event, data, callback);
      } catch (error) {
        console.error(`Error emitting queued ${event}:`, error);
        if (callback) callback({ success: false, error: String(error) });
      }
    });
  }
};

// Send a message with retries and timeout
export const sendSocketMessage = (event: string, data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const messageObj = {
      event,
      data,
      resolve,
      reject,
      timestamp: Date.now(),
      retries: 0,
    };
    if (!socketClient || !socketClient.connected) {
      console.log(`Socket not connected, queuing ${event} message`);
      messageQueue.push(messageObj);
      if (!socketClient) initSocketClient();
      return;
    }
    try {
      const messageId = Date.now() + Math.random().toString(36).substring(2, 9);
      const timeoutId = setTimeout(() => {
        if (pendingMessages.has(messageId)) {
          pendingMessages.delete(messageId);
          if (messageObj.retries < 3) {
            messageObj.retries++;
            console.log(
              `Message timed out, queuing for retry (${messageObj.retries}/3)`
            );
            messageQueue.push(messageObj);
          } else {
            reject(new Error("Message failed after multiple retries"));
          }
        }
      }, MESSAGE_TIMEOUT);
      pendingMessages.set(messageId, { timeoutId, resolve, reject });
      socketClient.emit(event, data, (response: any) => {
        clearTimeout(timeoutId);
        pendingMessages.delete(messageId);
        response?.success
          ? resolve(response)
          : reject(new Error(response?.error || "Failed to send message"));
      });
    } catch (error) {
      reject(error);
      messageQueue.push(messageObj);
    }
  });
};

// Get the socket client instance
export const getSocketClient = (): Socket | null => {
  if (!socketClient && typeof window !== "undefined" && !initializing) {
    initSocketClient();
  }
  return socketClient;
};

// Initialize the socket client
export const initSocketClient = (): Promise<Socket | null> => {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    if (typeof window !== "undefined") {
      if (initializing) return resolve(socketClient);
      initializing = true;

      console.log("Initializing socket.io client");
      connectionStatus = "connecting";

      try {
        // Clean up any existing socket
        if (socketClient) {
          if (socketClient.connected) {
            socketClient.disconnect();
          }
          cleanupSocketListeners(socketClient);
          socketClient = null;
        }

        // Clear any existing reconnect timer
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = undefined;
        }

        // Create a new socket with optimized settings
        const appUrl =
          "http://100.26.203.210:3000" 
        //   || window.location.origin;
        // if (!appUrl) {
        //   throw new Error("NEXT_PUBLIC_APP_URL is not defined");
        // }

        // Use the most reliable configuration possible
        socketClient = io(appUrl, {
          path: "/api/socketio",
          reconnection: true,
          reconnectionAttempts: Infinity, // Never stop trying to reconnect
          reconnectionDelay: 1000, // Start with a 1 second delay
          reconnectionDelayMax: 5000, // Maximum 5 second delay between reconnections
          timeout: 20000, // Connection timeout
          autoConnect: true, // Connect automatically
          transports: ["polling", "websocket"], // Only use polling
          upgrade: true, // Never upgrade to websocket
          forceNew: false, // Reuse existing connections
          rejectUnauthorized: false, // Accept self-signed certificates
          query: {
            t: Date.now(), // Prevent caching
            EIO: "4", // Force Engine.IO v4
            transport: "polling", // Explicitly state transport
          },
          extraHeaders: {},
        });

        // Remember this socket client
        (window as any).__socketClient = socketClient;

        // Connection established
        socketClient.on("connect", () => {
          console.log("Socket connected successfully!", socketClient!.id);
          initializing = false;
          connectionStatus = "connected";
          reconnectionAttempts = 0;

          // Start a client-side ping to keep the connection alive
          const pingTimer = setInterval(() => {
            if (socketClient && socketClient.connected) {
              socketClient.emit("client-ping", { timestamp: Date.now() });
            } else {
              clearInterval(pingTimer);
            }
          }, 15000); // Every 15 seconds

          // Clear interval on disconnect
          socketClient?.once("disconnect", () => {
            clearInterval(pingTimer);
          });

          executePendingOperations();
          processMessageQueue();
          resolve(socketClient);
        });

        // Remove the server-ping handler to avoid duplication
        if (socketClient) {
          socketClient.off("server-ping");
        }

        // Connection errors
        socketClient.on("connect_error", (err: any) => {
          console.warn(`Socket connection error: ${err.message}`);
          initializing = false;
          connectionStatus = "error";

          // Don't count reconnection attempts - keep trying forever
          console.log(`Reconnecting after error...`);
        });

        // Check if the server is running on port 3000
        socketClient.listeners("connect_error").forEach((listener) => {
          console.log("Listener:", listener.toString());
          console.log("Listener name:", listener.name);
        });

        // Disconnection handler
        socketClient.on("disconnect", (reason: string) => {
          console.log(`Socket disconnected: ${reason}`);
          connectionStatus = "disconnected";

          // Clear pending messages on disconnect
          pendingMessages.forEach(({ timeoutId }) => clearTimeout(timeoutId));
          pendingMessages.clear();

          // Don't manually reconnect - let Socket.IO handle it
          console.log("Socket.IO will automatically attempt to reconnect");
        });
      } catch (error) {
        console.error("Failed to initialize socket client:", error);
        initializing = false;
        connectionStatus = "failed";
        reject(error);
      }
    } else {
      // Server-side, just resolve with null
      resolve(null);
    }
  });

  return initPromise;
};

// Get the current connection status
export const getConnectionStatus = () => connectionStatus;

// Manually reconnect the socket
export const reconnectSocket = () => {
  if (socketClient && connectionStatus !== "connecting") {
    console.log("Manually reconnecting socket...");
    connectionStatus = "connecting";
    socketClient.disconnect();
    setTimeout(() => {
      if (socketClient!.io?.opts) {
        socketClient!.io.opts.transports = ["websocket", "polling"];
      }
      socketClient!.connect();
    }, 1000);
  } else {
    initSocketClient();
  }
};
