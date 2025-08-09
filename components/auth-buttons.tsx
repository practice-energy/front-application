import { cn } from "@/lib/utils";
import {PentagramIcon, UserSwitchIcon} from "@phosphor-icons/react";
import {IconPractice1} from "@/components/icons/practice-1-logo";
import {IconAlura} from "@/components/icons/icon-alura";

interface AuthButtonsProps {
    login: () => void;
    isMobile: boolean;
    className?: string;
}

export const AuthButtons = ({ login, isMobile, className }: AuthButtonsProps) => {
    return (
        <div className={cn(
            "justify-center items-center mx-auto my-auto flex gap-20  w-full h-full",
            isMobile ? "flex-col w-full" : "flex-row",
        )}>
            <IconPractice1 width={60} height={60}/>
            <div className={cn(
                "font-bold text-center text-neutral-900 whitespace-nowrap",
                isMobile ? "text-[24px]" : "text-[32px]",
            )}>
                Поток взаимодействия
            </div>
            <IconAlura width={60} height={60}/>
            <div className={cn(
                "flex flex-col p-2 py-3 gap-3 bg-violet-50 rounded-sm border  border-gray-100 shadow-sm shadow-violet-50",
                isMobile && "w-full absolute bottom-0",
            )}>
                <button
                    onClick={() => {
                        login()
                    }}
                    className="border border-gray-100 shadow-md bg-white text-neutral-900 flex flex-row justify-center items-center h-[48px] w-full md:w-[400px] gap-3 rounded-sm hover:animate-out"
                >
                    <div className="font-medium">Инициировать практис</div>
                    <PentagramIcon size={36} />
                </button>
                <button
                    onClick={() => {
                        login()
                    }}
                    className="bg-violet-600 border-0 shadow-md text-white flex flex-row justify-center items-center h-[48px] w-full md:w-[400px] gap-3 rounded-sm"
                >
                    <div className="font-medium">Войти в личный аккаунт</div>
                    <UserSwitchIcon size={36} />
                </button>
            </div>
        </div>
    );
};
