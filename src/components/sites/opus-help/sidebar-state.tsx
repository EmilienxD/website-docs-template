"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode, type RefObject } from "react";

interface SidebarState {
  expandedGroups: Record<string, boolean>;
  toggleGroup: (title: string) => void;
  desktopScrollTopRef: RefObject<number>;
}

const SidebarStateContext = createContext<SidebarState | null>(null);

// The root layout keeps this state alive when article pages and drawers remount.
export function SidebarStateProvider({ children }: { children: ReactNode }) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const desktopScrollTopRef = useRef(0);
  const toggleGroup = useCallback((title: string) => {
    setExpandedGroups(groups => ({ ...groups, [title]: groups[title] === false }));
  }, []);

  return <SidebarStateContext.Provider value={{ expandedGroups, toggleGroup, desktopScrollTopRef }}>
    {children}
  </SidebarStateContext.Provider>;
}

export function useSidebarState() {
  const state = useContext(SidebarStateContext);
  if (!state) throw new Error("Sidebar navigation requires SidebarStateProvider.");
  return state;
}
