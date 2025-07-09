import { createContext } from "react";
import type { IconProps } from "@/components/ui/icon-types";

export const IconContext = createContext<IconProps>({
    color: "currentColor",
    size: "1em",
    weight: "regular",
    mirrored: false,
});
