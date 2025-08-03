import { cn } from "@/lib/utils";
import type * as React from "react";

export interface IconPractice2Props {
    className?: string;
    width?: number;
    height?: number;
}

function IconPractice2({ className, width = 192, height = 225 }: IconPractice2Props) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 192 225"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "stroke-current",
                className
            )}
        >
            {/* Left-most line (partial height) */}
            <path
                d="M15 213L15 13"
                stroke="currentColor"
                strokeWidth="30"
            />

            {/* Second line from left (full height) */}
            <path
                d="M77 224.421L77 0.999961"
                stroke="currentColor"
                strokeWidth="30"
            />

            {/* Third line from left (full height) */}
            <path
                d="M112 224.421L112 0.999962"
                stroke="currentColor"
                strokeWidth="30"
            />

            {/* Right-most line (partial height) */}
            <path
                d="M177 213L177 13"
                stroke="currentColor"
                strokeWidth="30"
            />
        </svg>
    );
}

export { IconPractice2 };
