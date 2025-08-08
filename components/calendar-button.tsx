import {CalendarDays, MessageSquareText, SettingsIcon, SquarePlus} from "lucide-react";
import {IconButton} from "@/components/icon-button";
import {cn} from "@/lib/utils";

type CalendarButtonProps = {
    onClick: () => void;
    className?: string;
    iconClassName?: string;
    pathname: string;
};

export function CalendarButton({
                                 onClick,
                                 className = "flex",
                                 iconClassName = "",
                                   pathname,
                             }: CalendarButtonProps) {
    return (<IconButton
        icon={CalendarDays}
        onClick={onClick}
        className={cn(
            pathname === "/calendar" && " border border-neutral-900 shadow-md",
            className,
        )}
        iconClassName={cn(
            iconClassName
        )}
    />)
}
