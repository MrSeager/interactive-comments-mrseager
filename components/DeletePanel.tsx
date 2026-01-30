interface DeletePanelProps {
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeletePanel({ onCancel, onConfirm }: DeletePanelProps) {
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white flex flex-col gap-3 rounded rounded-[10px] p-5 max-w-[23rem]">
                <h3 className="text-xl font-bold text-[#324152]">Delete comment</h3>
                <p className="text-[#67727e]">Are you sure you want to delete this comment? This will remove comment and can&apos;t be undone.</p>
                <div className="flex justify-between">
                    <button
                    type="button"
                    onClick={onCancel}
                    className="uppercase font-bold text-white bg-[#67727e] px-5 py-3 rounded rounded-[10px] duration-500
                                hover:bg-[#eaecf1] hover:text-[#67727e]"
                    >
                        No, cancel
                    </button>
                    <button
                    type="button"
                    onClick={onConfirm}
                    className="uppercase font-bold text-white bg-[#ed6468] px-5 py-3 rounded rounded-[10px] duration-500
                                hover:bg-[#ffb8bb]"
                    >
                        Yes, delete
                    </button>
                </div>
            </div>
        </div>
    );
}