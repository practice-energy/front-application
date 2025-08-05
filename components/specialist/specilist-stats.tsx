import { PentagramIcon } from "@phosphor-icons/react";
import { IconPractice } from "@/components/icons/icon-practice";
import { cn } from "@/lib/utils";
import {formatNumber} from "@/utils/format";

interface SpecialistStatsCardProps {
    likes: number;
    practices: number;
    className?: string;
}

export const SpecialistStatsCard = ({
                                        likes,
                                        practices,
                                        className,
                                    }: SpecialistStatsCardProps) => {
    return (
        <div className={cn(
            "border border-gray-100 bg-white/80 rounded-sm shadow-md shadow-violet-100 aspect-square p-2 w-[100px]",
            className
        )}>
            <div className="flex flex-row bg-white items-center gap-1 text-violet-600 w-full border border-gray-100 h-1/2 p-2 rounded-sm shadow-sm">
                <PentagramIcon size={20} />
                <div className="ml-auto">{formatNumber(likes)}</div>
            </div>
            <div className="flex flex-row bg-white items-center gap-1 w-full border border-gray-100 h-1/2 p-2 rounded-sm mt-3 shadow-sm">
                <IconPractice width={20} height={18} />
                <div className="ml-auto">{formatNumber(practices)}</div>
            </div>
        </div>
    )
};
