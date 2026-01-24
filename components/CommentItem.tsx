//Components
import Image from "next/image";

interface CommentItemProp {
    img: string;
    username: string;
    score: number;
    createdAt: string;
    content: string;
    onDelete: () => void;
    isCurrentUser: boolean;
}

export default function CommentItem({ img, username, score, createdAt, content, isCurrentUser, onDelete }: CommentItemProp) {
    return (
        <div className={`rounded rounded-[10px] bg-white w-full flex p-4 gap-3`}>
            <div>
                <div className="rounded rounded-[10px] flex flex-col items-center gap-1 bg-[#f5f6fa] px-3 py-1">
                    <button 
                        type="button"
                        className="cursor-pointer text-[20px] text-[#c3c4ef] duration-500
                                    hover:text-[#5457b6]"
                    >
                        +
                    </button>
                    <p className="text-[#5457b6] text-[15px] font-semibold">{score}</p>
                    <button 
                        type="button"
                        className="cursor-pointer text-[20px] text-[#c3c4ef] duration-500
                                    hover:text-[#5457b6]"
                    >
                        -
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full gap-3">
                <div className="flex items-center gap-4 w-full">
                    <Image 
                        src={img}
                        alt="avatar"
                        width={35}
                        height={35}
                    />
                    <h1 className="flex items-center gap-1 text-[#324152] font-semibold">
                        {username} 
                        {isCurrentUser && (
                            <span className="bg-[#5457b6] px-2 rounded text-white text-[13px]">you</span>
                        )}
                    </h1>
                    <h2 className="text-[#67727e]">{createdAt}</h2>
                    {isCurrentUser ?
                        <div className="ms-auto flex gap-3 items-center">
                            <button 
                                type="button"
                                onClick={onDelete}
                                className="cursor-pointer ml-auto text-[#ed6468] font-semibold duration-500
                                            hover:text-[#ffb8bb]"
                            >
                                Delete
                            </button>
                            <button 
                                type="button"
                                className="cursor-pointer ml-auto text-[#5457b6] font-semibold duration-500
                                            hover:text-[#c3c4ef]"
                            >
                                Edit
                            </button>
                        </div>
                        :
                        <button 
                            type="button"
                            className="cursor-pointer ml-auto text-[#5457b6] font-semibold duration-500
                                        hover:text-[#c3c4ef]"
                        >
                            Reply
                        </button>
                    }
                </div>
                <p className="text-[#67727e]">{content}</p>
            </div>
        </div>
    );
}