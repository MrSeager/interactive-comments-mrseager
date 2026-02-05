export interface User {
    image: { 
      png: string;
      webp: string;
    },
    username: string;
}

export interface BaseComment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  userVote: "up" | "down" | null;
}

export interface Reply extends BaseComment {
  replyingTo?: string;
}

export interface Comment extends BaseComment {
  replies: Reply[];
}

export interface CommentsData {
  currentUser: User;
  comments: Comment[];
}

export type DeleteTarget =
  | { type: "comment"; commentId: number }
  | { type: "reply"; commentId: number; replyId: number };

export interface CommentItemProp {
    img: string;
    username: string;
    score: number;
    createdAt: string;
    content: string;
    onDelete: () => void;
    isCurrentUser: boolean;
    onEdit: (newContent: string) => void;
    onReplyClick?: () => void;
    onUpvote: () => void;
    onDownvote: () => void;
    userVote: "up" | "down" | null;
}

export interface ScorehandlerProps {
    onUpvote: () => void;
    onDownvote: () => void;
    userVote: "up" | "down" | null;
    score: number;
}

export interface CreateCommentItemProps {
    handleAddComment: () => void;
    img: string;
    commentText: string;
    setCommentText: (commentText: string) => void;
    isReply?: boolean;
}

export interface DeletePanelProps {
    onCancel: () => void;
    onConfirm: () => void;
}