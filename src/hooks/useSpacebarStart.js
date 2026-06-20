import { useEffect } from "react";

// 1. Đổi thành export thường (Named Export)
export function useSpacebarStart(onStart, disabled) {
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

// 2. Đổi thành export thường
export function useNextButton(onNext, disabled) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== "ArrowRight") return;
      if (disabled) return;
      console.log("Next triggered by ArrowRight");
      event.preventDefault();
      onNext?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, disabled]);
}

// 3. Đổi thành export thường
export function usePrevButton(onPrev, disabled) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== "ArrowLeft") return;
      if (disabled) return;
      console.log("Prev triggered by ArrowLeft");
      event.preventDefault();
      onPrev?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, disabled]);
}