//Components
import Image from "next/image";
import CommentItem from "@/components/CommentItem";
import data from '@/public/data/data.json';

export default function Home() {
  const { comments } = data;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa] font-sans">
      <main className="flex flex-col justify-start py-5 items-center gap-3 min-h-screen w-full max-w-[120rem]">
        {comments.map((comment) => (
          <div key={comment.id} className="max-w-[50rem]">
            <CommentItem 
              img={comment.user.image.webp.replace("./", "/")}
              username={comment.user.username}
              score={comment.score}
              createdAt={comment.createdAt}
              content={comment.content}
            />

            {comment.replies.length > 0 && (
              <div className="relative mt-4 flex flex-col gap-4 ps-25
                              before:content-[''] before:absolute before:left-8 before:top-0 before:h-full before:w-[2px] before:bg-[#eaecf1]">
                {comment.replies.map((reply) => (
                  <CommentItem 
                    key={reply.id}
                    img={reply.user.image.webp.replace("./", "/")}
                    username={reply.user.username}
                    score={reply.score}
                    createdAt={reply.createdAt}
                    content={reply.content}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
