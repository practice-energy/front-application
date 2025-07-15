// components/MonoprintBackground.tsx
import React from "react";

export const MonoprintBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="
      min-h-screen
      bg-allura-pattern    // ваш SVG-паттерн
      bg-repeat           // повторение по осям
      bg-allura-tile      // размер тайла из конфига
      bg-fixed            // фиксированный фон (опционально)
      dark:bg-allura-pattern-dark // для darkMode (если нужно)
    ">
            {children}
        </div>
    );
};