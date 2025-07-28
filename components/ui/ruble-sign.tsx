"use client"

import React, { SVGProps } from 'react';

interface RubleIconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    bold?: boolean;
}

export const RubleIcon: React.FC<RubleIconProps> = ({
                                                        size = 18,
                                                        color = 'currentColor',
                                                        className = '',
                                                        bold = true,
                                                        ...props
                                                    }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill={color}
            className={`inline-block ${bold ? 'font-bold' : ''} ${className}`}
            stroke={bold ? color : 'none'}
            strokeWidth={bold ? '1.5' : '0'}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M 11 6 L 11 16 L 9 16 L 9 18 L 11 18 L 11 20 L 9 20 L 9 22 L 11 22 L 11 26 L 13 26 L 13 22 L 18 22 L 18 20 L 13 20 L 13 18 L 19 18 C 22.300781 18 25 15.300781 25 12 C 25 8.699219 22.300781 6 19 6 Z M 13 8 L 19 8 C 21.21875 8 23 9.78125 23 12 C 23 14.21875 21.21875 16 19 16 L 13 16 Z"
            />
        </svg>
    );
};