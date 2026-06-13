import React, { useState } from "react";
import RoundLayout from "./common/RoundLayout.jsx";
import Round4Question from "./Round4Question.jsx";

export default function Round4({
  db,
  selectedVòng4Question,
  setSelectedVòng4Question,
  selectVòng4Question: selectRound4Question,
  answeredVòng4Questions,
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
  const [activeCategory, setActiveCategory] = useState(null);
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
      {!selectedVòng4Question && !activeCategory ? (
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-yellow-400 text-center">
            CHỌN CHỦ ĐỀ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {db.round4.categories.map((cat) => {
              const icons = {
                thanh_kinh: "📖",
                phung_vu: "⛪",
                giao_ly: "📚",
                tntt: "🎈",
                giao_hoi: "🌐",
              };
              const title = {
                thanh_kinh: "THÁNH KINH",
                phung_vu: "PHỤNG VỤ",
                giao_ly: "GIÁO LÝ",
                tntt: "THIẾU NHI THÁNH THỂ",
                giao_hoi: "GIÁO HỘI",
              };
              return (
                <div
                  key={cat.id}
                  className="bg-black/30 rounded-2xl border border-white/10 p-5 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="text-center border-white/10 pb-3 mb-4">
                    <div className="text-5xl mb-2">{icons[cat.id] || "❓"}</div>
                    <h2 className="font-black text-base text-white">
                      {title[cat.id]}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : !selectedVòng4Question && activeCategory ? (
        // Category question list view
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveCategory(null)}
              className="px-3 py-2 bg-white/5 rounded-xl text-sm"
            >
              ← Quay lại
            </button>
            <h4 className="text-lg font-bold text-yellow-400 text-center flex-1">
              DANH SÁCH CÂU HỎI
            </h4>
            <div style={{ width: 80 }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[10, 20, 30].map((points) => {
              const cat = db.round4.categories.find(
                (c) => c.id === activeCategory,
              );
              const arr = cat?.questions?.[points] || [];
              return (
                <div
                  key={points}
                  className="bg-black/30 rounded-2xl p-4 border border-white/10"
                >
                  <h5 className="font-black text-sm text-yellow-300 mb-3">
                    {points} ĐIỂM
                  </h5>
                  <div className="space-y-3">
                    {arr.length > 0 ? (
                      arr.map((q, idx) => {
                        const key = `${activeCategory}-${points}-${idx}`;
                        const disabled = answeredVòng4Questions?.[key];
                        return (
                          <button
                            key={idx}
                            disabled={disabled}
                            onClick={() =>
                              selectRound4Question(
                                activeCategory,
                                points,
                                idx,
                                q,
                              )
                            }
                            className={`w-full p-3 text-left rounded-xl font-black ${disabled ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-purple-900 to-indigo-900 text-white"}`}
                          >
                            <div className="truncate overflow-hidden text-ellipsis whitespace-clamp">
                              Câu {idx + 1}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-sm text-slate-400">
                        Không có câu hỏi
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Round4Question
          db={db}
          selectedVòng4Question={selectedVòng4Question}
          setSelectedVòng4Question={setSelectedVòng4Question}
          onBackToTopics={() => {
            setSelectedVòng4Question(null);
            setActiveCategory(null);
          }}
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
