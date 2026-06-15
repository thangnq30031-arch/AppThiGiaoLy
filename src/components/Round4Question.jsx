import React from "react";
import useSpacebarStart from "../hooks/useSpacebarStart.js";
import sound from "../lib/sound.js";
export default function Round4Question({
  db,
  selectedVòng4Question,
  setSelectedVòng4Question,
  onBackToTopics,
  starOfHope,
  toggleStarOfHope,
  triggerCountdown,
  isTimerRunning,
  timer,
  finishVòng4Question,
  showAnswer,
  setShowAnswer,
}) {
  useSpacebarStart(triggerCountdown, isTimerRunning);

  return (
    <div className="h-full flex flex-col items-center p-6">
      <div className="h-full w-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase">
              Câu {selectedVòng4Question.points} Điểm
            </span>
            <span className="ml-2 bg-green-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase">
              Chủ đề:{" "}
              {
                db.round4.categories.find(
                  (c) => c.id === selectedVòng4Question.categoryId,
                )?.title
              }
            </span>
          </div>
        </div>

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
          <h4 className="text-4xl md:text-5xl font-extrabold max-w-3xl">
            {selectedVòng4Question.questionData?.question}
          </h4>

          {starOfHope && (
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 p-4 rounded-2xl text-center font-black mt-6">
              ⭐ ĐÃ KÍCH HOẠT NGÔI SAO HY VỌNG ⭐
            </div>
          )}

          {selectedVòng4Question.questionData?.type === "abcd" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full">
              {["A", "B", "C", "D"].map((letter, idx) => {
                const isCorrect =
                  selectedVòng4Question.questionData?.correct === letter;
                return (
                  <div
                    key={letter}
                    className={`p-6 md:p-8 rounded-3xl text-left flex items-center justify-between gap-4 ${showAnswer && isCorrect ? "bg-green-600" : "bg-white/5"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex">
                        <span className="text-lg md:text-xl font-extrabold">
                          {letter}.&nbsp;
                        </span>
                        <span className="text-lg md:text-xl font-extrabold">
                          {selectedVòng4Question.questionData?.options?.[idx] ||
                            ""}
                        </span>
                      </div>
                    </div>
                    {showAnswer && isCorrect && (
                      <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                        CHÍNH XÁC
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-black/40 rounded-2xl p-8 mt-10 w-full text-center border border-white/5">
              <div className="text-3xl md:text-4xl font-black text-yellow-400">
                {showAnswer
                  ? selectedVòng4Question.questionData?.correct
                  : "🔒"}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-10 w-full justify-center">
            <button
              onClick={toggleStarOfHope}
              className={`px-5 py-3 rounded-xl font-bold text-2xl ${starOfHope ? "bg-red-600 text-white" : "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950"}`}
            >
              ⭐
            </button>
            <button
              onClick={() => {
                setShowAnswer(true);
                sound.playReveal();
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-xl"
            >
              📢 Hiện Đáp Án
            </button>
            <button
              onClick={() => {
                if (onBackToTopics) onBackToTopics();
                else setSelectedVòng4Question(null);
                finishVòng4Question();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xl"
            >
              🏁 Chọn Chủ Đề
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
