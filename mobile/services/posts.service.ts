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


export class PostsService {
  // Create a new post
  static async createPost(
    postData: CreatePostData,
    imageUri?: string // TODO: Remove this parameter when not using images, or keep for future use
  ): Promise<{ post: Post | null; error: string | null }> {
    try {
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
      const postDoc = cleanFirestoreData({
        ...postData,
        likes: 0,
        comments: 0,
        shares: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Only add optional fields if they have values
      //   if (postData.userAvatar) {
      //     postDoc.userAvatar = postData.userAvatar;
      //   }

      //   if (postData.userYear) {
      //     postDoc.userYear = postData.userYear;
      //   }

      //   if (postData.userVerified !== undefined) {
      //     postDoc.userVerified = postData.userVerified;
      //   }

      // TODO: Add image support back when implementing Firebase Storage
      // if (imageUrl) {
      //   postDoc.image = imageUrl;
      // }

      const docRef = await addDoc(collection(db, "posts"), postDoc);

      return {
        post: { id: docRef.id, ...postDoc } as Post,
        error: null,
      };
    } catch (error: any) {
      console.error("Create post error:", error);
      return { post: null, error: error.message };
    }
  }

  // Get all posts with pagination
  static async getPosts(
    limitCount = 10,
    lastPostId?: string
  ): Promise<{ posts: Post[]; error: string | null }> {
    try {
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

      return { posts, error: null };
    } catch (error: any) {
      console.error("Get posts error:", error);
      return { posts: [], error: error.message };
    }
  }

  // Get single post by ID
  static async getPost(
    postId: string
  ): Promise<{ post: Post | null; error: string | null }> {
    try {
      const postDoc = await getDoc(doc(db, "posts", postId));

      if (!postDoc.exists()) {
        return { post: null, error: "Post not found" };
      }

      const post = {
        id: postDoc.id,
        ...postDoc.data(),
      } as Post;

      return { post, error: null };
    } catch (error: any) {
      console.error("Get post error:", error);
      return { post: null, error: error.message };
    }
  }

  // Like/unlike a post
  static async toggleLike(
    postId: string,
    userId: string
  ): Promise<{ error: string | null }> {
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

      return { error: null };
    } catch (error: any) {
      console.error("Toggle like error:", error);
      return { error: error.message };
    }
  }

  // Like/unlike a comment
  static async toggleCommentLike(
    postId: string,
    commentId: string,
    userId: string
  ): Promise<{ error: string | null }> {
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

      return { error: null };
    } catch (error: any) {
      console.error("Toggle comment like error:", error);
      return { error: error.message };
    }
  }

  // Add comment to post
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
      const comment = {
        ...commentData,
        likes: 0,
        likedBy: [],
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(
        collection(db, "posts", postId, "comments"),
        comment
      );

      // Increment comment count on post
      await updateDoc(doc(db, "posts", postId), {
        comments: increment(1),
        updatedAt: new Date().toISOString(),
      });

      return {
        comment: { id: docRef.id, ...comment } as Comment,
        error: null,
      };
    } catch (error: any) {
      console.error("Add comment error:", error);
      return { comment: null, error: error.message };
    }
  }

  // Get comments for a post
  static async getComments(
    postId: string
  ): Promise<{ comments: Comment[]; error: string | null }> {
    try {
      const q = query(
        collection(db, "posts", postId, "comments"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      return { comments, error: null };
    } catch (error: any) {
      console.error("Get comments error:", error);
      return { comments: [], error: error.message };
    }
  }

  // Search posts
  static async searchPosts(
    searchQuery: string,
    category?: string
  ): Promise<{ posts: Post[]; error: string | null }> {
    try {
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

      return { posts, error: null };
    } catch (error: any) {
      console.error("Search posts error:", error);
      return { posts: [], error: error.message };
    }
  }

  // Delete post
  static async deletePost(postId: string): Promise<{ error: string | null }> {
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

      return { error: null };
    } catch (error: any) {
      console.error("Delete post error:", error);
      return { error: error.message };
    }
  }

  // Edit post
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

      await updateDoc(doc(db, "posts", postId), cleanUpdateData);

      return { error: null };
    } catch (error: any) {
      console.error("Edit post error:", error);
      return { error: error.message };
    }
  }

  // Add reply to a comment
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
      // Create clean reply data without undefined values
      const cleanReplyData: any = {
        content: replyData.content,
        userId: replyData.userId,
        userDisplayName: replyData.userDisplayName,
        likes: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
      };

      // Only add userAvatar if it exists and is not empty
      if (replyData.userAvatar && replyData.userAvatar.trim() !== "") {
        cleanReplyData.userAvatar = replyData.userAvatar;
      }

      // Add reply to comment's replies array
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      const newReply = {
        id: Date.now().toString(), // Simple ID for now
        ...cleanReplyData,
      };

      await updateDoc(commentRef, {
        replies: arrayUnion(newReply),
        updatedAt: new Date().toISOString(),
      });

      return {
        reply: newReply as Reply,
        error: null,
      };
    } catch (error: any) {
      console.error("Add reply error:", error);
      return { reply: null, error: error.message };
    }
  }

  // Edit comment
  static async editComment(
    postId: string,
    commentId: string,
    newContent: string
  ): Promise<{ error: string | null }> {
    try {
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      await updateDoc(commentRef, {
        content: newContent,
        updatedAt: new Date().toISOString(),
      });

      return { error: null };
    } catch (error: any) {
      console.error("Edit comment error:", error);
      return { error: error.message };
    }
  }

  // Delete comment
  static async deleteComment(
    postId: string,
    commentId: string
  ): Promise<{ error: string | null }> {
    try {
      // Delete comment document
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));

      // Decrement comment count on post
      await updateDoc(doc(db, "posts", postId), {
        comments: increment(-1),
        updatedAt: new Date().toISOString(),
      });

      return { error: null };
    } catch (error: any) {
      console.error("Delete comment error:", error);
      return { error: error.message };
    }
  }

  // Edit reply
  static async editReply(
    postId: string,
    commentId: string,
    replyId: string,
    newContent: string
  ): Promise<{ error: string | null }> {
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

      return { error: null };
    } catch (error: any) {
      console.error("Edit reply error:", error);
      return { error: error.message };
    }
  }

  // Delete reply
  static async deleteReply(
    postId: string,
    commentId: string,
    replyId: string
  ): Promise<{ error: string | null }> {
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

      return { error: null };
    } catch (error: any) {
      console.error("Delete reply error:", error);
      return { error: error.message };
    }
  }

  // Like reply
  static async toggleReplyLike(
    postId: string,
    commentId: string,
    replyId: string,
    userId: string
  ): Promise<{ error: string | null }> {
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

      return { error: null };
    } catch (error: any) {
      console.error("Toggle reply like error:", error);
      return { error: error.message };
    }
  }
}
