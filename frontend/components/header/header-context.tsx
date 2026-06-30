"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderContextType {
  title: string;
  setTitle: (title: string) => void;
  // Optional React node to render custom actions in the header (e.g., buttons)
  actions?: ReactNode | null;
  setActions: (node: ReactNode | null) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("Dashboard");
  const [actions, setActions] = useState<ReactNode | null>(null);

  return (
    <HeaderContext.Provider value={{ title, setTitle, actions, setActions }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within HeaderProvider");
  }
  return context;
}
