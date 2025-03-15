import prisma from "@/app/lib/prisma";
import { socketIO, toPusherKey } from "@/app/lib/socket";
import { chatHrefConstructor } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import jwt from "jsonwebtoken";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    console.log("this is body", body);

    if (!body.text) {
      return new Response("Message text is required", { status: 400 });
    }

    // Authenticate user
    let userId: string;
    
    if (body.from !== "mobile") {
      const session = await getServerSession(options);
      if (!session) return new Response("Unauthorized", { status: 401 });

      if (!body.text) {
        return new Response("Message text is required", { status: 400 });
      }

      if (
        session.user.id !== body.chatId &&
        session.user.id !== body.chatPartner
      ) {
        return new Response("Unauthorized", { status: 401 });
      }
      
      userId = session.user.id;
    } else {
      const token = req.headers.get("Authorization");
      if (!token) {
        return new Response("Unauthorized", { status: 401 });
      }
      const authToken = token.split(" ")[1];
      try {
        const decoded = jwt.verify(
          authToken,
          process.env.NEXTAUTH_SECRET as string
        ) as { userId: string };
        
        if (!decoded) {
          return new Response("Unauthorized", { status: 401 });
        }

        userId = decoded.userId;
        if (userId !== body.chatId && userId !== body.chatPartner) {
          return new Response("Unauthorized", { status: 401 });
        }
      } catch (jwtError) {
        console.error("JWT verification error:", jwtError);
        return new Response("Invalid authentication token", { status: 401 });
      }
    }
    
    const timeStamp = new Date().toISOString();

    // Get sender information
    const user = await getUserContent(body.chatId);

    // Check if the user is authorized to send a message
    if (user.role === "employee") {
      const stringifiedFriends = JSON.stringify(user.friends);
      if (!stringifiedFriends.includes(body.chatPartner)) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    // Create the message object
    const messageData: {
      text: string;
      senderId: string;
      recipientId: string;
      createdAt: string;
      deliveredAt: string;
      senderImg: string;
      senderName: string;
      id?: string; // Make id optional since it's added later
    } = {
      text: body.text,
      senderId: body.chatId,
      recipientId: body.chatPartner,
      createdAt: timeStamp,
      deliveredAt: timeStamp,
      senderImg: `https://econnectbucket.s3.amazonaws.com/image/${user.id}`,
      senderName: user.fullName,
    };

    // Save message to database
    const newMessage = await prisma.message.create({
      data: {
        text: messageData.text,
        senderId: messageData.senderId,
        recipientId: messageData.recipientId,
      },
    });
    
    // Update message data with database ID
    messageData.id = newMessage.id;

    // Create notification
    const messageNotification = `$asq!${messageData.senderId}message-${
      messageData.text
    }$user!${user.firstName + " " + user.lastName}`;
    
    await prisma.notification.create({
      data: {
        content: messageNotification,
        userId: messageData.recipientId,
      },
    });

    console.log("Message saved:", newMessage.id);

    // Get chat room ID and formatted room keys
    const chatRoom = body.chatRoom;
    const formattedChatRoom = toPusherKey(`chat:${chatRoom}`);
    const formattedUserChannel = toPusherKey(`user:${messageData.recipientId}:chats`);

    // Try to send real-time notifications via Socket.io
    let socketSuccess = false;
    try {
      const io = socketIO.getIO();
      if (io) {
        // Emit to chat room
        io.to(formattedChatRoom).emit('incoming-message', messageData);
        
        // Emit to recipient's user channel
        io.to(formattedUserChannel).emit('new_message', messageData);
        
        socketSuccess = true;
      } else {
        console.warn("Socket.io server not initialized. Message will be retrieved on next connection.");
      }
    } catch (socketError) {
      console.error("Socket.io emission error:", socketError);
      // Socket error shouldn't prevent successful response since message is in the database
    }

    // Send push notification if available
    let pushSuccess = false;
    try {
      const recipient = await prisma.user.findUnique({
        where: { id: body.chatPartner },
        select: { expoPushToken: true },
      });

      if (recipient?.expoPushToken) {
        const senderId = body.chatId;
        const message = body.text;

        await axios.post(
          "https://exp.host/--/api/v2/push/send",
          {
            to: recipient.expoPushToken,
            sound: "default",
            title: `${user.firstName}`,
            body: message,
            data: { senderId, message },
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        pushSuccess = true;
        console.log("✅ Push notification sent successfully");
      }
    } catch (pushError) {
      console.error("❌ Failed to send push notification:", pushError);
      // Push notification error shouldn't prevent successful response
    }

    // Return success response with delivery status information
    return new Response(
      JSON.stringify({
        message: newMessage,
        delivery: {
          socket: socketSuccess,
          push: pushSuccess
        }
      }), 
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
