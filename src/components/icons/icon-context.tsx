import { createContext } from "react";
import type { IconProps } from "@/src/components/icons/icon-types";

export const IconContext = createContext<IconProps>({
    color: "currentColor",
    size: "1em",
    weight: "regular",
    mirrored: false,
});
