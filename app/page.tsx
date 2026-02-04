'use client';
//Components
import { useState, useEffect } from "react";
import CommentItem from "@/components/CommentItem";
import CreateCommentItem from "@/components/CreateCommentItem";
import DeletePanel from "@/components/DeletePanel";
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
  user: User; 
  replyingTo?: string; 
  userVote: "up" | "down" | null;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: Reply[];
  userVote: "up" | "down" | null;
}

interface CommentsData {
  currentUser: User;
  comments: Comment[];
}

type DeleteTarget =
  | { type: "comment"; commentId: number }
  | { type: "reply"; commentId: number; replyId: number };

function generateId() {
   return Math.floor(Math.random() * 1_000_000_000);
}

export default function Home() {
  const { currentUser, comments: initialComments } = data as CommentsData;
  const [comments, setComments] = useState<Comment[]>(() =>
    initialComments.map(c => ({
      ...c,
      userVote: null,
      replies: c.replies.map(r => ({ ...r, userVote: null }))
    }))
  );

  useEffect(() => {
    const stored = localStorage.getItem("comments");
    if (stored) {
      const parsed = JSON.parse(stored);

      const normalized = parsed.map((c: Comment) => ({
        ...c,
        userVote: c.userVote ?? null,
        replies: c.replies.map((r: Reply) => ({
          ...r,
          userVote: r.userVote ?? null
        }))
      }));

      queueMicrotask(() => {
        setComments(normalized);
      });
    }
  }, []);

  const [commentText, setCommentText] = useState<string>('');
  const [replyText, setReplyText] = useState<string>("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>({
    type: "comment",
    commentId: -1
  });

  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [comments]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: generateId(),
      content: commentText,
      createdAt: "now",
      score: 0,
      user: currentUser,
      replies: [],
      userVote: null
    };

    setComments(prev => [...prev, newComment]);
    setCommentText("");
  };

  const handleAddReply = (commentId: number, replyText: string) => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
      id: generateId(),
      content: replyText,
      createdAt: "now",
      score: 0,
      user: currentUser,
      replyingTo: "",
      userVote: null
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
  
  function resolveVote(
    currentVote: "up" | "down" | null,
    direction: "up" | "down",
    score: number
  ) {
    if (currentVote === direction) {
      return { score: score + (direction === "up" ? -1 : 1), vote: null };
    }

    if (currentVote === null) {
      return { score: score + (direction === "up" ? 1 : -1), vote: direction };
    }

    return {
      score: score + (direction === "up" ? 2 : -2),
      vote: direction
    };
  }

  /*const handleVote = (commentId: number, direction: "up" | "down") => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id !== commentId) return comment;

        let newScore = comment.score;
        let newVote = comment.userVote;

        if (direction === "up") {
          if (comment.userVote === "up") {
            // undo upvote
            newScore -= 1;
            newVote = null;
          } else if (comment.userVote === "down") {
            // switch from down → up
            newScore += 2;
            newVote = "up";
          } else {
            // normal upvote
            newScore += 1;
            newVote = "up";
          }
        }

        if (direction === "down") {
          if (comment.userVote === "down") {
            // undo downvote
            newScore += 1;
            newVote = null;
          } else if (comment.userVote === "up") {
            // switch from up → down
            newScore -= 2;
            newVote = "down";
          } else {
            // normal downvote
            newScore -= 1;
            newVote = "down";
          }
        }

        return { ...comment, score: newScore, userVote: newVote };
      })
    );
  };*/

  const handleVote = (commentId: number, direction: "up" | "down") => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id !== commentId) return comment;

        const { score, vote } = resolveVote(
          comment.userVote,
          direction,
          comment.score
        );

        return { ...comment, score, userVote: vote };
      })
    );
  };

  /*const handleReplyVote = (commentId: number, replyId: number, direction: "up" | "down") => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id !== replyId) return reply;

            let newScore = reply.score;
            let newVote = reply.userVote;

            if (direction === "up") {
              if (reply.userVote === "up") {
                newScore -= 1;
                newVote = null;
              } else if (reply.userVote === "down") {
                newScore += 2;
                newVote = "up";
              } else {
                newScore += 1;
                newVote = "up";
              }
            }

            if (direction === "down") {
              if (reply.userVote === "down") {
                newScore += 1;
                newVote = null;
              } else if (reply.userVote === "up") {
                newScore -= 2;
                newVote = "down";
              } else {
                newScore -= 1;
                newVote = "down";
              }
            }

            return { ...reply, score: newScore, userVote: newVote };
          })
        };
      })
    );
  };*/
  const handleReplyVote = (
    commentId: number,
    replyId: number,
    direction: "up" | "down"
  ) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id !== replyId) return reply;

            const { score, vote } = resolveVote(
              reply.userVote,
              direction,
              reply.score
            );

            return { ...reply, score, userVote: vote };
          })
        };
      })
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa] font-sans">
      <main className="relevant flex flex-col justify-start py-5 items-center gap-3 min-h-screen w-full max-w-[120rem] px-3">
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
              onDelete={() => { 
                setDeleteTarget({ type: "comment", commentId: comment.id }); 
                setIsDeleteOpen(true);
              }}
              onEdit={(newContent) => handleEditComment(comment.id, newContent)}
              onReplyClick={() => {
                setReplyingToId(comment.id);
                setReplyText(`@${comment.user.username}, `);
              }}
              onUpvote={() => handleVote(comment.id, "up")}
              onDownvote={() => handleVote(comment.id, "down")}
              userVote={comment.userVote}
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
                    onDelete={() => { 
                      setDeleteTarget({ type: "reply", commentId: comment.id, replyId: reply.id }); 
                      setIsDeleteOpen(true); 
                    }}
                    onReplyClick={() => {
                      setReplyingToId(comment.id);
                      setReplyText(`@${reply.user.username}, `);
                    }}
                    onEdit={(newContent) => handleEditReply(comment.id, reply.id, newContent)}
                    onUpvote={() => handleReplyVote(comment.id, reply.id, "up")}
                    onDownvote={() => handleReplyVote(comment.id, reply.id, "down")}
                    userVote={reply.userVote}
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
        {isDeleteOpen && (
          <DeletePanel
            onCancel={() => setIsDeleteOpen(false)}
            onConfirm={() => {
              if (deleteTarget.type === "comment") {
                handleDeleteComment(deleteTarget.commentId);
              } else {
                handleDeleteReply(deleteTarget.commentId, deleteTarget.replyId);
              }
              setIsDeleteOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
}
