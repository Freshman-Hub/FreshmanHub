import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
// TODO: Uncomment when implementing image uploads
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
import { db } from "../firebase/config/firebaseConfig";
// TODO: Import storage when implementing image uploads
// import { db, storage } from "../firebase/config/firebaseConfig";
import { Post, Comment, CreatePostData, Reply } from "../types/post.types";
import { cleanFirestoreData } from "../utils/firebase.utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_POSTS_SYNC_KEY = "lastPostsSync";
const LAST_COMMENTS_SYNC_KEY = "lastCommentsSync";

export class PostsService {
  private static sqliteDb: any = null;

  // Initialize SQLite context (call this from your component that has access to useSQLiteContext)
  static setSQLiteContext(db: any) {
    this.sqliteDb = db;
  }

  // Get last sync timestamp from AsyncStorage
  private static async getLastSyncTime(
    type: "posts" | "comments"
  ): Promise<string | null> {
    try {
      const key =
        type === "posts" ? LAST_POSTS_SYNC_KEY : LAST_COMMENTS_SYNC_KEY;
      const value = await AsyncStorage.getItem(key);
      console.log(`📅 Last ${type} sync time:`, value || "First time sync");
      return value;
    } catch (error) {
      console.error(`Error getting last ${type} sync time:`, error);
      return null;
    }
  }

  // Update last sync timestamp
  private static async updateLastSyncTime(
    type: "posts" | "comments",
    timestamp: string
  ): Promise<void> {
    try {
      const key =
        type === "posts" ? LAST_POSTS_SYNC_KEY : LAST_COMMENTS_SYNC_KEY;
      await AsyncStorage.setItem(key, timestamp);
      console.log(`✅ Updated last ${type} sync time to:`, timestamp);
    } catch (error) {
      console.error(`Error updating last ${type} sync time:`, error);
    }
  }

  // Convert Firestore Timestamps to ISO strings
  private static convertTimestampToISO(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();

    try {
      // If it's a Firestore Timestamp with seconds and nanoseconds
      if (typeof timestamp === "object" && timestamp.seconds !== undefined) {
        const milliseconds =
          timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000;
        return new Date(milliseconds).toISOString();
      }
      // If it's already an ISO string
      else if (typeof timestamp === "string") {
        return timestamp;
      }
      // If it's a JavaScript Date
      else if (timestamp instanceof Date) {
        return timestamp.toISOString();
      }
      // If it has a toDate method (Firestore Timestamp)
      else if (timestamp.toDate) {
        return timestamp.toDate().toISOString();
      }

      return new Date().toISOString(); // fallback
    } catch (error) {
      console.warn("Error converting timestamp:", error);
      return new Date().toISOString();
    }
  }

  // Sync posts from Firebase to SQLite
  private static async syncPostsFromFirebase(): Promise<{
    posts: Post[];
    error: string | null;
  }> {
    try {
      console.log("🔄 Starting posts sync from Firebase...");

      const lastSync = await this.getLastSyncTime("posts");
      let firebaseQuery;

      if (lastSync) {
        console.log("📥 Fetching posts updated after:", lastSync);
        firebaseQuery = query(
          collection(db, "posts"),
          where("updatedAt", ">", lastSync),
          orderBy("updatedAt", "asc")
        );
      } else {
        console.log("📥 First time sync - fetching all posts from Firebase");
        firebaseQuery = query(
          collection(db, "posts"),
          orderBy("updatedAt", "asc")
        );
      }

      const querySnapshot = await getDocs(firebaseQuery);
      const posts: Post[] = [];

      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as Post);
      });

      console.log(`🔥 Firebase returned ${posts.length} posts`);

      // Insert/update posts in SQLite
      if (posts.length > 0 && this.sqliteDb) {
        for (const post of posts) {
          await this.insertOrUpdatePostInSQLite(post);
        }

        // Update last sync time with the latest post's updatedAt
        const latestPost = posts[posts.length - 1];
        if (latestPost.updatedAt) {
          await this.updateLastSyncTime("posts", latestPost.updatedAt);
        }
      }

      return { posts, error: null };
    } catch (error: any) {
      console.error("❌ Error syncing posts from Firebase:", error);
      return { posts: [], error: error.message };
    }
  }

  // Insert or update post in SQLite
  private static async insertOrUpdatePostInSQLite(post: Post): Promise<void> {
    if (!this.sqliteDb) {
      console.warn("⚠️ SQLite context not available");
      return;
    }

    try {
      // Convert timestamps to ISO strings
      const convertedPost = {
        ...post,
        createdAt: this.convertTimestampToISO(post.createdAt),
        updatedAt: this.convertTimestampToISO(post.updatedAt),
      };

      // Check if post exists
      const existingPost = await this.sqliteDb.getFirstAsync(
        "SELECT id FROM posts WHERE id = ?",
        [post.id]
      );

      if (existingPost) {
        // Update existing post
        await this.sqliteDb.runAsync(
          `UPDATE posts SET 
           content = ?, image = ?, category = ?, userDisplayName = ?, userAvatar = ?, 
           userYear = ?, userVerified = ?, likes = ?, comments = ?, shares = ?, 
           likedBy = ?, updatedAt = ?
           WHERE id = ?`,
          [
            convertedPost.content,
            convertedPost.image || null,
            convertedPost.category,
            convertedPost.userDisplayName,
            convertedPost.userAvatar || null,
            convertedPost.userYear || null,
            convertedPost.userVerified ? 1 : 0,
            convertedPost.likes,
            convertedPost.comments,
            convertedPost.shares,
            JSON.stringify(convertedPost.likedBy),
            convertedPost.updatedAt,
            convertedPost.id,
          ]
        );
        console.log(`🔄 Updated post ${convertedPost.id} in SQLite`);
      } else {
        // Insert new post
        await this.sqliteDb.runAsync(
          `INSERT INTO posts (
            id, content, image, category, userId, userDisplayName, userAvatar, 
            userYear, userVerified, likes, comments, shares, likedBy, 
            createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            convertedPost.id,
            convertedPost.content,
            convertedPost.image || null,
            convertedPost.category,
            convertedPost.userId,
            convertedPost.userDisplayName,
            convertedPost.userAvatar || null,
            convertedPost.userYear || null,
            convertedPost.userVerified ? 1 : 0,
            convertedPost.likes,
            convertedPost.comments,
            convertedPost.shares,
            JSON.stringify(convertedPost.likedBy),
            convertedPost.createdAt,
            convertedPost.updatedAt,
          ]
        );
        console.log(`➕ Inserted new post ${convertedPost.id} into SQLite`);
      }
    } catch (error) {
      console.error(
        `❌ Error inserting/updating post ${post.id} in SQLite:`,
        error
      );
    }
  }

  // Insert or update comment in SQLite
  private static async insertOrUpdateCommentInSQLite(
    postId: string,
    comment: Comment
  ): Promise<void> {
    if (!this.sqliteDb) {
      console.warn("⚠️ SQLite context not available");
      return;
    }

    try {
      // Convert timestamps to ISO strings
      const convertedComment = {
        ...comment,
        createdAt: this.convertTimestampToISO(comment.createdAt),
        updatedAt: this.convertTimestampToISO(comment.updatedAt),
      };

      // Check if comment exists
      const existingComment = await this.sqliteDb.getFirstAsync(
        "SELECT id FROM comments WHERE id = ?",
        [comment.id]
      );

      if (existingComment) {
        // Update existing comment
        await this.sqliteDb.runAsync(
          `UPDATE comments SET 
           content = ?, userDisplayName = ?, userAvatar = ?, likes = ?, 
           likedBy = ?, updatedAt = ?
           WHERE id = ?`,
          [
            convertedComment.content,
            convertedComment.userDisplayName,
            convertedComment.userAvatar || null,
            convertedComment.likes,
            JSON.stringify(convertedComment.likedBy),
            convertedComment.updatedAt,
            convertedComment.id,
          ]
        );
        console.log(`🔄 Updated comment ${convertedComment.id} in SQLite`);
      } else {
        // Insert new comment
        await this.sqliteDb.runAsync(
          `INSERT INTO comments (
            id, postId, content, userId, userDisplayName, userAvatar, 
            likes, likedBy, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            convertedComment.id,
            postId,
            convertedComment.content,
            convertedComment.userId,
            convertedComment.userDisplayName,
            convertedComment.userAvatar || null,
            convertedComment.likes,
            JSON.stringify(convertedComment.likedBy),
            convertedComment.createdAt,
            convertedComment.updatedAt,
          ]
        );
        console.log(
          `➕ Inserted new comment ${convertedComment.id} into SQLite`
        );
      }

      // Handle replies
      if (convertedComment.replies && convertedComment.replies.length > 0) {
        for (const reply of convertedComment.replies) {
          await this.insertOrUpdateReplyInSQLite(convertedComment.id, reply);
        }
      }
    } catch (error) {
      console.error(
        `❌ Error inserting/updating comment ${comment.id} in SQLite:`,
        error
      );
    }
  }

  // Insert or update reply in SQLite
  private static async insertOrUpdateReplyInSQLite(
    commentId: string,
    reply: Reply
  ): Promise<void> {
    if (!this.sqliteDb) {
      console.warn("⚠️ SQLite context not available");
      return;
    }

    try {
      // Convert timestamps to ISO strings
      const convertedReply = {
        ...reply,
        createdAt: this.convertTimestampToISO(reply.createdAt),
      };

      // Check if reply exists
      const existingReply = await this.sqliteDb.getFirstAsync(
        "SELECT id FROM replies WHERE id = ?",
        [reply.id]
      );

      if (existingReply) {
        // Update existing reply
        await this.sqliteDb.runAsync(
          `UPDATE replies SET 
           content = ?, userDisplayName = ?, userAvatar = ?, likes = ?, isLiked = ?
           WHERE id = ?`,
          [
            convertedReply.content,
            convertedReply.userDisplayName,
            convertedReply.userAvatar || null,
            convertedReply.likes || 0,
            convertedReply.isLiked ? 1 : 0,
            convertedReply.id,
          ]
        );
        console.log(`🔄 Updated reply ${convertedReply.id} in SQLite`);
      } else {
        // Insert new reply
        await this.sqliteDb.runAsync(
          `INSERT INTO replies (
            id, commentId, content, userId, userDisplayName, userAvatar, 
            likes, isLiked, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            convertedReply.id,
            commentId,
            convertedReply.content,
            convertedReply.userId,
            convertedReply.userDisplayName,
            convertedReply.userAvatar || null,
            convertedReply.likes || 0,
            convertedReply.isLiked ? 1 : 0,
            convertedReply.createdAt,
          ]
        );
        console.log(`➕ Inserted new reply ${convertedReply.id} into SQLite`);
      }
    } catch (error) {
      console.error(
        `❌ Error inserting/updating reply ${reply.id} in SQLite:`,
        error
      );
    }
  }

  // Get posts from SQLite
  private static async getPostsFromSQLite(
    limitCount: number = 10,
    lastPostId?: string
  ): Promise<{ posts: Post[]; error: string | null }> {
    try {
      if (!this.sqliteDb) {
        console.warn(
          "⚠️ SQLite context not available, falling back to Firebase"
        );
        return await this.getAllPostsFromFirebase(limitCount, lastPostId);
      }

      console.log("💾 Fetching posts from SQLite...");

      let query = "SELECT * FROM posts ORDER BY createdAt DESC LIMIT ?";
      let params: any[] = [limitCount];

      if (lastPostId) {
        // For pagination, get posts older than the last post
        const lastPost = await this.sqliteDb.getFirstAsync(
          "SELECT createdAt FROM posts WHERE id = ?",
          [lastPostId]
        );

        if (lastPost) {
          query =
            "SELECT * FROM posts WHERE createdAt < ? ORDER BY createdAt DESC LIMIT ?";
          params = [lastPost.createdAt, limitCount];
        }
      }

      const result = await this.sqliteDb.getAllAsync(query, params);

      const posts: Post[] = result.map((row: any) => ({
        id: row.id,
        content: row.content,
        image: row.image,
        category: row.category,
        userId: row.userId,
        userDisplayName: row.userDisplayName,
        userAvatar: row.userAvatar,
        userYear: row.userYear,
        userVerified: row.userVerified === 1,
        likes: row.likes,
        comments: row.comments,
        shares: row.shares,
        likedBy: row.likedBy ? JSON.parse(row.likedBy) : [],
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));

      console.log(`💾 SQLite returned ${posts.length} posts`);
      return { posts, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching posts from SQLite:", error);
      console.log("🔄 Falling back to Firebase...");
      return await this.getAllPostsFromFirebase(limitCount, lastPostId);
    }
  }

  // Get all posts from Firebase (fallback)
  private static async getAllPostsFromFirebase(
    limitCount: number = 10,
    lastPostId?: string
  ): Promise<{ posts: Post[]; error: string | null }> {
    try {
      console.log("🔥 Fetching posts from Firebase (fallback)...");

      let q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      if (lastPostId) {
        const lastPostDoc = await getDoc(doc(db, "posts", lastPostId));
        q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastPostDoc),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      console.log(`🔥 Firebase returned ${posts.length} posts (fallback)`);
      return { posts, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching posts from Firebase:", error);
      return { posts: [], error: error.message };
    }
  }

  // Create a new post (SQLite first, then Firebase)
  static async createPost(
    postData: CreatePostData,
    imageUri?: string // TODO: Remove this parameter when not using images, or keep for future use
  ): Promise<{ post: Post | null; error: string | null }> {
    try {
      const now = new Date().toISOString();
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // TODO: Implement image upload functionality
      // let imageUrl = null;
      // Upload image if provided
      // if (imageUri) {
      //   const imageRef = ref(storage, `posts/${Date.now()}_${Math.random()}`);
      //   const response = await fetch(imageUri);
      //   const blob = await response.blob();
      //   await uploadBytes(imageRef, blob);
      //   imageUrl = await getDownloadURL(imageRef);
      // }

      // Create clean post document without undefined values
      const newPost: Post = {
        id: tempId,
        ...postData,
        likes: 0,
        comments: 0,
        shares: 0,
        likedBy: [],
        createdAt: now,
        updatedAt: now,
      };

      // 1. Save to SQLite first (with temp ID)
      if (this.sqliteDb) {
        await this.insertOrUpdatePostInSQLite(newPost);
        console.log(`💾 Post ${newPost.id} saved to SQLite with temp ID`);
      }

      // 2. Then save to Firebase
      try {
        const firebasePost = { ...newPost };
        delete (firebasePost as any).id; // Remove temp ID for Firebase

        const docRef = await addDoc(
          collection(db, "posts"),
          cleanFirestoreData(firebasePost)
        );
        const finalPost = {
          ...newPost,
          id: docRef.id,
        };

        // 3. Update SQLite with real Firebase ID
        if (this.sqliteDb) {
          // Delete temp post
          await this.sqliteDb.runAsync("DELETE FROM posts WHERE id = ?", [
            tempId,
          ]);
          // Insert with real ID
          await this.insertOrUpdatePostInSQLite(finalPost);
          console.log(
            `🔥 Post ${finalPost.id} synced to Firebase and updated in SQLite`
          );
        }

        return { post: finalPost, error: null };
      } catch (firebaseError) {
        console.error(
          "❌ Firebase sync failed, post remains in SQLite only:",
          firebaseError
        );
        // Post is still available locally
        return { post: newPost, error: null };
      }
    } catch (error: any) {
      console.error("Create post error:", error);
      return { post: null, error: error.message };
    }
  }

  // Get all posts with pagination (with sync and local fallback)
  static async getPosts(
    limitCount = 10,
    lastPostId?: string
  ): Promise<{ posts: Post[]; error: string | null }> {
    try {
      // First sync from Firebase (only new/updated posts)
      const syncResult = await this.syncPostsFromFirebase();
      if (syncResult.error) {
        console.warn(
          "Sync failed, proceeding with local data:",
          syncResult.error
        );
      }

      // Then return posts from SQLite (with Firebase fallback)
      return await this.getPostsFromSQLite(limitCount, lastPostId);
    } catch (error: any) {
      console.error("Get posts error:", error);
      // Final fallback to Firebase
      return await this.getAllPostsFromFirebase(limitCount, lastPostId);
    }
  }

  // Get single post by ID (tries SQLite first, then Firebase)
  static async getPost(
    postId: string
  ): Promise<{ post: Post | null; error: string | null }> {
    try {
      // Try SQLite first
      if (this.sqliteDb) {
        console.log(`💾 Fetching post ${postId} from SQLite...`);
        const result = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM posts WHERE id = ?",
          [postId]
        );

        if (result) {
          const post: Post = {
            id: result.id,
            content: result.content,
            image: result.image,
            category: result.category,
            userId: result.userId,
            userDisplayName: result.userDisplayName,
            userAvatar: result.userAvatar,
            userYear: result.userYear,
            userVerified: result.userVerified === 1,
            likes: result.likes,
            comments: result.comments,
            shares: result.shares,
            likedBy: result.likedBy ? JSON.parse(result.likedBy) : [],
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          };
          console.log(`💾 Found post ${postId} in SQLite`);
          return { post, error: null };
        }
      }

      // Fallback to Firebase
      console.log(`🔥 Fetching post ${postId} from Firebase (fallback)...`);
      const postDoc = await getDoc(doc(db, "posts", postId));

      if (!postDoc.exists()) {
        return { post: null, error: "Post not found" };
      }

      const post = {
        id: postDoc.id,
        ...postDoc.data(),
      } as Post;

      // Cache in SQLite for next time
      if (this.sqliteDb) {
        await this.insertOrUpdatePostInSQLite(post);
      }

      console.log(`🔥 Found post ${postId} in Firebase (cached to SQLite)`);
      return { post, error: null };
    } catch (error: any) {
      console.error("Get post error:", error);
      return { post: null, error: error.message };
    }
  }

  // Like/unlike a post (SQLite first, then Firebase)
  static async toggleLike(
    postId: string,
    userId: string
  ): Promise<{ error: string | null }> {
    try {
      // 1. Update SQLite first
      if (this.sqliteDb) {
        const existingPost = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM posts WHERE id = ?",
          [postId]
        );

        if (existingPost) {
          const likedBy = existingPost.likedBy
            ? JSON.parse(existingPost.likedBy)
            : [];
          const isLiked = likedBy.includes(userId);

          let newLikedBy: string[];
          let newLikes: number;

          if (isLiked) {
            // Unlike
            newLikedBy = likedBy.filter((id: string) => id !== userId);
            newLikes = Math.max(0, existingPost.likes - 1);
          } else {
            // Like
            newLikedBy = [...likedBy, userId];
            newLikes = existingPost.likes + 1;
          }

          await this.sqliteDb.runAsync(
            `UPDATE posts SET likes = ?, likedBy = ?, updatedAt = ? WHERE id = ?`,
            [
              newLikes,
              JSON.stringify(newLikedBy),
              new Date().toISOString(),
              postId,
            ]
          );
          console.log(`💾 Updated like for post ${postId} in SQLite`);
        }
      }

      // 2. Then update Firebase
      try {
        const postRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postRef);

        if (!postDoc.exists()) {
          return { error: "Post not found" };
        }

        const postData = postDoc.data();
        const likedBy = postData.likedBy || [];
        const isLiked = likedBy.includes(userId);

        if (isLiked) {
          // Unlike
          await updateDoc(postRef, {
            likes: increment(-1),
            likedBy: arrayRemove(userId),
            updatedAt: new Date().toISOString(),
          });
        } else {
          // Like
          await updateDoc(postRef, {
            likes: increment(1),
            likedBy: arrayUnion(userId),
            updatedAt: new Date().toISOString(),
          });
        }
        console.log(`🔥 Updated like for post ${postId} in Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase like update failed:", firebaseError);
        // Like is still updated locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Toggle like error:", error);
      return { error: error.message };
    }
  }

  // Add comment to post (SQLite first, then Firebase)
  static async addComment(
    postId: string,
    commentData: {
      content: string;
      userId: string;
      userDisplayName: string;
      userAvatar?: string;
    }
  ): Promise<{ comment: Comment | null; error: string | null }> {
    try {
      const now = new Date().toISOString();
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newComment: Comment = {
        id: tempId,
        ...commentData,
        likes: 0,
        likedBy: [],
        replies: [],
        createdAt: now,
        updatedAt: now,
      };

      // 1. Save to SQLite first (with temp ID)
      if (this.sqliteDb) {
        await this.insertOrUpdateCommentInSQLite(postId, newComment);
        // Increment comment count on post
        await this.sqliteDb.runAsync(
          "UPDATE posts SET comments = comments + 1, updatedAt = ? WHERE id = ?",
          [now, postId]
        );
        console.log(`💾 Comment ${newComment.id} saved to SQLite with temp ID`);
      }

      // 2. Then save to Firebase
      try {
        const firebaseComment = { ...newComment };
        delete (firebaseComment as any).id; // Remove temp ID for Firebase

        const docRef = await addDoc(
          collection(db, "posts", postId, "comments"),
          firebaseComment
        );

        // Increment comment count on post
        await updateDoc(doc(db, "posts", postId), {
          comments: increment(1),
          updatedAt: now,
        });

        const finalComment = {
          ...newComment,
          id: docRef.id,
        };

        // 3. Update SQLite with real Firebase ID
        if (this.sqliteDb) {
          // Delete temp comment
          await this.sqliteDb.runAsync("DELETE FROM comments WHERE id = ?", [
            tempId,
          ]);
          // Insert with real ID
          await this.insertOrUpdateCommentInSQLite(postId, finalComment);
          console.log(
            `🔥 Comment ${finalComment.id} synced to Firebase and updated in SQLite`
          );
        }

        return { comment: finalComment, error: null };
      } catch (firebaseError) {
        console.error(
          "❌ Firebase sync failed, comment remains in SQLite only:",
          firebaseError
        );
        // Comment is still available locally
        return { comment: newComment, error: null };
      }
    } catch (error: any) {
      console.error("Add comment error:", error);
      return { comment: null, error: error.message };
    }
  }

  // Get comments for a post (tries SQLite first, then Firebase)
  static async getComments(
    postId: string
  ): Promise<{ comments: Comment[]; error: string | null }> {
    try {
      // Try SQLite first
      if (this.sqliteDb) {
        console.log(`💾 Fetching comments for post ${postId} from SQLite...`);
        const result = await this.sqliteDb.getAllAsync(
          "SELECT * FROM comments WHERE postId = ? ORDER BY createdAt DESC",
          [postId]
        );

        if (result.length >= 0) {
          // Even if 0 comments, use SQLite result
          const comments: Comment[] = [];

          for (const row of result) {
            // Get replies for this comment
            const repliesResult = await this.sqliteDb.getAllAsync(
              "SELECT * FROM replies WHERE commentId = ? ORDER BY createdAt ASC",
              [row.id]
            );

            const replies: Reply[] = repliesResult.map((replyRow: any) => ({
              id: replyRow.id,
              content: replyRow.content,
              userId: replyRow.userId,
              userDisplayName: replyRow.userDisplayName,
              userAvatar: replyRow.userAvatar,
              likes: replyRow.likes,
              isLiked: replyRow.isLiked === 1,
              createdAt: replyRow.createdAt,
            }));

            comments.push({
              id: row.id,
              content: row.content,
              userId: row.userId,
              userDisplayName: row.userDisplayName,
              userAvatar: row.userAvatar,
              likes: row.likes,
              likedBy: row.likedBy ? JSON.parse(row.likedBy) : [],
              replies,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
            });
          }

          console.log(`💾 Found ${comments.length} comments in SQLite`);
          return { comments, error: null };
        }
      }

      // Fallback to Firebase
      console.log(
        `🔥 Fetching comments for post ${postId} from Firebase (fallback)...`
      );
      const q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      // Cache comments in SQLite
      if (this.sqliteDb && comments.length > 0) {
        for (const comment of comments) {
          await this.insertOrUpdateCommentInSQLite(postId, comment);
        }
      }

      console.log(`🔥 Found ${comments.length} comments in Firebase`);
      return { comments, error: null };
    } catch (error: any) {
      console.error("Get comments error:", error);
      return { comments: [], error: error.message };
    }
  }

  // Like/unlike a comment (SQLite first, then Firebase)
  static async toggleCommentLike(
    postId: string,
    commentId: string,
    userId: string
  ): Promise<{ error: string | null }> {
    try {
      // 1. Update SQLite first
      if (this.sqliteDb) {
        const existingComment = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM comments WHERE id = ?",
          [commentId]
        );

        if (existingComment) {
          const likedBy = existingComment.likedBy
            ? JSON.parse(existingComment.likedBy)
            : [];
          const isLiked = likedBy.includes(userId);

          let newLikedBy: string[];
          let newLikes: number;

          if (isLiked) {
            // Unlike
            newLikedBy = likedBy.filter((id: string) => id !== userId);
            newLikes = Math.max(0, existingComment.likes - 1);
          } else {
            // Like
            newLikedBy = [...likedBy, userId];
            newLikes = existingComment.likes + 1;
          }

          await this.sqliteDb.runAsync(
            `UPDATE comments SET likes = ?, likedBy = ?, updatedAt = ? WHERE id = ?`,
            [
              newLikes,
              JSON.stringify(newLikedBy),
              new Date().toISOString(),
              commentId,
            ]
          );
          console.log(`💾 Updated like for comment ${commentId} in SQLite`);
        }
      }

      // 2. Then update Firebase
      try {
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        const commentDoc = await getDoc(commentRef);

        if (!commentDoc.exists()) {
          return { error: "Comment not found" };
        }

        const commentData = commentDoc.data();
        const likedBy = commentData.likedBy || [];
        const isLiked = likedBy.includes(userId);

        if (isLiked) {
          // Unlike
          await updateDoc(commentRef, {
            likes: increment(-1),
            likedBy: arrayRemove(userId),
            updatedAt: new Date().toISOString(),
          });
        } else {
          // Like
          await updateDoc(commentRef, {
            likes: increment(1),
            likedBy: arrayUnion(userId),
            updatedAt: new Date().toISOString(),
          });
        }
        console.log(`🔥 Updated like for comment ${commentId} in Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase comment like update failed:", firebaseError);
        // Like is still updated locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Toggle comment like error:", error);
      return { error: error.message };
    }
  }

  // Search posts (SQLite first, then Firebase)
  static async searchPosts(
    searchQuery: string,
    category?: string
  ): Promise<{ posts: Post[]; error: string | null }> {
    try {
      // Try SQLite first
      if (this.sqliteDb) {
        console.log(`💾 Searching posts for '${searchQuery}' in SQLite...`);

        let query = `
          SELECT * FROM posts 
          WHERE (content LIKE ? OR userDisplayName LIKE ? OR category LIKE ?)
        `;
        let params = [
          `%${searchQuery}%`,
          `%${searchQuery}%`,
          `%${searchQuery}%`,
        ];

        if (category && category !== "All") {
          query += " AND category = ?";
          params.push(category);
        }

        query += " ORDER BY createdAt DESC";

        const result = await this.sqliteDb.getAllAsync(query, params);

        if (result.length >= 0) {
          // Even if 0 results, use SQLite
          const posts: Post[] = result.map((row: any) => ({
            id: row.id,
            content: row.content,
            image: row.image,
            category: row.category,
            userId: row.userId,
            userDisplayName: row.userDisplayName,
            userAvatar: row.userAvatar,
            userYear: row.userYear,
            userVerified: row.userVerified === 1,
            likes: row.likes,
            comments: row.comments,
            shares: row.shares,
            likedBy: row.likedBy ? JSON.parse(row.likedBy) : [],
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          }));

          console.log(`💾 Found ${posts.length} posts in SQLite search`);
          return { posts, error: null };
        }
      }

      // Fallback to Firebase
      console.log(
        `🔥 Searching posts for '${searchQuery}' in Firebase (fallback)...`
      );
      let q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

      if (category && category !== "All") {
        q = query(
          collection(db, "posts"),
          where("category", "==", category),
          orderBy("createdAt", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      let posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      // Filter by search query (client-side for now)
      if (searchQuery) {
        posts = posts.filter(
          (post) =>
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.userDisplayName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      console.log(`🔥 Found ${posts.length} posts in Firebase search`);
      return { posts, error: null };
    } catch (error: any) {
      console.error("Search posts error:", error);
      return { posts: [], error: error.message };
    }
  }

  // Delete post (SQLite first, then Firebase)
  static async deletePost(postId: string): Promise<{ error: string | null }> {
    try {
      // 1. Delete from SQLite first
      if (this.sqliteDb) {
        // Delete all replies first
        await this.sqliteDb.runAsync(
          "DELETE FROM replies WHERE commentId IN (SELECT id FROM comments WHERE postId = ?)",
          [postId]
        );
        // Delete all comments
        await this.sqliteDb.runAsync("DELETE FROM comments WHERE postId = ?", [
          postId,
        ]);
        // Delete the post
        await this.sqliteDb.runAsync("DELETE FROM posts WHERE id = ?", [
          postId,
        ]);
        console.log(`💾 Deleted post ${postId} from SQLite`);
      }

      // 2. Then delete from Firebase
      try {
        // Delete all comments in the post first
        const commentsRef = collection(db, "posts", postId, "comments");
        const commentsSnapshot = await getDocs(commentsRef);

        // Delete all comments
        const deleteCommentsPromises = commentsSnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(deleteCommentsPromises);

        // Delete the post document
        await deleteDoc(doc(db, "posts", postId));
        console.log(`🔥 Deleted post ${postId} from Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase delete failed:", firebaseError);
        // Post is still deleted locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Delete post error:", error);
      return { error: error.message };
    }
  }

  // Edit post (SQLite first, then Firebase)
  static async editPost(
    postId: string,
    updateData: {
      content?: string;
      category?: string;
      image?: string;
    }
  ): Promise<{ error: string | null }> {
    try {
      const cleanUpdateData: any = {
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(cleanUpdateData).forEach((key) => {
        if (cleanUpdateData[key] === undefined) {
          delete cleanUpdateData[key];
        }
      });

      // 1. Update SQLite first
      if (this.sqliteDb) {
        const updateFields = Object.keys(cleanUpdateData)
          .map((key) => `${key} = ?`)
          .join(", ");
        const updateValues = Object.values(cleanUpdateData);

        await this.sqliteDb.runAsync(
          `UPDATE posts SET ${updateFields} WHERE id = ?`,
          [...updateValues, postId]
        );
        console.log(`💾 Updated post ${postId} in SQLite`);
      }

      // 2. Then update Firebase
      try {
        await updateDoc(doc(db, "posts", postId), cleanUpdateData);
        console.log(`🔥 Updated post ${postId} in Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase update failed:", firebaseError);
        // Changes are still saved locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Edit post error:", error);
      return { error: error.message };
    }
  }

  // Add reply to a comment (SQLite first, then Firebase)
  static async addReply(
    postId: string,
    commentId: string,
    replyData: {
      content: string;
      userId: string;
      userDisplayName: string;
      userAvatar?: string;
    }
  ): Promise<{ reply: Reply | null; error: string | null }> {
    try {
      const now = new Date().toISOString();
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create clean reply data without undefined values
      const newReply: Reply = {
        id: tempId,
        content: replyData.content,
        userId: replyData.userId,
        userDisplayName: replyData.userDisplayName,
        userAvatar: replyData.userAvatar,
        likes: 0,
        isLiked: false,
        createdAt: now,
      };

      // 1. Save to SQLite first (with temp ID)
      if (this.sqliteDb) {
        await this.insertOrUpdateReplyInSQLite(commentId, newReply);
        console.log(`💾 Reply ${newReply.id} saved to SQLite with temp ID`);
      }

      // 2. Then save to Firebase
      try {
        // Add reply to comment's replies array
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        const firebaseReply = {
          id: Date.now().toString(), // Simple ID for Firebase
          content: replyData.content,
          userId: replyData.userId,
          userDisplayName: replyData.userDisplayName,
          likes: 0,
          isLiked: false,
          createdAt: now,
        };

        // Only add userAvatar if it exists and is not empty
        if (replyData.userAvatar && replyData.userAvatar.trim() !== "") {
          (firebaseReply as any).userAvatar = replyData.userAvatar;
        }

        await updateDoc(commentRef, {
          replies: arrayUnion(firebaseReply),
          updatedAt: now,
        });

        const finalReply = {
          ...newReply,
          id: firebaseReply.id,
        };

        // 3. Update SQLite with real Firebase ID
        if (this.sqliteDb) {
          // Delete temp reply
          await this.sqliteDb.runAsync("DELETE FROM replies WHERE id = ?", [
            tempId,
          ]);
          // Insert with real ID
          await this.insertOrUpdateReplyInSQLite(commentId, finalReply);
          console.log(
            `🔥 Reply ${finalReply.id} synced to Firebase and updated in SQLite`
          );
        }

        return { reply: finalReply, error: null };
      } catch (firebaseError) {
        console.error(
          "❌ Firebase sync failed, reply remains in SQLite only:",
          firebaseError
        );
        // Reply is still available locally
        return { reply: newReply, error: null };
      }
    } catch (error: any) {
      console.error("Add reply error:", error);
      return { reply: null, error: error.message };
    }
  }

  // Edit comment (SQLite first, then Firebase)
  static async editComment(
    postId: string,
    commentId: string,
    newContent: string
  ): Promise<{ error: string | null }> {
    try {
      const updatedAt = new Date().toISOString();

      // 1. Update SQLite first
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync(
          "UPDATE comments SET content = ?, updatedAt = ? WHERE id = ?",
          [newContent, updatedAt, commentId]
        );
        console.log(`💾 Updated comment ${commentId} in SQLite`);
      }

      // 2. Then update Firebase
      try {
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        await updateDoc(commentRef, {
          content: newContent,
          updatedAt,
        });
        console.log(`🔥 Updated comment ${commentId} in Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase comment update failed:", firebaseError);
        // Changes are still saved locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Edit comment error:", error);
      return { error: error.message };
    }
  }

  // Delete comment (SQLite first, then Firebase)
  static async deleteComment(
    postId: string,
    commentId: string
  ): Promise<{ error: string | null }> {
    try {
      // 1. Delete from SQLite first
      if (this.sqliteDb) {
        // Delete all replies for this comment
        await this.sqliteDb.runAsync(
          "DELETE FROM replies WHERE commentId = ?",
          [commentId]
        );
        // Delete the comment
        await this.sqliteDb.runAsync("DELETE FROM comments WHERE id = ?", [
          commentId,
        ]);
        // Decrement comment count on post
        await this.sqliteDb.runAsync(
          "UPDATE posts SET comments = comments - 1, updatedAt = ? WHERE id = ?",
          [new Date().toISOString(), postId]
        );
        console.log(`💾 Deleted comment ${commentId} from SQLite`);
      }

      // 2. Then delete from Firebase
      try {
        // Delete comment document
        await deleteDoc(doc(db, "posts", postId, "comments", commentId));

        // Decrement comment count on post
        await updateDoc(doc(db, "posts", postId), {
          comments: increment(-1),
          updatedAt: new Date().toISOString(),
        });
        console.log(`🔥 Deleted comment ${commentId} from Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase comment delete failed:", firebaseError);
        // Comment is still deleted locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Delete comment error:", error);
      return { error: error.message };
    }
  }

  // Edit reply (SQLite first, then Firebase)
  static async editReply(
    postId: string,
    commentId: string,
    replyId: string,
    newContent: string
  ): Promise<{ error: string | null }> {
    try {
      // 1. Update SQLite first
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync(
          "UPDATE replies SET content = ? WHERE id = ?",
          [newContent, replyId]
        );
        console.log(`💾 Updated reply ${replyId} in SQLite`);
      }

      // 2. Then update Firebase
      try {
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        const commentDoc = await getDoc(commentRef);

        if (!commentDoc.exists()) {
          return { error: "Comment not found" };
        }

        const commentData = commentDoc.data();
        const replies = commentData.replies || [];

        // Find and update the reply
        const updatedReplies = replies.map((reply: any) => {
          if (reply.id === replyId) {
            return {
              ...reply,
              content: newContent,
              updatedAt: new Date().toISOString(),
            };
          }
          return reply;
        });

        await updateDoc(commentRef, {
          replies: updatedReplies,
          updatedAt: new Date().toISOString(),
        });
        console.log(`🔥 Updated reply ${replyId} in Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase reply update failed:", firebaseError);
        // Changes are still saved locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Edit reply error:", error);
      return { error: error.message };
    }
  }

  // Delete reply (SQLite first, then Firebase)
  static async deleteReply(
    postId: string,
    commentId: string,
    replyId: string
  ): Promise<{ error: string | null }> {
    try {
      // 1. Delete from SQLite first
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync("DELETE FROM replies WHERE id = ?", [
          replyId,
        ]);
        console.log(`💾 Deleted reply ${replyId} from SQLite`);
      }

      // 2. Then delete from Firebase
      try {
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        const commentDoc = await getDoc(commentRef);

        if (!commentDoc.exists()) {
          return { error: "Comment not found" };
        }

        const commentData = commentDoc.data();
        const replies = commentData.replies || [];

        // Remove the reply
        const updatedReplies = replies.filter(
          (reply: any) => reply.id !== replyId
        );

        await updateDoc(commentRef, {
          replies: updatedReplies,
          updatedAt: new Date().toISOString(),
        });
        console.log(`🔥 Deleted reply ${replyId} from Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase reply delete failed:", firebaseError);
        // Reply is still deleted locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Delete reply error:", error);
      return { error: error.message };
    }
  }

  // Like reply (SQLite first, then Firebase)
  static async toggleReplyLike(
    postId: string,
    commentId: string,
    replyId: string,
    userId: string
  ): Promise<{ error: string | null }> {
    try {
      // 1. Update SQLite first
      if (this.sqliteDb) {
        const existingReply = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM replies WHERE id = ?",
          [replyId]
        );

        if (existingReply) {
          const isLiked = existingReply.isLiked === 1;
          const newLikes = isLiked
            ? Math.max(0, existingReply.likes - 1)
            : existingReply.likes + 1;
          const newIsLiked = !isLiked;

          await this.sqliteDb.runAsync(
            "UPDATE replies SET likes = ?, isLiked = ? WHERE id = ?",
            [newLikes, newIsLiked ? 1 : 0, replyId]
          );
          console.log(`💾 Updated like for reply ${replyId} in SQLite`);
        }
      }

      // 2. Then update Firebase
      try {
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        const commentDoc = await getDoc(commentRef);

        if (!commentDoc.exists()) {
          return { error: "Comment not found" };
        }

        const commentData = commentDoc.data();
        const replies = commentData.replies || [];

        // Find and update the reply
        const updatedReplies = replies.map((reply: any) => {
          if (reply.id === replyId) {
            const isLiked = reply.isLiked || false;
            return {
              ...reply,
              likes: isLiked ? (reply.likes || 0) - 1 : (reply.likes || 0) + 1,
              isLiked: !isLiked,
              updatedAt: new Date().toISOString(),
            };
          }
          return reply;
        });

        await updateDoc(commentRef, {
          replies: updatedReplies,
          updatedAt: new Date().toISOString(),
        });
        console.log(`🔥 Updated like for reply ${replyId} in Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase reply like update failed:", firebaseError);
        // Like is still updated locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Toggle reply like error:", error);
      return { error: error.message };
    }
  }
}
