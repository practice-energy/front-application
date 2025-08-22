import Image from "next/image";
import {cn} from "@/src/lib/utils";
import type * as React from "react";

export interface IconTelegramProps {
    className?: string;
    width: number;
    height: number;
}

function IconTelegram({ className, width = 192, height = 225 }: IconTelegramProps) {
    return <Image
        src="/telegram-icon.svg"
        alt="Practices"
        width={width}
        height={height}
        className={cn("text-neutral-700", className)}
    />
}

export {IconTelegram};
