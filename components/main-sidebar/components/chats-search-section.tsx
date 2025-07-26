import { Search } from "lucide-react";
import { Chat } from "@/types/chats";
import { SectionHeader } from "./section-header";
import { SectionContent } from "./section-content";
import { ChatItem } from "./chat-item";

interface ChatsSearchSectionProps {
    isSearching: boolean;
    searchResults: Chat[];
    groupedChats: {
        today: Chat[];
        last7Days: Chat[];
        older: Chat[];
    };
    sectionVisibility: boolean;
    toggleSection: (sectionKey: string) => void;
    isCollapsed: boolean;
    isMobile: boolean;
    isActiveChat: (chatId: string) => boolean;
    hasNewMessages: (chat: Chat) => boolean;
    handleChatClick: (chatId: string) => void;
}

export const ChatsSearchSection = ({
                                       searchResults,
                                       sectionVisibility,
                                       toggleSection,
                                       isCollapsed,
                                       isMobile,
                                       isActiveChat,
                                       hasNewMessages,
                                       handleChatClick,
                                   }: ChatsSearchSectionProps) => {
    return (
        <div className="px-1.5">
            <SectionHeader
                title="Результаты поиска"
                sectionKey="search"
                count={searchResults.length}
                sectionVisibility={sectionVisibility}
                toggleSection={toggleSection}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
                icon={Search}
                iconStyle=""
            />
            <SectionContent sectionKey="search" sectionVisibility={sectionVisibility}>
                {searchResults.length > 0 ? (
                    searchResults.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            onChatClick={handleChatClick}
                            isActiveChat={isActiveChat}
                            hasNewMessages={hasNewMessages}
                            isCollapsed={isCollapsed}
                            isMobile={isMobile}
                        />
                    ))
                ) : (
                    <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        Ничего не найдено
                    </div>
                )}
            </SectionContent>
        </div>
    );
};
