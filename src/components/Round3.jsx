import React from "react";
import RoundLayout from "./common/RoundLayout.jsx";
import { resolveImageUrl } from "../utils/media";

export default function Round3({
  db,
  puzzlePieces,
  revealedPieces,
  puzzleAnswersStatus,
  themeImageRevealed,
  selectedPuzzleQ,
  setSelectedPuzzleQ,
  revealSinglePiece,
  triggerCountdown,
  stopCountdown,
  timer,
  isTimerRunning,
  round3ThemeAnswerVisible,
  setRound3ThemeAnswerVisible,
  setRound3QuestionAnswerVisible,
  setThemeImageRevealed,
  triggerToast,
  setActiveTab,
}) {
  const rulesContent = `- Nhấn vào mảnh ghép để xem câu hỏi.
- Trả lời ĐÚNG để có thể lật mảnh.
- Nhấn "Mở Toàn Bộ" để xem toàn bộ ảnh.
- Nhấn "Hiện Đáp Án" để xem câu trả lời chủ đề.`;

  return (
    <RoundLayout
      roundLabel="Vòng 3"
      roundTitle="QUA SA MẠC"
      onClose={() => setActiveTab("welcome")}
      rulesContent={rulesContent}
    >
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-2xl font-black mb-4">
              {db.round3.themeQuestion}
            </div>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl max-w-[900px] bg-slate-950">
              <img
                src={resolveImageUrl(db.round3.themeImage)}
                alt="Bức Tranh Chủ Đề"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-10">
                {puzzlePieces.map((piece, idx) => {
                  const revealed =
                    !!revealedPieces[piece.index] || themeImageRevealed;
                  const answered = !!puzzleAnswersStatus[piece.index];
                  return (
                    <div
                      key={piece.index}
                      onClick={() => {
                        if (revealed) return;
                        setSelectedPuzzleQ(piece.index);
                        // hide question answer when opening
                        setRound3QuestionAnswerVisible(false);
                        setActiveTab("round3-question");
                      }}
                      style={{
                        clipPath: piece.clipPath,
                        transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
                      }}
                      className={`absolute inset-0 flex items-center justify-center
                        cursor-pointer ${revealed ? "opacity-0 pointer-events-none scale-90 translate-y-4" : "bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900  active:scale-95"}`}
                    >
                      {!revealed && (
                        <div
                          style={{
                            position: "absolute",
                            left: `${piece.centerX}%`,
                            top: `${piece.centerY}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl border-2 shadow-2xl ${answered ? "bg-emerald-600 border-emerald-300 text-white" : "bg-slate-900 border-yellow-400 text-yellow-400 hover:scale-110"}`}
                        >
                          {idx + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {puzzlePieces.map((piece, idx) => {
                  const revealed =
                    !!revealedPieces[piece.index] || themeImageRevealed;
                  if (revealed) return null;
                  const pointsStr = piece.points
                    .map((pt) => `${pt.x},${pt.y}`)
                    .join(" ");
                  return (
                    <polygon
                      key={idx}
                      points={pointsStr}
                      fill="none"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="0.5"
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => {
                  setThemeImageRevealed(!themeImageRevealed);
                  // when hiding the full image also hide the theme answer
                  if (themeImageRevealed) setRound3ThemeAnswerVisible(false);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-black px-4 py-2.5 rounded-xl"
              >
                🖼 Mở Toàn Bộ
              </button>
              <button
                onClick={() => {
                  setRound3ThemeAnswerVisible(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-black px-4 py-2.5 rounded-xl"
              >
                📢 Hiện Đáp Án
              </button>
            </div>
            {/* Theme question/answer frame */}
            <div className="mt-4 w-full max-w-[900px]">
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                <div className="mt-3 text-2xl font-extrabold text-yellow-400 text-center">
                  {round3ThemeAnswerVisible
                    ? db.round3.themeAnswer
                    : "🔒 Đáp án ẩn"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoundLayout>
  );
}
