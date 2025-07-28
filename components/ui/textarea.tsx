import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
    ({ className, onChange, value, ...props }, ref) => {
        const textareaRef = React.useRef<HTMLTextAreaElement>(null);

        // Объединяем переданный ref с нашим внутренним ref
        React.useImperativeHandle(ref, () => textareaRef.current!);

        // Функция для автоматического изменения высоты
        const adjustHeight = React.useCallback(() => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            // Сбрасываем высоту перед вычислением
            textarea.style.height = "auto";
            // Устанавливаем новую высоту на основе scrollHeight
            textarea.style.height = `${textarea.scrollHeight}px`;
        }, []);

        // Вызываем adjustHeight при изменении значения
        React.useEffect(() => {
            adjustHeight();
        }, [value, adjustHeight]);

        // Обработчик изменения с вызовом внешнего onChange и подстройкой высоты
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (onChange) onChange(e);
            adjustHeight();
        };

        return (
            <textarea
                ref={textareaRef}
                className={cn(
                    "flex min-h-[80px] w-full rounded-sm border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-input dark:bg-background dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:ring-ring",
                    "resize-none overflow-hidden", // Убираем ручное изменение размера и скрываем вертикальный скролл
                    className,
                )}
                onChange={handleChange}
                value={value}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea"

export { Textarea }
