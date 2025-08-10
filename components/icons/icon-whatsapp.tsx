import Image from "next/image";
import {cn} from "@/lib/utils";
import type * as React from "react";

export interface IconWhatsappProps {
    className?: string;
    width: number;
    height: number;
}

function IconWhatsapp({ className, width = 192, height = 225 }: IconWhatsappProps) {
    return <Image
        src="/whatsapp-icon.svg"
        alt="Practices"
        width={width}
        height={height}
        className={cn("text-neutral-700", className)}
    />
}

export {IconWhatsapp};
