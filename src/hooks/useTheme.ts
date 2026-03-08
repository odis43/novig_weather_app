import { useState, useEffect } from "react";

type Theme = "cash" | "coin";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("cash");

  useEffect(() => {
    document.documentElement.classList.toggle("coin", theme === "coin");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "cash" ? "coin" : "cash"));

  return { theme, toggleTheme };
};

export default useTheme;
