'use client';
//Components
import Image from "next/image";
import { useState, useEffect } from "react";
import CommentItem from "@/components/CommentItem";
import CreateCommentItem from "@/components/CreateCommentItem";
import data from '@/public/data/data.json';

interface User {
    image: { 
      png: string;
      webp: string;
    },
    username: string;
}

interface Reply { 
  id: number; 
  content: string; 
  createdAt: string; 
  score: number; 
  replyingTo?: string; 
  user: User; 
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: Reply[];
}

interface CommentsData {
  currentUser: User;
  comments: Comment[];
}

export default function Home() {
  const { currentUser, comments: initialComments } = data as CommentsData;
  const [isClient, setIsClient] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("comments");
      if (stored) return JSON.parse(stored);
    }
    return initialComments;
  });
  const [commentText, setCommentText] = useState<string>('');
  const [replyText, setReplyText] = useState<string>("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [comments]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Math.floor(Math.random() * 1_000_000_000),
      content: commentText,
      createdAt: "now",
      score: 0,
      user: currentUser,
      replies: []
    };

    setComments(prev => [...prev, newComment]);
    setCommentText("");
  };

  const handleAddReply = (commentId: number, replyText: string) => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
      id: Math.floor(Math.random() * 1_000_000_000),
      content: replyText,
      createdAt: "now",
      score: 0,
      user: currentUser,
      replyingTo: "", // optional, you can fill this later
    };

    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );
  };

  const handleEditComment = (id: number, newContent: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === id
        ? {...comment, content: newContent}
        : comment
      )
    );
  };

  const handleEditReply = (commentId: number, replyId: number, newContent: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, content: newContent }
                  : reply
              )
            }
          : comment
      )
    );
  };

  const handleDeleteComment = (id: number) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== replyId)
            }
          : comment
      )
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa] font-sans">
      <main className="flex flex-col justify-start py-5 items-center gap-3 min-h-screen w-full max-w-[120rem]">
        {comments.map((comment) => (
          <div key={comment.id} className="max-w-[50rem] w-full">
            {/* MAIN COMMENT */}
            <CommentItem
              img={comment.user.image.webp.replace("./", "/")}
              username={comment.user.username}
              score={comment.score}
              createdAt={comment.createdAt}
              content={comment.content}
              isCurrentUser={comment.user.username === currentUser.username}
              onDelete={() => handleDeleteComment(comment.id)}
              onEdit={(newContent) => handleEditComment(comment.id, newContent)}
              onReplyClick={() => {
                setReplyingToId(comment.id);
                setReplyText(`@${comment.user.username}, `);
              }}
            />

            {/* CASE 1: There ARE replies */}
            {comment.replies.length > 0 && (
              <div className="relative mt-4 flex flex-col gap-4 ps-12 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-[#e9ebf0]">

                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    img={reply.user.image.webp.replace("./", "/")}
                    username={reply.user.username}
                    score={reply.score}
                    createdAt={reply.createdAt}
                    content={reply.content}
                    isCurrentUser={reply.user.username === currentUser.username}
                    onDelete={() => handleDeleteReply(comment.id, reply.id)}
                    onReplyClick={() => {
                      setReplyingToId(comment.id);
                      setReplyText(`@${reply.user.username}, `);
                    }}
                    onEdit={(newContent) => handleEditReply(comment.id, reply.id, newContent)}
                  />
                ))}

                {/* Reply box under replies */}
                {replyingToId === comment.id && (
                  <CreateCommentItem
                    img={currentUser.image.webp.replace("./", "/")}
                    commentText={replyText}
                    setCommentText={setReplyText}
                    handleAddComment={() => {
                      handleAddReply(comment.id, replyText);
                      setReplyText("");
                      setReplyingToId(null);
                    }}
                    isReply
                  />
                )}
              </div>
            )}

            {/* CASE 2: There are NO replies */}
            {comment.replies.length === 0 && replyingToId === comment.id && (
              <div className="relative mt-4 flex flex-col gap-4 ps-12 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-[#e9ebf0]">
                <CreateCommentItem
                  img={currentUser.image.webp.replace("./", "/")}
                  commentText={replyText}
                  setCommentText={setReplyText}
                  handleAddComment={() => {
                    handleAddReply(comment.id, replyText);
                    setReplyText("");
                    setReplyingToId(null);
                  }}
                  isReply
                />
              </div>
            )}

          </div>
        ))}
        <CreateCommentItem 
          handleAddComment={handleAddComment}
          img={currentUser.image.webp.replace("./", "/")}
          commentText={commentText}
          setCommentText={setCommentText}
        />
      </main>
    </div>
  );
}
