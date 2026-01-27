'use client';
//Components
import Image from "next/image";
import { useState, useEffect } from "react";
import CommentItem from "@/components/CommentItem";
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

  const handleEditComment = (id: number, newContent: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === id
        ? {...comment, content: newContent}
        : comment
      )
    );
  };

  const handleDeleteComment = (id: number) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
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
            <CommentItem
              img={comment.user.image.webp.replace("./", "/")}
              username={comment.user.username}
              score={comment.score}
              createdAt={comment.createdAt}
              content={comment.content}
              isCurrentUser={comment.user.username === currentUser.username}
              onDelete={() => handleDeleteComment(comment.id)}
              onEdit={(newContent) => handleEditComment(comment.id, newContent)}
            />

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
                    isCurrentUser={reply.user.username === currentUser.username}  // ✅ FIXED
                    onDelete={() => handleDeleteReply(comment.id, reply.id)}      // ❗ NEEDS IMPLEMENTATION
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddComment();
          }}
          className="max-w-[50rem] w-full flex gap-4 items-start bg-white rounded rounded-[10px] p-4"
        >
          <Image 
            src={currentUser.image.webp.replace("./", "/")}
            alt="profile image"
            width={35}
            height={35}
          />
          <textarea 
            value={commentText}
            placeholder="Add a comment..."
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px] text-[#67727e] flex-1 flex-grow rounded border px-3 py-2"
          />
          <button 
            type="submit"
            className="bg-[#5457b6] text-white px-5 py-2 uppercase rounded rounded-[10px] duration-500
                        hover:bg-[#c3c4ef]"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
