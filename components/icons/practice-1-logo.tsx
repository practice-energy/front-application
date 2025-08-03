import {cn} from "@/lib/utils";
import type * as React from "react";
import Image from "next/image";

export interface IconPractice1Props {
    className?: string;
    width: number;
    height: number;
}

function IconPractice1({ className, width = 192, height = 225 }: IconPractice1Props) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 192 225"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "stroke-current",
                "text-neutral-900",
                className,
            )}
        >
            {/* Left vertical line (full height) */}
            <path
                d="M15 224.421L15 0.999961"
                stroke="currentColor"
                strokeWidth="30"
            />

            {/* Right vertical line (full height) */}
            <path
                d="M177 224.421L177 0.999962"
                stroke="currentColor"
                strokeWidth="30"
            />

            {/* Middle right vertical line (partial height) */}
            <path
                d="M114 224.421L114 24.421"
                stroke="currentColor"
                strokeWidth="30"
            />

            {/* Middle left vertical line (partial height) */}
            <path
                d="M80 224.421L80 24.421"
                stroke="currentColor"
                strokeWidth="30"
            />
        </svg>
    );
}

export {IconPractice1};