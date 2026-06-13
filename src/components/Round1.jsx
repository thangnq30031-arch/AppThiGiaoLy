import React, { useState } from "react";
import RoundLayout from "./common/RoundLayout.jsx";
import MediaViewer from "./common/MediaViewer.jsx";
import useSpacebarStart from "../hooks/useSpacebarStart.js";

export default function Round1({
  db,
  currentQIndex,
  timer,
  isTimerRunning,
  triggerCountdown,
  stopCountdown,
  setCurrentQIndex,
  setActiveTab,
  triggerToast,
}) {
  const [isMediaFullscreen, setIsMediaFullscreen] = useState(false);
  const q = db.round1[currentQIndex];

  useSpacebarStart(triggerCountdown, isMediaFullscreen || isTimerRunning);

  const rulesContent = `- Nhấn nút "Thể lệ" để xem nguyên tắc vòng thi.
- Nhấn SPACE để bắt đầu đếm ngược nếu chưa có bộ đếm đang chạy.
- Nhấn vào Hình/Video để mở toàn màn hình.
- Sau khi hoàn thành câu hỏi, chọn "Câu tiếp theo" để tiếp tục.`;

  return (
    <RoundLayout
      roundLabel="Vòng 1"
      roundTitle="XUẤT HÀNH"
      onClose={() => setActiveTab("welcome")}
      rulesContent={rulesContent}
    >
      <div className="h-full w-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-sm font-semibold text-purple-300">
              Câu hỏi {currentQIndex + 1} / {db.round1.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentQIndex < db.round1.length - 1) {
                  setCurrentQIndex(currentQIndex + 1);
                  stopCountdown();
                } else {
                  triggerToast("Đã hết câu hỏi Vòng 1!");
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Câu tiếp theo
            </button>
          </div>
        </div>

        <div className="relative flex-1 min-h-0 w-full bg-black/30 rounded-2xl p-6 md:p-10 flex flex-col justify-center items-center text-center border border-white/5">
          <div className="absolute top-6 right-6 text-right">
            <span className="text-[10px] text-purple-300 font-bold uppercase block">
              Thời Gian
            </span>
            <span className="text-4xl font-black text-yellow-400">
              {timer}s
            </span>
          </div>
          <h4 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            {q.question}
          </h4>

          {q.mediaType !== "text" && q.mediaUrl && (
            <>
              <button
                onClick={() => setIsMediaFullscreen(true)}
                className="mt-6 flex flex-col items-center gap-3 px-8 py-6 bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 rounded-2xl border border-white/20 transition-all hover:scale-110 active:scale-95"
                title="Nhấn để xem toàn màn hình"
              >
                {q.mediaType === "image" ? (
                  <>
                    <svg
                      className="w-12 h-12 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    <span className="text-sm font-semibold">Xem Hình Ảnh</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="text-sm font-semibold">Xem Video</span>
                  </>
                )}
              </button>

              {isMediaFullscreen && (
                <div
                  className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                  onClick={() => setIsMediaFullscreen(false)}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <MediaViewer
                      mediaType={q.mediaType}
                      mediaUrl={q.mediaUrl}
                      className="max-h-full max-w-full object-contain shadow-2xl"
                    />
                  </div>
                  <button
                    onClick={() => setIsMediaFullscreen(false)}
                    className="absolute top-4 right-4 text-white hover:text-yellow-400 transition text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full">
            {["A", "B", "C", "D"].map((letter, idx) => (
              <div
                key={letter}
                className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 md:p-8 rounded-3xl text-left flex items-center gap-5 shadow-xl"
              >
                <div className="flex">
                  <span className="text-2xl md:text-3xl font-extrabold">
                    {letter}.&nbsp;
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold">
                    {q.options[idx] || ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoundLayout>
  );
}
