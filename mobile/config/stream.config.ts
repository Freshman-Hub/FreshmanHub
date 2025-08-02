import { StreamChat } from "stream-chat";

// Your Stream Chat credentials
const API_KEY = "a2k6q79n3dp3";

// Create Stream Chat client with proper configuration
export const chatClient = StreamChat.getInstance(API_KEY, {
  // Enable development mode for easier permissions
  enableInsights: false,
  enableWSFallback: false,
  warmUp: true,
  // Set timeout values
  timeout: 6000,
  // Browser/React Native specific options
  allowServerSideConnect: false,
});

// Configure client settings
chatClient.setBaseURL("https://chat.stream-io-api.com");

export const streamChatConfig = {
  apiKey: API_KEY,
  developmentMode: true,
};

export default chatClient;
