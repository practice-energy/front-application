import { cn } from "@/lib/utils";
import type * as React from "react";
import Image from "next/image";

export interface IconPractice2Props {
    className?: string;
    width?: number;
    height?: number;
}

function IconPractice2({ className, width = 192, height = 225 }: IconPractice2Props) {
    return <Image
        src="/practice-2.svg"
        alt="Practices"
        width={width}
        height={height}
        className={cn(className)}
    />
}

export { IconPractice2 };
