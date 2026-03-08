import React, { useState, createContext, useContext } from "react";

type TemperatureContextType = {
  unit: "I" | "M";
  setUnit: (unit: "I" | "M") => void;
};

export const TemperatureContext = createContext<
  TemperatureContextType | undefined
>(undefined);

export function TemperatureProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unit, setUnit] = useState<"I" | "M">(() => {
    return (localStorage.getItem("tempUnit") as "I" | "M") || "I";
  });

  const handleSetUnit = (newUnit: "I" | "M") => {
    setUnit(newUnit);
    localStorage.setItem("tempUnit", newUnit);
  };
  return (
    <TemperatureContext.Provider value={{ unit, setUnit: handleSetUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
}

export function useTemperature() {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error("useTemperature must be used within TemperatureProvider");
  }
  return context;
}
