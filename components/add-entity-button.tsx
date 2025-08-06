import { SquarePlus } from "lucide-react";

type AddEntityButtonProps = {
    onClick: () => void;
    className?: string;
    iconClassName?: string;
};

export function AddEntityButton({
                                 onClick,
                                 className = "",
                                 iconClassName = "",
                             }: AddEntityButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex rounded-sm w-8 h-8 items-center aspect-square justify-center bg-violet-600 hover:bg-violet-700 shadow-sm ${className}`}
        >
            <SquarePlus className={`text-white ${iconClassName}`} size={18}/>
        </button>
    );
}
