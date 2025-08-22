import {cn} from "@/src/lib/utils";
import type * as React from "react";
import Image from "next/image";

export interface IconPracticeProps {
    className?: string;
    width: number
    height: number
}

function IconPractice({ className, width, height }: IconPracticeProps) {
    return <svg width={width} height={height}
                viewBox="0 0 251 225" fill="none" xmlns="http://www.w3.org/2000/svg"
                className={cn(
                    "stroke-current",
                    "text-neutral-900",
                    className,
                )}>
        <path d="M44 224.421L44 0.999961" stroke="currentColor" stroke-width="30"/>
        <line x1="8.60365" y1="32.7127" x2="241.415" y2="195.729" stroke="currentColor" stroke-width="30"/>
        <line x1="241.415" y1="30.2873" x2="8.60355" y2="193.304" stroke="currentColor" stroke-width="30"/>
        <path d="M206 224.421L206 0.999962" stroke="currentColor" stroke-width="30"/>
    </svg>
}

export {IconPractice}
