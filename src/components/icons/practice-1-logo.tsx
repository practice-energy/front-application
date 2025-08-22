import {cn} from "@/src/lib/utils";
import type * as React from "react";
import Image from "next/image";

export interface IconPractice1Props {
    className?: string;
    width: number;
    height: number;
}

function IconPractice1({ className, width = 192, height = 225 }: IconPractice1Props) {
    return <Image
        src="/practice-1.svg"
        alt="Practices"
        width={width}
        height={height}
        className={cn(className)}
    />
}

export {IconPractice1};
