import React, { useState } from "react";
import RoundLayout from "./common/RoundLayout.jsx";
import MediaViewer from "./common/MediaViewer.jsx";
import { useSpacebarStart } from "../hooks/useSpacebarStart.js";
import sound from "../lib/sound.js";

export default function Round3Question({
  db,
  selectedPuzzleQ,
  showQuestionAnswer,
  setShowQuestionAnswer,
  timer,
  isTimerRunning,
  triggerCountdown,
  revealSinglePiece,
  setActiveTab,
  incorrectlyAnsweredQuestions,
  markIncorrectAnswer,
}) {
  const [isMediaFullscreen, setIsMediaFullscreen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const question = db.round3.questions[selectedPuzzleQ];
  const isAnswerCorrect = selectedAnswer === question?.correct;

  useSpacebarStart(triggerCountdown, isMediaFullscreen || isTimerRunning);

  const rulesContent = `- Nhấn vào đáp án để trả lời câu hỏi.
- Chỉ có thể mở mảnh khi trả lời ĐÚNG.
- SPACE bắt đầu đếm ngược nếu chưa chạy.
- Nhấn vào nút Xem Hình/Video để mở toàn màn hình.`;

  return (
    <RoundLayout
      roundLabel="Vòng 3"
      roundTitle="QUA SA MẠC"
      subtitle={`Nội dung câu hỏi ${selectedPuzzleQ + 1}`}
      onClose={() => setActiveTab("round3")}
      rulesContent={rulesContent}
      openDialog={false} // start with rules dialog closed
    >
      <div className="relative flex-1 min-h-0 w-full bg-black/30 rounded-2xl p-6 md:p-10 flex flex-col justify-center items-center text-center border border-white/5">
        <div
          className={`transition-all duration-500 transform flex flex-col items-center absolute top-6 right-6 text-right p-2 rounded-xl ${
            isTimerRunning
              ? "opacity-100 scale-100 max-w-[120px] translate-x-0 bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
              : "opacity-0 scale-75 max-w-0 w-0 overflow-hidden pointer-events-none"
          }`}
        >
          <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block whitespace-nowrap">
            Thời Gian
          </span>
          <span
            className={`text-5xl font-black ${timer <= 3 ? "text-red-500 animate-pulse" : "text-yellow-400"}`}
          >
            {timer}s
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-question">
          {db.round3.questions[selectedPuzzleQ]?.question}
        </h2>

        {db.round3.questions[selectedPuzzleQ]?.mediaType !== "text" &&
          db.round3.questions[selectedPuzzleQ]?.mediaUrl && (
            <>
              <button
                onClick={() => setIsMediaFullscreen(true)}
                className="mt-6 flex flex-col items-center gap-3 px-8 py-6 bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 rounded-2xl border border-white/20 transition-all hover:scale-110 active:scale-95"
                title="Nhấn để xem toàn màn hình"
              >
                {db.round3.questions[selectedPuzzleQ]?.mediaType === "image" ? (
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
                      mediaType={question?.mediaType}
                      mediaUrl={question?.mediaUrl}
                      className="w-full h-full object-contain shadow-2xl"
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

        {db.round3.questions[selectedPuzzleQ]?.type === "abcd" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full">
            {["A", "B", "C", "D"].map((letter, idx) => {
              const isCorrect =
                db.round3.questions[selectedPuzzleQ]?.correct === letter;
              const isSelected = selectedAnswer === letter;
              const reveal = !!showQuestionAnswer;
              const disabledOption = reveal || isAnswerCorrect;

              let optionClass =
                "bg-gradient-to-r from-indigo-900 to-purple-900";
              if (reveal) {
                optionClass = isCorrect
                  ? "bg-green-600"
                  : "bg-white/5 opacity-50";
              } else if (isAnswerCorrect) {
                optionClass = isCorrect
                  ? "bg-green-600"
                  : "bg-white/5 opacity-50";
              } else if (isSelected) {
                optionClass = isCorrect ? "bg-green-600" : "bg-red-600";
              }

              return (
                <button
                  key={letter}
                  onClick={() => {
                    setSelectedAnswer(letter);
                  }}
                  disabled={disabledOption}
                  className={`p-6 md:p-8 rounded-3xl text-left flex items-center justify-between gap-4 transition-all ${optionClass}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex">
                      <span className="text-lg md:text-4xl font-extrabold">
                        {letter}.&nbsp;
                      </span>
                      <span className="text-lg md:text-4xl font-extrabold">
                        {db.round3.questions[selectedPuzzleQ]?.options?.[idx] ||
                          ""}
                      </span>
                    </div>
                  </div>
                  {/* Badge */}
                  {reveal && isCorrect && (
                    <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">
                      ✓ ĐÚNG
                    </span>
                  )}
                  {!reveal && isSelected && isCorrect && (
                    <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">
                      ✓ ĐÚNG
                    </span>
                  )}
                  {!reveal && isSelected && !isCorrect && (
                    <span className="bg-red-400 text-black text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">
                      ✗ SAI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-black/40 rounded-2xl p-8 mt-6 w-full text-center border border-white/5">
            <div className="text-3xl md:text-4xl font-black text-yellow-400">
              {showQuestionAnswer
                ? db.round3.questions[selectedPuzzleQ]?.correct
                : "🔒 Đáp án ẩn"}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-10 w-full justify-center flex-wrap">
          <button
            onClick={() => {
              setShowQuestionAnswer(true);
              sound.playReveal();
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl text-sm"
          >
            📢 Hiện Đáp Án
          </button>
          <button
            onClick={() => {
              revealSinglePiece(selectedPuzzleQ);
              setShowQuestionAnswer(false);
              setActiveTab("round3");
            }}
            className={`font-bold px-6 py-3 rounded-xl text-sm transition-all bg-purple-600 hover:bg-purple-700 text-white cursor-pointer`}
          >
            🔓 Mở Mảnh Này
          </button>
          <button
            onClick={() => {
              setShowQuestionAnswer(false);
              markIncorrectAnswer(selectedPuzzleQ);
              setActiveTab("round3");
            }}
            className={`font-bold px-6 py-3 rounded-xl text-sm transition-all bg-red-600 hover:bg-red-700 text-white cursor-pointer`}
          >
            🔙 Quay Lại
          </button>
        </div>
      </div>
    </RoundLayout>
  );
}
