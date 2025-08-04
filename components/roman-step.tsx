import React from "react";

interface RomanStepProps {
    step: 1 | 2 | 3;
    className?: string;
}

const RomanStep: React.FC<RomanStepProps> = ({ step, className }) => {
    // Create the bars based on the step number
    const renderBars = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-1 bg-neutral-900"></div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-1 bg-neutral-900"></div>
                        <div className="h-4 w-1 bg-neutral-900"></div>
                    </div>
                );
            case 3:
                return (
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-1 bg-neutral-900"></div>
                        <div className="h-4 w-1 bg-neutral-900"></div>
                        <div className="h-4 w-1 bg-neutral-900"></div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={className}>
            <div className="flex items-end gap-2">
                {renderBars()}
                <div className="flex items-center gap-1">
                <div className="h-1 w-3 bg-neutral-900 px-1 "></div>
                    <div className="flex items-center gap-1 ml-1">
                        <div className="h-4 w-1 bg-neutral-900"></div>
                        <div className="h-4 w-1 bg-neutral-900"></div>
                        <div className="h-4 w-1 bg-neutral-900"></div>
                    </div>
            </div>
            </div>
        </div>
    );
};

export default RomanStep;
