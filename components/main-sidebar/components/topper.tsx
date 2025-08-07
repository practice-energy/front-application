import { PanelRightOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input"
import {cn} from "@/lib/utils";

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
            "relative py-3 px-1" ,
        )}>
            <div className="flex items-center gap-1">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 " />
                    <Input
                        placeholder="Поиск в чатах"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 bg-white border-gray-300 rounded-sm focus:border-gray-400"
                    />
                </div>

                <button
                    onClick={toggleSidebar}
                    className="rounded-sm hover:bg-none p-1"
                >
                    <PanelRightOpen width={24} height={24} />
                    <span className="sr-only">Закрыть сайдбар</span>
                </button>
            </div>
        </div>
    );
};
