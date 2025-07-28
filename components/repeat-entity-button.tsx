import { Repeat2 } from "lucide-react";

type RepeatEntityButtonProps = {
    onClick: () => void;
    className?: string;
    iconClassName?: string;
};

export function RepeatEntityButton({
                                 onClick,
                                 className = "",
                                 iconClassName = "",
                             }: RepeatEntityButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex rounded-sm w-6 h-6 items-center aspect-square justify-center bg-teal-400 hover:bg-teal-500 ${className}`}
        >
            <Repeat2 className={`text-white ${iconClassName}`} size={18}/>
        </button>
    );
}
