'use client';
//Components
import { useState } from "react";
import Image from "next/image";
//Icons
import { FaReply, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface CommentItemProp {
    img: string;
    username: string;
    score: number;
    createdAt: string;
    content: string;
    onDelete: () => void;
    isCurrentUser: boolean;
    onEdit: (newContent: string) => void;
}

export default function CommentItem({ img, username, score, createdAt, content, isCurrentUser, onDelete, onEdit }: CommentItemProp) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(content);

    
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
                                disabled={isEditing}
                                className="cursor-pointer flex items-center gap-1 ml-auto text-[#ed6468] font-semibold duration-500
                                            hover:text-[#ffb8bb]
                                            disabled:text-[#ffb8bb]"
                            >
                                <MdDelete size={20} /> Delete
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(true)}
                                disabled={isEditing}
                                className="cursor-pointer flex items-center gap-1 ml-auto text-[#5457b6] font-semibold duration-500
                                            hover:text-[#c3c4ef]
                                            disabled:text-[#c3c4ef]"
                            >
                                <FaPen /> Edit
                            </button>
                        </div>
                        :
                        <button 
                            type="button"
                            className="cursor-pointer flex items-center gap-2 ml-auto text-[#5457b6] font-semibold duration-500
                                        hover:text-[#c3c4ef]"
                        >
                            <FaReply /> Reply
                        </button>
                    }
                </div>
                {isEditing ? (
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            onEdit(editText);
                            setIsEditing(false);
                        }}
                        className="flex flex-col items-end gap-3"
                    >
                        <textarea 
                            className="min-h-[100px] w-full border rounded px-3 py-2 text-[#67727e]" 
                            value={editText} 
                            placeholder="Edit your comment..."
                            onChange={(e) => setEditText(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="cursor-pointer bg-[#5457b6] text-white px-5 py-2 uppercase rounded-[10px] duration-500 
                                        hover:bg-[#c3c4ef]"
                        >
                            Update
                        </button>
                    </form>
                ) : (
                    <p className="text-[#67727e]">{content}</p>
                )}
            </div>
        </div>
    );
}