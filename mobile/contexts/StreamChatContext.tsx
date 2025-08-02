import { chatClient } from "@/config/stream.config";
import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "./UserContext";

interface StreamChatContextType {
  client: StreamChat | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const StreamChatContext = createContext<StreamChatContextType>({
  client: null,
  isConnected: false,
  isLoading: true,
  error: null,
});

export const useStreamChat = () => {
  const context = useContext(StreamChatContext);
  if (!context) {
    throw new Error("useStreamChat must be used within StreamChatProvider");
  }
  return context;
};

interface StreamChatProviderProps {
  children: React.ReactNode;
}

export function StreamChatProvider({ children }: StreamChatProviderProps) {
  const { user, isAuthenticated } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const connectUser = async () => {
      if (!isAuthenticated || !user) {
        console.log(
          "🔄 User not authenticated, skipping Stream Chat connection"
        );
        setIsLoading(false);
        setIsConnected(false);
        return;
      }

      // Don't connect if already connected to same user
      if (
        chatClient.userID === user.id &&
        chatClient.wsConnection?.isConnected
      ) {
        console.log("✅ Already connected to Stream Chat for user:", user.id);
        setIsConnected(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log("🔄 Connecting to Stream Chat for user:", user.id);

        // Disconnect if already connected to different user
        if (chatClient.userID && chatClient.userID !== user.id) {
          console.log("🔄 Disconnecting previous user:", chatClient.userID);
          await chatClient.disconnectUser();
        }

        // Generate development token (client-side)
        const token = chatClient.devToken(user.id);

        // Connect user to Stream Chat with MINIMAL user data
        await chatClient.connectUser(
          {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            image: user.profileImage || undefined,
            // Don't set role - let Stream Chat use default 'user' role
          },
          token
        );

        if (mounted) {
          setIsConnected(true);
          console.log("✅ Successfully connected to Stream Chat");
        }
      } catch (err: any) {
        console.error("❌ Failed to connect to Stream Chat:", err);
        if (mounted) {
          setError(`Connection failed: ${err.message || "Unknown error"}`);
          setIsConnected(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const disconnectUser = async () => {
      if (chatClient.userID) {
        try {
          console.log("🔄 Disconnecting from Stream Chat");
          await chatClient.disconnectUser();
          if (mounted) {
            setIsConnected(false);
          }
          console.log("✅ Successfully disconnected from Stream Chat");
        } catch (err) {
          console.error("⚠️ Error during Stream Chat disconnection:", err);
          // Force state update even if disconnect fails
          if (mounted) {
            setIsConnected(false);
          }
        }
      }
    };

    if (isAuthenticated && user) {
      connectUser();
    } else {
      disconnectUser();
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id]);

  // Handle connection state changes
  useEffect(() => {
    const handleConnectionChanged = (event: any) => {
      console.log(
        "🔄 Stream Chat connection changed:",
        event.type,
        event.online
      );
      setIsConnected(event.online);
      if (event.online) {
        setError(null);
      }
    };

    const handleConnectionRecovered = () => {
      console.log("✅ Stream Chat connection recovered");
      setIsConnected(true);
      setError(null);
    };

    const handleConnectionFailed = (event: any) => {
      console.error("❌ Stream Chat connection failed:", event.error);
      setIsConnected(false);
      setError("Connection failed");
    };

    // Listen to connection events
    chatClient.on("connection.changed", handleConnectionChanged);
    chatClient.on("connection.recovered", handleConnectionRecovered);
    chatClient.on("connection.failed", handleConnectionFailed);

    return () => {
      chatClient.off("connection.changed", handleConnectionChanged);
      chatClient.off("connection.recovered", handleConnectionRecovered);
      chatClient.off("connection.failed", handleConnectionFailed);
    };
  }, []);

  const contextValue: StreamChatContextType = {
    client: chatClient,
    isConnected,
    isLoading,
    error,
  };

  return (
    <StreamChatContext.Provider value={contextValue}>
      {children}
    </StreamChatContext.Provider>
  );
}
