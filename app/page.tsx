//Components
import Image from "next/image";
import CommentItem from "@/components/CommentItem";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa] font-sans">
      <main className="flex flex-col justify-around items-center gap-3 min-h-screen w-full max-w-[120rem] border">
        <CommentItem 
          img={'/images/avatars/image-amyrobson.webp'}
          username={'amyrobson'}
          score={12}
          createdAt={'1 month ago'}
          content={"Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well."}
        />
      </main>
    </div>
  );
}
