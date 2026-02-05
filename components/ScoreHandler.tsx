//Types
import { ScorehandlerProps } from "@/types/types";

export default function Scorehandler({ onUpvote, onDownvote, userVote, score }: ScorehandlerProps) {
    return (
        <div className="rounded rounded-[10px] flex md:flex-col items-center gap-5 md:gap-1 bg-[#f5f6fa] px-3 py-1">
            <button 
                type="button"
                onClick={onUpvote}
                className={`cursor-pointer text-[20px] duration-500
                            hover:text-[#5457b6]
                            ${userVote === 'up' ? 'text-[#5457b6]' : 'text-[#c3c4ef]'}`}
            >
                +
            </button>
            <p className="text-[#5457b6] text-[15px] font-semibold">{score}</p>
            <button 
                type="button"
                onClick={onDownvote}
                className={`cursor-pointer text-[20px] duration-500
                            hover:text-[#5457b6]
                            ${userVote === 'down' ? 'text-[#5457b6]' : 'text-[#c3c4ef]'}`}
            >
                -
            </button>
        </div>
    );
}