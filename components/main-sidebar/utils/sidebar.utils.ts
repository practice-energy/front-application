// Animation constants for sidebar transitions
export const ANIMATION_DURATION = 250
export const ANIMATION_TIMING = "cubic-bezier(0.4, 0, 0.2, 1)"

// Utility functions for sidebar animations
export const getSidebarTransition = () => `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`

export const getSidebarAnimationStyles = (isCollapsed: boolean) => ({
  transition: getSidebarTransition(),
  transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
  opacity: isCollapsed ? 0 : 1,
})
