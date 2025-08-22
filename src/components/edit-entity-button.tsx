import {Edit3, Flame} from "lucide-react";

type EditEntityButtonProps = {
    onClick: () => void;
    className?: string;
    iconClassName?: string;
    iconSize?: number
};

export function EditEntityButton({
                                 onClick,
                                 className = "",
                                 iconClassName = "",
                                 iconSize = 18,
                             }: EditEntityButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex rounded-sm w-6 h-6 items-center aspect-square justify-center bg-colors-custom-accent hover:bg-violet-700 shadow-sm", ${className}`}
        >
            <Edit3 className={`text-white ${iconClassName}`} size={iconSize}/>
        </button>
    );
}
