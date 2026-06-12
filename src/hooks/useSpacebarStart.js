import { useEffect } from "react";

export default function useSpacebarStart(onStart, disabled) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== "Space" || event.repeat) return;
      if (disabled) return;
      event.preventDefault();
      onStart?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart, disabled]);
}
