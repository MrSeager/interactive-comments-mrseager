//Components
import Image from "next/image";

interface CreateCommentItemProps {
    handleAddComment: () => void;
    img: string;
    commentText: string;
    setCommentText: (commentText: string) => void;
    isReply?: boolean;
}

export default function CreateCommentItem ({ handleAddComment, img, commentText, setCommentText, isReply }: CreateCommentItemProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAddComment();
      }}
      className="max-w-[50rem] w-full flex flex-col md:flex-row gap-4 items-start bg-white rounded rounded-[10px] p-4"
    >
      <Image 
        src={img}
        alt="profile image"
        width={35}
        height={35}
        className="hidden md:block"
      />
      <textarea 
        value={commentText}
        placeholder="Add a comment..."
        onChange={(e) => setCommentText(e.target.value)}
        className="min-h-[100px] w-full text-[#67727e] flex-1 flex-grow rounded border px-3 py-2"
      />
      <button 
        type="submit"
        className="hidden md:block cursor-pointer bg-[#5457b6] text-white px-5 py-2 uppercase rounded rounded-[10px] duration-500
                    hover:bg-[#c3c4ef]"
      >
        {isReply ? "Reply" : "Send"}
      </button>
      <div className="flex md:hidden justify-between w-full">
        <Image 
          src={img}
          alt="profile image"
          width={35}
          height={35}
        />
        <button 
          type="submit"
          className="cursor-pointer bg-[#5457b6] text-white px-5 py-2 uppercase rounded rounded-[10px] duration-500
                      hover:bg-[#c3c4ef]"
        >
          {isReply ? "Reply" : "Send"}
        </button>
      </div>
    </form>
  );
}