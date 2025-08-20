import {Check} from "lucide-react";

type SaveEntityButtonProps = {
    onClick: () => void;
    className?: string;
    iconClassName?: string;
};

export function SaveEntityButton({
                                    onClick,
                                    className = "",
                                    iconClassName = "",
                                }: SaveEntityButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex rounded-sm w-6 h-6 items-center aspect-square justify-center bg-teal-400 hover:bg-teal-500 shadow-sm ${className}`}
        >
            <Check className={`text-white ${iconClassName}`} size={18}/>
        </button>
    );
}
