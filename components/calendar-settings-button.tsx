import {MessageSquareText, SettingsIcon, SquarePlus} from "lucide-react";
import {IconButton} from "@/components/icon-button";

type SettingsButtonProps = {
    onClick: () => void;
    className?: string;
    iconClassName?: string;
};

export function SettingsButton({
                                 onClick,
                                 className = "",
                                 iconClassName = "",
                             }: SettingsButtonProps) {
    return (<IconButton
        icon={SettingsIcon}
        onClick={onClick}
        disabled={false}
        className={className}
        iconClassName={iconClassName}
    />)
}
