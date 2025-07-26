import { Activity, Archive } from "lucide-react";
import { Chat } from "@/types/chats";
import { SectionHeader } from "./section-header";
import { SectionContent } from "./section-content";
import {UpcomingActivity} from "@/types/dashboard";
import {isToday} from "date-fns";
import {UpcomingActivityCard} from "@/components/dashboard/upcoming-activity-card";

interface DashboardMasterSectionsProps {
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
                                       sectionVisibility,
                                       toggleSection,
                                       isCollapsed,
                                       isMobile,
                                   }: DashboardMasterSectionsProps) => {
    const sections = [
        {
            key: "today",
            title: "Активности сегодня",
            icon: Activity,
            iconStyle: "text-violet-600",
            activities: activities.filter((activity) => {
                return isToday(activity.start)
            }),
        },
        {
            key: "awaiting",
            title: "Ожидают внимания",
            icon: undefined,
            iconStyle: "",
            activities: activities.filter((activity) => {
                return activity.status === "waiting"
            }),
        },
        {
            key: "older",
            title: "Архив опыта практис",
            icon: Archive,
            iconStyle: "",
            activities: activities.filter((activity) => {
                return activity.end < new Date() && activity.status != "waiting"
            }),
        },
    ];

    return (
        <>
            {sections.map(
                (section) =>
                    section.activities.length > 0 ? (
                        <div key={section.key} className="px-1.5">
                            <SectionHeader
                                title={section.title}
                                sectionKey={section.key}
                                count={section.activities.length}
                                sectionVisibility={sectionVisibility}
                                toggleSection={toggleSection}
                                isCollapsed={isCollapsed}
                                isMobile={isMobile}
                                icon={section.icon}
                                iconStyle={section.iconStyle}
                            />
                            <div className="py-1">
                                <SectionContent
                                    sectionKey={section.key}
                                    sectionVisibility={sectionVisibility}
                                >
                                    {section.activities.map((activity, index) => {
                                        const isBackToBack =
                                            index > 0 &&
                                            section.activities[index - 1].end.getTime() === activity.start.getTime()

                                        return (
                                            <div key={activity.id} className="pb-1">
                                                <UpcomingActivityCard
                                                    startTime={activity.start.toLocaleTimeString("ru-RU", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    endTime={activity.end.toLocaleTimeString("ru-RU", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    client={activity.client}
                                                    service={activity.service}
                                                    duration={activity.duration}
                                                    format={activity.format}
                                                    isBackToBack={isBackToBack}
                                                    isRepeat={activity.isRepeat}
                                                    status={activity.status}
                                                    practiceCount={activity.practiceCount || 0}
                                                />
                                            </div>
                                        )
                                    })}
                                </SectionContent>
                            </div>
                        </div>
                    ) : (<>

                    </>)
            )}
        </>
    );
};