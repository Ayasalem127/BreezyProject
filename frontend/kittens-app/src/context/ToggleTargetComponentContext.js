'use client';

import { createContext, useContext, useState } from "react";

const ToggleContext = createContext();

export function ToggleProvider({ children }) {
  const [visible, setVisible] = useState(false);

  return (
    <ToggleContext.Provider value={{ visible, setVisible }}>
      {children}
    </ToggleContext.Provider>
  );
}

export function useToggleTargetComponent() {
  return useContext(ToggleContext);
}
