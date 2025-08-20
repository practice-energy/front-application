import { IconPractice } from "@/components/icons/icon-practice";
import { cn } from "@/lib/utils";

interface PracticePlaceholderProps {
    width: number;
    height: number;
    className?: string;
    iconClassName?: string;
}

export function PracticePlaceholder({
                                        width,
                                        height,
                                        className = "bg-colors-neutral-150",
                                        iconClassName = "",
                                    }: PracticePlaceholderProps) {
    const iconSize = Math.min(width, height) / 2;

    return (
        <div
            className={cn(
                "bg-colors-neutral-150 rounded-sm flex items-center justify-center overflow-hidden",
                "relative", // Добавляем relative для точного позиционирования
                className
            )}
            style={{ width, height }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <IconPractice
                    width={iconSize}
                    height={iconSize}
                    className={cn(
                        "rounded-sm object-cover text-neutral-900",
                        "block", // Убедимся, что это блочный элемент
                        iconClassName
                    )}
                />
            </div>
        </div>
    );
}
