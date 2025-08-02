const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { StreamChat } = require("stream-chat");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));

// Initialize Stream Chat Server Client
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY || "a2k6q79n3dp3",
  process.env.STREAM_API_SECRET ||
    "kquh6j25ec9znfyruymtvwqqvb8bmdjup89h5ngrc2dz3gv745g6wnnqm4pdfygk"
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Create or update a single user
app.post("/api/stream/users", async (req, res) => {
  try {
    const userData = req.body;

    if (!userData.id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    console.log(`🔄 Creating/updating user: ${userData.name || userData.id}`);

    const response = await serverClient.upsertUser(userData);

    console.log(
      `✅ Successfully upserted user: ${userData.name || userData.id}`
    );

    res.json({
      success: true,
      user: response.users[userData.id],
      message: "User created/updated successfully",
    });
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create or update multiple users (batch)
app.post("/api/stream/users/batch", async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Users array is required and must not be empty",
      });
    }

    if (users.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Maximum 100 users allowed per batch",
      });
    }

    console.log(`🔄 Creating/updating ${users.length} users in batch`);

    const response = await serverClient.upsertUsers(users);

    console.log(`✅ Successfully upserted ${users.length} users`);

    res.json({
      success: true,
      users: response.users,
      count: users.length,
      message: "Users created/updated successfully",
    });
  } catch (error) {
    console.error("❌ Error creating users in batch:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all users with pagination
app.get("/api/stream/users", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    console.log(`🔄 Fetching users (limit: ${limit}, offset: ${offset})`);

    const response = await serverClient.queryUsers(
      {},
      { created_at: -1 },
      { limit, offset }
    );

    console.log(`✅ Fetched ${response.users.length} users`);

    res.json({
      success: true,
      users: response.users,
      count: response.users.length,
      pagination: {
        limit,
        offset,
        hasMore: response.users.length === limit,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a specific user by ID
app.get("/api/stream/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`🔄 Fetching user: ${userId}`);

    const response = await serverClient.queryUsers({ id: userId });

    if (response.users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    console.log(`✅ Found user: ${userId}`);

    res.json({
      success: true,
      user: response.users[0],
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a user
app.delete("/api/stream/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { markMessagesDeleted = true } = req.body;

    console.log(`🔄 Deleting user: ${userId}`);

    const response = await serverClient.deleteUser(userId, {
      mark_messages_deleted: markMessagesDeleted,
    });

    console.log(`✅ Successfully deleted user: ${userId}`);

    res.json({
      success: true,
      message: "User deleted successfully",
      user: response.user,
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update the sync endpoint - find this section and replace it:

// Sync Firebase users to Stream Chat
app.post("/api/stream/sync/firebase", async (req, res) => {
  try {
    const { firebaseUsers } = req.body;

    if (!Array.isArray(firebaseUsers)) {
      return res.status(400).json({
        success: false,
        error: "firebaseUsers array is required",
      });
    }

    console.log(`🔄 Starting sync of ${firebaseUsers.length} Firebase users`);

    // Get existing Stream users
    const existingResponse = await serverClient.queryUsers(
      {},
      {},
      { limit: 100 }
    );
    const existingIds = new Set(existingResponse.users.map((u) => u.id));

    // Filter users that need to be created
    const usersToCreate = firebaseUsers.filter(
      (user) => !existingIds.has(user.id)
    );

    if (usersToCreate.length === 0) {
      return res.json({
        success: true,
        message: "All Firebase users already exist in Stream Chat",
        stats: {
          total: firebaseUsers.length,
          alreadyExisted: firebaseUsers.length,
          created: 0,
          failed: 0,
        },
      });
    }

    // Helper function to map Firebase roles to Stream Chat roles
    const mapRole = (firebaseRole) => {
      const roleMapping = {
        'freshman': 'user',        // Map freshman to user
        'continuous': 'user',         // Map student to user
        'peer_coach': 'user', // Map peer_coach to moderator
          'admin': 'admin',          // Keep admin as admin
          'buddy': 'user',          // Map buddy to user
        'head_of_coach': 'moderator', // Map head_of_coach to moderator
      };
      
      return roleMapping[firebaseRole] || 'user'; // Default to 'user' if role not found
    };

    // Convert Firebase users to Stream format
    const streamUsers = usersToCreate.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      image: user.profileImage || undefined,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      gender: user.gender,
      role: mapRole(user.role), // Use mapped role instead of original
      originalRole: user.role,  // Store original role as custom field
      studentId: user.studentId,
      yearGroup: user.yearGroup,
      major: user.major,
      department: user.department,
      created_at: new Date().toISOString(),
      source: "firebase_sync",
    }));

    console.log(`🔄 Creating ${usersToCreate.length} new users in Stream Chat...`);
    console.log(`📋 Role mappings applied:`);
    const roleCounts = {};
    streamUsers.forEach(user => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });
    console.log(roleCounts);

    // Create users in batches of 100
    let successCount = 0;
    let failedCount = 0;
    const batchSize = 100;

    for (let i = 0; i < streamUsers.length; i += batchSize) {
      const batch = streamUsers.slice(i, i + batchSize);

      try {
        console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}...`);
        await serverClient.upsertUsers(batch);
        successCount += batch.length;
        console.log(
          `✅ Batch ${Math.floor(i / batchSize) + 1}: Created ${
            batch.length
          } users`
        );
      } catch (error) {
        failedCount += batch.length;
        console.error(
          `❌ Batch ${Math.floor(i / batchSize) + 1} failed:`,
          error.message
        );
        
        // Log which users failed for debugging
        console.log(`📋 Failed batch users:`, batch.map(u => ({
          id: u.id,
          name: u.name,
          role: u.role,
          originalRole: u.originalRole
        })));
      }
    }

    console.log(
      `📊 Sync complete: ${successCount} created, ${failedCount} failed`
    );

    res.json({
      success: true,
      message: "Firebase sync completed",
      stats: {
        total: firebaseUsers.length,
        alreadyExisted: firebaseUsers.length - usersToCreate.length,
        created: successCount,
        failed: failedCount,
      },
    });
  } catch (error) {
    console.error("❌ Error syncing Firebase users:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Generate user token (for testing)
app.post("/api/stream/token", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const token = serverClient.createToken(userId);

    res.json({
      success: true,
      token,
      userId,
    });
  } catch (error) {
    console.error("❌ Error generating token:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("❌ Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler - fix the wildcard route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
