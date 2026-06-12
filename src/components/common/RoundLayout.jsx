import React, { useState } from "react";

export default function RoundLayout({
  roundLabel,
  roundTitle,
  subtitle,
  onClose,
  rulesContent,
  children,
}) {
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  return (
    <div className="h-full relative">
      {isRulesOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 text-white p-6 flex items-center justify-center">
          <div className="relative w-full h-full max-w-6xl rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-xl font-black">Thể lệ vòng thi</h2>
                {subtitle && (
                  <p className="text-sm text-purple-300 mt-1">{subtitle}</p>
                )}
              </div>
              <button
                onClick={() => setIsRulesOpen(false)}
                className="text-2xl text-white hover:text-yellow-300"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(100%-80px)] overflow-y-auto p-6 text-sm leading-7 text-slate-200">
              {typeof rulesContent === "string" ? (
                <div className="whitespace-pre-line">{rulesContent}</div>
              ) : (
                rulesContent
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-full flex flex-col items-center p-6">
        <div className="h-full w-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="bg-yellow-500 text-black font-black text-xs px-3 py-1 rounded-full uppercase">
                {roundLabel}
              </span>
              <h3 className="text-2xl font-black mt-1">{roundTitle}</h3>
              {subtitle && (
                <p className="text-sm text-purple-300 mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {rulesContent && (
                <button
                  onClick={() => setIsRulesOpen(true)}
                  className="bg-white/10 hover:bg-white/20 text-xs text-white font-bold px-4 py-2 rounded-xl"
                >
                  Thể lệ
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-xs text-red-400 hover:text-red-300 font-bold"
                >
                  Thoát
                </button>
              )}
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
