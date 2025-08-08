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
            "relative pt-3 px-0.5" ,
        )}>
            <div className="flex items-center gap-3">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 " />
                    <Input
                        placeholder="Поиск в чатах"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 bg-white border-gray-300 rounded-sm focus:border-gray-400"
                    />
                </div>

                <IconButton
                    onClick={toggleSidebar}
                    className={cn(
                        "rounded-sm hover:bg-none border border-gray-200",
                        isMobile && "hover:none",
                    )}
                    icon={PanelRightOpen}
                />
                {/*    <PanelRightOpen width={40} height={40}  className="border border-gray-200 text-neutral-900 p-1 rounded-sm shadow-sm"/>*/}
                {/*</IconButton>*/}
            </div>
        </div>
    );
};
