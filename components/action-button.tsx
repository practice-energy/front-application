import { SquareSlash, Check, Flame } from "lucide-react";
import { ReactNode } from "react";
import {IconPractice} from "@/components/icons/icon-practice";

type ActionButtonProps = {
    type: "regenerate" | "confirm" | "burn" | "practice";
    onClick: () => void;
    label?: string;
    className?: string;
    iconClassName?: string;
};

export function ActionButton({
                                 type,
                                 onClick,
                                 label,
                                 className = "",
                                 iconClassName = "",
                             }: ActionButtonProps) {
    // Стили для кнопок
    const buttonStyles = {
        regenerate: "bg-violet-600 hover:bg-violet-700",
        confirm: "bg-teal-400 hover:bg-teal-500",
        burn: "bg-pink-500 hover:bg-pink-600",
        practice: "bg-neutral-900 hover:bg-neutral-800",
    };

    // Иконки для каждого типа
    const icons = {
        regenerate: <SquareSlash className={`w-6 h-6 text-white ${iconClassName}`} />,
        confirm: <Check className={`w-6 h-6 text-white ${iconClassName}`} />,
        burn: <Flame className={`w-6 h-6 text-white ${iconClassName}`} />,
        practice: <IconPractice
            className={`w-6 h-6 text-white ${iconClassName}`}
            width={25}
            height={22}
        />,
    };

    return (
        <button
            onClick={onClick}
            className={`flex rounded-sm w-8 h-8 items-center justify-center shadow-sm ${buttonStyles[type]} ${className}`}
        >
            {icons[type]}
        </button>

    );
}

// Компонент группы кнопок в строку
export function ActionButtonsRow({
                                     onRegenerate,
                                     onConfirm,
                                     onBurn
                                 }: {
    onRegenerate: () => void;
    onConfirm: () => void;
    onBurn: () => void;
}) {
    return (
        <div className="flex justify-end gap-[30px]">
            <ActionButton
                type="confirm"
                onClick={onConfirm}
                // label="Подтвердить"
            />

            <ActionButton
                type="regenerate"
                onClick={onRegenerate}
                // label="Альтернатива"
            />

            <ActionButton
                type="burn"
                onClick={onBurn}
                // label="Сжечь"
            />
        </div>
    );
}

// Компонент группы кнопок в строку
export function ActionButtonsRowFinalize({
                                     onPractice,
                                     onBurn
                                 }: {
    onPractice: () => void;
    onBurn: () => void;
}) {
    return (
        <div className="flex justify-end gap-[30px]">
            <ActionButton
                type="burn"
                onClick={onBurn}
                // label="Сжечь"
            />

            <ActionButton
                type="practice"
                onClick={onPractice}
                // label="Практис"
            />
        </div>
    );
}

export function ActionButtonsRowConfirmed({
                                             onRegenerate,
                                             onBurn
                                         }: {
    onRegenerate: () => void;
    onBurn: () => void;
}) {
    return (
        <div className="flex justify-end gap-[30px]">
            <ActionButton
                type="regenerate"
                onClick={onRegenerate}
                // label="Альтернатива"
            />

            <ActionButton
                type="burn"
                onClick={onBurn}
                // label="Сжечь"
            />
        </div>
    );
}
