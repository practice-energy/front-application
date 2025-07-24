import { cn } from "@/lib/utils";
import React from "react";

export type ActivityStatusType = "waiting" | "confirmed" | "request" | "declined" | undefined;

interface ActivityStatusProps {
    status?: ActivityStatusType;
    className?: string;
    textClassName?: string;
    dotClassName?: string;
    showTitle?: boolean
}

export const ActivityStatus = React.memo(({
                                              status,
                                              className = "",
                                              textClassName = "",
                                              dotClassName = "",
                                              showTitle = true,
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
            {showTitle && (<span className={cn("text-xs text-gray-600 whitespace-nowrap", textClassName)}>
        {currentStatus.text}
      </span>)}
            {currentStatus.dotClass && (
                <div className={cn(
                    "w-5 h-5 rounded-sm flex-shrink-0",
                    currentStatus.dotClass,
                    dotClassName
                )}/>
            )}
        </div>
    );
});

ActivityStatus.displayName = "ActivityStatus";
