import { Activity, Archive } from "lucide-react";
import { Chat } from "@/types/chats";
import { SectionHeader } from "./section-header";
import { SectionContent } from "./section-content";
import { ChatItem } from "./chat-item";
import {UpcomingActivity} from "@/types/dashboard";

interface DashboardMasterSectionsProps {
    groupedChats: {
        today: Chat[];
        last7Days: Chat[];
        older: Chat[];
    };
    activities: UpcomingActivity[];
    sectionVisibility: boolean;
    toggleSection: (sectionKey: string) => void;
    isCollapsed: boolean;
    isMobile: boolean;
    isActiveChat: (chatId: string) => boolean;
    hasNewMessages: (chat: Chat) => boolean
    handleChatClick: (chatId: string) => void
}

export const DashboardMasterSections = ({
                                       activities,
                                       groupedChats,
                                       sectionVisibility,
                                       toggleSection,
                                       isCollapsed,
                                       isMobile,
                                       isActiveChat,
                                       hasNewMessages,
                                       handleChatClick,
                                   }: DashboardMasterSectionsProps) => {
    const sections = [
        {
            key: "today",
            title: "Активности сегодня",
            icon: Activity,
            iconStyle: "text-violet-600",
            chats: groupedChats.today,
        },
        {
            key: "awaiting",
            title: "Ожидают внимания",
            icon: undefined,
            iconStyle: "",
            chats: groupedChats.last7Days,
        },
        {
            key: "older",
            title: "Архив опыта практис",
            icon: Archive,
            iconStyle: "",
            chats: groupedChats.older,
        },
    ];

    return (
        <>
            {sections.map(
                (section) =>
                    section.chats.length > 0 && (
                        <div key={section.key} className="px-1.5">
                            <SectionHeader
                                title={section.title}
                                sectionKey={section.key}
                                count={section.chats.length}
                                sectionVisibility={sectionVisibility}
                                toggleSection={toggleSection}
                                isCollapsed={isCollapsed}
                                isMobile={isMobile}
                                icon={section.icon}
                                iconStyle={section.iconStyle}
                            />
                            <SectionContent
                                sectionKey={section.key}
                                sectionVisibility={sectionVisibility}
                            >
                                {section.chats.map((chat) => (
                                    <ChatItem
                                        key={chat.id}
                                        chat={chat}
                                        onChatClick={handleChatClick}
                                        isActiveChat={isActiveChat}
                                        hasNewMessages={hasNewMessages}
                                        isCollapsed={isCollapsed}
                                        isMobile={isMobile}
                                    />
                                ))}
                            </SectionContent>
                        </div>
                    )
            )}
        </>
    );
};