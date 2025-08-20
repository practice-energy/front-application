import { Flame } from "lucide-react";
import {MouseEventHandler} from "react";

type BurnEntityButtonProps = {
    onClick: MouseEventHandler<HTMLButtonElement>;
    className?: string;
    iconClassName?: string;
    iconSize?: number
};

export function BurnEntityButton({
                                 onClick,
                                 className = "",
                                 iconClassName = "",
                                 iconSize = 18,
                             }: BurnEntityButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex rounded-sm w-6 h-6 items-center aspect-square justify-center bg-pink-500 hover:bg-pink-600 shadow-sm", ${className}`}
        >
            <Flame className={`text-white ${iconClassName}`} size={iconSize}/>
        </button>
    );
}
