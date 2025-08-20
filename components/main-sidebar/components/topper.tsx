import {PanelRightClose, PanelRightOpen, Search} from "lucide-react";
import { Input } from "@/components/ui/input"
import {cn} from "@/lib/utils";
import {IconButton} from "@/components/icon-button";

interface TopperProps {
    toggleSidebar: () => void;
    searchQuery: string;
    handleSearch: (value: string) => void;
    isMobile: boolean;
}

export const Topper = ({
                           toggleSidebar,
                           searchQuery,
                           handleSearch,
                           isMobile,
                       }: TopperProps) => {
    return (
        <div className={cn(
            "relative pt-4 px-1.5" ,
        )}>
            <div className="flex items-center gap-4 ">
                <div className="relative w-full text-colors-custom-search">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-colors-custom-search " />
                    <input
                        placeholder="Поиск в чатах"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 w-full py-1 h-[30px] bg-colors-custom-searchBg rounded-sm text-colors-custom-search border-neutral-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-colors-custom-search focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-input"
                    />
                </div>

                <IconButton
                    onClick={toggleSidebar}
                    className={cn(
                        "rounded-sm hover:bg-none border border-gray-200 flex w-[30px] h-[30px] items-center justify-center pr-1",
                        isMobile && "hover:none",
                    )}
                    icon={PanelRightOpen}
                />
            </div>
        </div>
    );
};
