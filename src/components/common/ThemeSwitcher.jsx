import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../theme/ThemeProvider";

export default function ThemeSwitcher() {
  const { themes, currentName, setTheme, addTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState({
    name: "",
    primary: "#ffde59",
    secondary: "#ff6fb5",
    bg: "#60a5fa",
    text: "#06143a",
    fontFamily: "Poppins, system-ui, sans-serif",
  });
  const toggleRef = useRef(null);
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const [popupStyle, setPopupStyle] = useState({});

  const handleSave = () => {
    const key =
      custom.name.trim().toLowerCase().replace(/\s+/g, "_") ||
      `theme_${Date.now()}`;
    addTheme(key, {
      name: custom.name || key,
      colors: {
        primary: custom.primary,
        secondary: custom.secondary,
        bg: `linear-gradient(135deg, ${custom.primary}33, ${custom.secondary}33)`,
        bgColor: custom.bg,
        text: custom.text,
        surface: "#ffffffcc",
        accent: custom.secondary,
      },
      fontFamily: custom.fontFamily,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const btn = toggleRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const popupWidth = 288; // matches w-72
      let left = rect.right - popupWidth;
      if (left < 8) left = 8;
      const top = rect.bottom + 8 + window.scrollY;
      setPopupStyle({
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${popupWidth}px`,
        zIndex: 9999,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const onDoc = (e) => {
      // if click inside popup or toggle button, do nothing
      if (popupRef.current && popupRef.current.contains(e.target)) return;
      if (toggleRef.current && toggleRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-2" ref={containerRef}>
      <select
        value={currentName}
        onChange={(e) => setTheme(e.target.value)}
        className="px-3 py-2 rounded-xl bg-white/5 text-sm"
      >
        {Object.entries(themes).map(([k, v]) => (
          <option key={k} value={k}>
            {v.name || k}
          </option>
        ))}
      </select>

      <button
        ref={toggleRef}
        onClick={() => setOpen((s) => !s)}
        className="px-3 py-2 rounded-xl bg-white/5 text-sm"
      >
        🎨
      </button>

      {open &&
        createPortal(
          <div
            ref={popupRef}
            style={popupStyle}
            className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10"
          >
            <h4 className="font-bold mb-2">Tạo theme mới</h4>
            <input
              className="w-full mb-2 p-2 rounded"
              placeholder="Tên theme"
              value={custom.name}
              onChange={(e) => setCustom({ ...custom, name: e.target.value })}
            />
            <label className="text-xs">Primary</label>
            <input
              type="color"
              className="w-full mb-2"
              value={custom.primary}
              onChange={(e) =>
                setCustom({ ...custom, primary: e.target.value })
              }
            />
            <label className="text-xs">Secondary</label>
            <input
              type="color"
              className="w-full mb-2"
              value={custom.secondary}
              onChange={(e) =>
                setCustom({ ...custom, secondary: e.target.value })
              }
            />
            <label className="text-xs">Background</label>
            <input
              type="color"
              className="w-full mb-2"
              value={custom.bg}
              onChange={(e) => setCustom({ ...custom, bg: e.target.value })}
            />
            <label className="text-xs">Text color</label>
            <input
              type="color"
              className="w-full mb-2"
              value={custom.text}
              onChange={(e) => setCustom({ ...custom, text: e.target.value })}
            />
            <label className="text-xs">Font family</label>
            <input
              className="w-full mb-3 p-2 rounded"
              value={custom.fontFamily}
              onChange={(e) =>
                setCustom({ ...custom, fontFamily: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-yellow-500 text-black font-bold px-3 py-2 rounded-xl"
              >
                Lưu
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-white/5 px-3 py-2 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
