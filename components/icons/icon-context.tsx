import { createContext } from "react";
import type { IconProps } from "@/components/icons/icon-types";

export const IconContext = createContext<IconProps>({
    color: "currentColor",
    size: "1em",
    weight: "regular",
    mirrored: false,
});
