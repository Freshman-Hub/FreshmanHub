export interface Post {
  id: string;
  content: string;
  image?: string;
  category: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  userYear?: string;
  userVerified?: boolean;
  likes: number;
  comments: number;
  shares: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
  category: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  userYear?: string;
  userVerified?: boolean;
}

export interface Reply {
  id: string;
  content: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  likes: number;
  likedBy: string[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}