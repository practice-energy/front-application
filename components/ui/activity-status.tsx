import { cn } from "@/lib/utils";
import React from "react";

export type ActivityStatusType = "waiting" | "confirmed" | "request" | "declined" | undefined;

interface ActivityStatusProps {
    status?: ActivityStatusType;
    className?: string;
    textClassName?: string;
    dotClassName?: string;
}

export const ActivityStatus = React.memo(({
                                              status,
                                              className = "",
                                              textClassName = "",
                                              dotClassName = ""
                                          }: ActivityStatusProps) => {
    const statusConfig = {
        waiting: {
            text: "Ожидает",
            dotClass: "bg-orange-500"
        },
        confirmed: {
            text: "Подтверждено",
            dotClass: "bg-teal-400"
        },
        request: {
            text: "Запрос",
            dotClass: "bg-black"
        },
        declined: {
            text: "Отклонено",
            dotClass: "bg-neutral-300"
        },
        undefined: {
            text: "",
            dotClass: ""
        }
    };

    const currentStatus = statusConfig[status || "undefined"];

    return (
        <div className={cn("flex items-center text-accent gap-1", className)}>
      <span className={cn("text-xs text-gray-600 whitespace-nowrap", textClassName)}>
        {currentStatus.text}
      </span>
            {currentStatus.dotClass && (
                <div className={cn(
                    "w-4 h-4 rounded-sm flex-shrink-0",
                    currentStatus.dotClass,
                    dotClassName
                )}/>
            )}
        </div>
    );
});

ActivityStatus.displayName = "ActivityStatus";