import {cn} from "@/lib/utils";
import type * as React from "react";
import Image from "next/image";

export interface IconPracticeProps {
    className?: string;
    width: number
    height: number
}

function IconPractice({ className, width, height }: IconPracticeProps) {
    return <Image
        src="/practice-logo.svg"
        alt="Practices"
        width={width}
        height={height}
        className={cn(className)}
    />
}

export { IconPractice }