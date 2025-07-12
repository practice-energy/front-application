"use client"

import React from "react"
import { useMobile } from "@/hooks/use-mobile"
import type { SearchBarProps } from "./types/search-bar.types"
import { MobileSearchBar } from "./components/mobile-search-bar"
import { DesktopSearchBar } from "./components/desktop-search-bar"

export const SearchBar = React.memo(function SearchBar(props: SearchBarProps) {
  const isMobile = useMobile()

  if (isMobile) {
    return <MobileSearchBar {...props} />
  }

  return <DesktopSearchBar {...props} />
})

export * from "./types/search-bar.types"
export * from "./utils/search-bar.utils"
