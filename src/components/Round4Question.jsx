import React from "react";
import useSpacebarStart from "../hooks/useSpacebarStart.js";

export default function Round4Question({
  db,
  selectedVòng4Question,
  setSelectedVòng4Question,
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
            <span className="ml-2 text-xs text-purple-300">
              Chủ đề:{" "}
              {
                db.round4.categories.find(
                  (c) => c.id === selectedVòng4Question.categoryId,
                )?.title
              }
            </span>
          </div>
          <button
            onClick={() => setSelectedVòng4Question(null)}
            className="text-xs text-red-400 hover:text-red-300 font-bold"
          >
            Quay Lại
          </button>
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
                  : "🔒 Đáp án ẩn"}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-10 w-full justify-center">
            <button
              onClick={toggleStarOfHope}
              className={`px-5 py-3 rounded-xl font-bold text-sm ${starOfHope ? "bg-red-600 text-white" : "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950"}`}
            >
              ⭐ {starOfHope ? "Hủy" : "Kích hoạt"}
            </button>
            <button
              onClick={triggerCountdown}
              disabled={isTimerRunning}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold px-5 py-3 rounded-xl text-sm"
            >
              ⏰ Bắt Đầu 10s
            </button>
            <button
              onClick={() => {
                setShowAnswer(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-sm"
            >
              📢 Hiện Đáp Án
            </button>
          </div>

          <button
            onClick={finishVòng4Question}
            className="w-full bg-slate-800 hover:bg-slate-700 text-yellow-400 font-extrabold py-3 rounded-xl mt-6"
          >
            🏁 Hoàn thành câu hỏi này
          </button>
        </div>
      </div>
    </div>
  );
}
