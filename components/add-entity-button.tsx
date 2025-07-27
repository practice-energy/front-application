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
            className={`flex rounded-sm w-6 h-6 items-center justify-center bg-violet-600 ${className}`}
        >
            <SquarePlus className={`w-4 h-4 text-white ${iconClassName}`} />
        </button>
    );
}
