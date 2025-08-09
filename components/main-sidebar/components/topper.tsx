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
            "relative pt-3 px-1.5" ,
        )}>
            <div className="flex items-center gap-2">
                <div className="relative w-full text-neutral-500 ">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 " />
                    <Input
                        placeholder="Поиск в чатах"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 w-full px-3 bg-neutral-200 rounded-sm text-neutral-500 border-neutral-100"
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
