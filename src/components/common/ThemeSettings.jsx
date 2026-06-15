import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import tailwindClasses from "../../utils/tailwindClasses";

const STORAGE_KEY = "class_replacements_v1";

function scanDOMForColorClasses() {
  const els = Array.from(document.querySelectorAll("[class]"));
  const classes = new Set();
  const pattern = /(^|\s)(bg-|text-|border-|from-|to-)([\w\-\/]+)/g;
  els.forEach((el) => {
    const cls = el.className;
    if (!cls || typeof cls !== "string") return;
    let m;
    while ((m = pattern.exec(cls))) {
      classes.add(m[2] + m[3]);
    }
  });
  return Array.from(classes).sort();
}

export default function ThemeSettings() {
  const [open, setOpen] = useState(false);
  const [found, setFound] = useState([]);
  const [filter, setFilter] = useState("");
  const [replacements, setReplacements] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    if (!open) return;
    setFound(scanDOMForColorClasses());
  }, [open]);

  useEffect(() => {
    // apply saved replacements on mount
    Object.entries(replacements).forEach(([from, to]) => {
      applyReplacement(from, to);
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(replacements));
    } catch (e) {}
  }, [replacements]);

  function applyReplacement(from, to) {
    if (!from) return;
    const els = Array.from(document.querySelectorAll("[class]"));
    els.forEach((el) => {
      if (el.classList && el.classList.contains(from)) {
        try {
          el.classList.replace(from, to);
        } catch (e) {
          el.classList.remove(from);
          el.classList.add(to);
        }
      }
    });
  }

  const visible = useMemo(() => {
    if (!filter) return found;
    return found.filter((c) => c.includes(filter));
  }, [found, filter]);

  function handleSetReplacement(from, to) {
    setReplacements((p) => ({ ...p, [from]: to }));
    applyReplacement(from, to);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 rounded-xl bg-white/5 text-sm"
      >
        ⚗️ Theme Settings
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-60 flex items-start justify-center pt-20">
            <div
              className="bg-black/60 fixed inset-0"
              onClick={() => setOpen(false)}
            />
            <div className="relative z-70 w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">
                  Theme Settings — Tailwind class scan
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter classes..."
                    className="px-3 py-2 rounded bg-white/5"
                  />
                  <button
                    onClick={() => {
                      setFound(scanDOMForColorClasses());
                    }}
                    className="px-3 py-2 rounded bg-white/5"
                  >
                    Rescan
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded bg-white/5"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
                {visible.map((cls) => (
                  <div
                    key={cls}
                    className="p-3 rounded bg-white/3 flex items-center justify-between"
                  >
                    <div className="font-mono text-sm">{cls}</div>
                    <div className="flex items-center gap-2">
                      <input
                        list={`tw-${cls}`}
                        placeholder="replace with..."
                        className="px-2 py-1 rounded bg-white/5"
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleSetReplacement(cls, e.target.value);
                        }}
                      />
                      <datalist id={`tw-${cls}`}>
                        {tailwindClasses.map((t) => (
                          <option key={t} value={t} />
                        ))}
                      </datalist>
                      <button
                        onClick={() => {
                          const val = document.querySelector(
                            `input[list='tw-${cls}']`,
                          ).value;
                          if (val) handleSetReplacement(cls, val);
                        }}
                        className="px-3 py-1 bg-yellow-500 text-black rounded"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-purple-200">
                Note: replacements are applied to the current DOM and persisted
                in localStorage. To make code-level changes, run a source
                transform separately.
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
