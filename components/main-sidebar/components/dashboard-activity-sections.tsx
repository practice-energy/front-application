import {Activity, Archive, CheckCheck, Repeat2, User, Users} from "lucide-react";
import { Chat } from "@/types/chats";
import { SectionHeader } from "./section-header";
import { SectionContent } from "./section-content";
import {DashboardStats, UpcomingActivity} from "@/types/dashboard";
import {isToday} from "date-fns";
import {UpcomingActivityCard} from "@/components/dashboard/upcoming-activity-card";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {OverviewStatCard} from "@/components/dashboard/overview-stat-card";

interface DashboardMasterSectionsProps {
    stats:  DashboardStats;
    sectionVisibility: boolean;
    toggleSection: (sectionKey: string) => void;
    isCollapsed: boolean;
    isMobile: boolean;
    isActiveChat: (chatId: string) => boolean;
    hasNewMessages: (chat: Chat) => boolean
    handleChatClick: (chatId: string) => void
}

export const DashboardActivitySections = ({
                                       stats,
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
            activities: stats.upcomingActivities.activities.filter((activity:UpcomingActivity) => {
                return isToday(activity.start)
            }),
        },
        {
            key: "awaiting",
            title: "Ожидают внимания",
            icon: undefined,
            iconStyle: "",
            activities: stats.upcomingActivities.activities.filter((activity: UpcomingActivity) => {
                return activity.status === "waiting"
            }),
            toggleStyle: "bg-orange-500 text-white rounded-sm opacity-100"
        },
        {
            key: "requested",
            title: "В запросе",
            icon: undefined,
            iconStyle: "",
            activities: stats.upcomingActivities.activities.filter((activity: UpcomingActivity) => {
                return activity.status === "request"
            }),
            toggleStyle: "bg-neutral-900 text-white rounded-sm"
        },
        // {
        //     key: "older",
        //     title: "Архив опыта практис",
        //     icon: Archive,
        //     iconStyle: "",
        //     activities: stats.upcomingActivities.activities.filter((activity: UpcomingActivity) => {
        //         return activity.end < new Date() && activity.status != "waiting"
        //     }),
        // },
    ];

    return (
        <>
            {sections.map(
                (section) =>
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
                                toggleStyle={section.activities.length > 0 && section.toggleStyle}
                            />
                            <div className="py-1">
                                <SectionContent
                                    sectionKey={section.key}
                                    sectionVisibility={sectionVisibility}
                                >
                                    {section.activities.map((activity: UpcomingActivity, index: number) => {
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
            )}
            {/* Overview Stats Card */}
            <Card className="border-0 shadow-none">
                <CardHeader>
                    <div className="flex items-center">
                        <CardTitle className="text-lg text-black">Обзор практик</CardTitle>
                        <p className="text-sm text-gray-500 ml-auto">Cледующие 30 дней</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <OverviewStatCard
                            value={stats.practiceOverview.confirmedSlots}
                            label="Подтвержденные слоты"
                            icon={<CheckCheck size={24} className="text-neutral-600" />}
                        />
                        <OverviewStatCard
                            value={stats.practiceOverview.newInitiants}
                            label="Новые иницианты"
                            icon={<User size={24} className="text-neutral-600" />}
                        />
                        <OverviewStatCard
                            value={stats.practiceOverview.personalMeetings}
                            label="Очные встречи"
                            icon={<Users size={24} className="text-neutral-600" />}
                        />
                        <OverviewStatCard
                            value={stats.practiceOverview.repeatingMeetings}
                            label="Повторные"
                            icon={<Repeat2 size={24} className="text-neutral-600" />}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
};
