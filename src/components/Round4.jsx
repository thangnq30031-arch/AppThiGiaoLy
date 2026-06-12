import React from "react";
import RoundLayout from "./common/RoundLayout.jsx";
import Round4Question from "./Round4Question.jsx";

export default function Round4({
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
  setActiveTab,
  triggerToast,
}) {
  const rulesContent = `- Nhấn chọn nhóm chủ đề và điểm số.
- Mỗi câu có 10s khi bắt đầu.
- Có thể kích hoạt Ngôi Sao Hy Vọng.
- Khi mở câu hỏi, bấm "Hoàn thành câu hỏi này" để ghi nhận.`;

  return (
    <RoundLayout
      roundLabel="Vòng 4"
      roundTitle="LÊN NÚI CHÚA"
      onClose={() => setActiveTab("welcome")}
      rulesContent={rulesContent}
    >
      {!selectedVòng4Question ? (
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-yellow-400 text-center">
            BẢN ĐỒ LỰA CHỌN
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {db.round4.categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-black/30 rounded-2xl border border-white/10 p-5 flex flex-col justify-between"
              >
                <div className="text-center border-b border-white/10 pb-3 mb-4">
                  <h5 className="font-black text-base text-white">
                    {cat.title}
                  </h5>
                </div>
                <div className="space-y-3">
                  {[10, 20, 30].map((points) => {
                    const key = `${cat.id}-${points}`;
                    const isPlayed = false;
                    return (
                      <button
                        key={points}
                        onClick={() =>
                          setSelectedVòng4Question({
                            categoryId: cat.id,
                            points,
                            questionData: cat.questions[points],
                          })
                        }
                        className={`w-full p-4 rounded-xl font-black ${isPlayed ? "bg-gray-800 text-gray-500" : "bg-gradient-to-r from-purple-900 to-indigo-900 text-white"}`}
                      >
                        {points} ĐIỂM
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Round4Question
          db={db}
          selectedVòng4Question={selectedVòng4Question}
          setSelectedVòng4Question={setSelectedVòng4Question}
          starOfHope={starOfHope}
          toggleStarOfHope={toggleStarOfHope}
          triggerCountdown={triggerCountdown}
          isTimerRunning={isTimerRunning}
          timer={timer}
          finishVòng4Question={finishVòng4Question}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
        />
      )}
    </RoundLayout>
  );
}
