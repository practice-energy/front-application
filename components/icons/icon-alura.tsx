import {cn} from "@/lib/utils";
import type * as React from "react";
import Image from "next/image";

export interface IconAluraProps {
    className?: string;
    width: number
    height: number
}

function IconAlura({ className, width, height }: IconAluraProps) {
    return <Image
        src="/allura-logo.svg"
        alt="Practices"
        width={width}
        height={height}
        className={cn(className)}
    />
}

export { IconAlura }
