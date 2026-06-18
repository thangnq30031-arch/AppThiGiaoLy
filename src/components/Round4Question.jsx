import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useSpacebarStart from "../hooks/useSpacebarStart.js";
import sound from "../lib/sound.js";
import MediaViewer from "./common/MediaViewer.jsx";

export default function Round4Question({
  db,
  selectedVòng4Question,
  setSelectedVòng4Question,
  onBackToTopics,
  starOfHope,
  celebration = { isOpen: false },
  toggleStarOfHope,
  triggerCountdown,
  isTimerRunning,
  timer,
  finishVòng4Question,
  showAnswer,
  setShowAnswer,
}) {
  const [isMediaFullscreen, setIsMediaFullscreen] = useState(false);

  useSpacebarStart(triggerCountdown, isMediaFullscreen || isTimerRunning);
  // --- THIẾT LẬP CANVAS ENGINE HOẠT ẢNH CHO NGÔI SAO rAF ---
  const starCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const starsArrayRef = useRef([]);
  const portalContainerRef = useRef(
    typeof document !== "undefined" ? document.createElement("div") : null,
  );

  const title = {
    thanh_kinh: "THÁNH KINH",
    phung_vu: "PHỤNG VỤ",
    giao_ly: "GIÁO LÝ",
    tntt: "THIẾU NHI THÁNH THỂ",
    giao_hoi: "GIÁO HỘI",
  };

  useEffect(() => {
    const container = portalContainerRef.current;
    if (!container) return;
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "0";
    document.body.appendChild(container);
    return () => {
      if (container.parentNode) container.parentNode.removeChild(container);
    };
  }, []);

  const drawSingleStar = (
    ctx,
    cx,
    cy,
    spikes,
    outerRadius,
    innerRadius,
    color,
    alpha,
    rotation,
  ) => {
    let rot = (Math.PI / 2) * 3 + rotation;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const stars = starsArrayRef.current;

      if (starOfHope) {
        if (stars.length < 40) {
          stars.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 2,
            size: Math.random() * 8 + 6,
            alpha: 1,
            fadeSpeed: Math.random() * 0.008 + 0.005,
            color: `hsl(${Math.random() * 15 + 45}, 100%, 60%)`,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.04,
            wobble: Math.random() * 100,
            wobbleSpeed: Math.random() * 0.05 + 0.02,
          });
        }
      }

      if (celebration.isOpen) {
        if (stars.length < 80) {
          stars.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 100,
            y: canvas.height / 2 + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 - 2,
            size: Math.random() * 10 + 5,
            alpha: 1,
            fadeSpeed: Math.random() * 0.015 + 0.008,
            color: `hsl(${Math.random() * 360}, 100%, 65%)`,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            wobble: 0,
            wobbleSpeed: 0,
          });
        }
      }

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        if (s.wobbleSpeed > 0) {
          s.wobble += s.wobbleSpeed;
          s.x += Math.sin(s.wobble) * 0.5;
        }
        s.y += s.vy;
        s.rotation += s.rotSpeed;
        s.alpha -= s.fadeSpeed;

        if (s.alpha <= 0 || s.y < -50 || s.x < -50 || s.x > canvas.width + 50) {
          stars.splice(i, 1);
          continue;
        }

        drawSingleStar(
          ctx,
          s.x,
          s.y,
          5,
          s.size,
          s.size / 2,
          s.color,
          s.alpha,
          s.rotation,
        );
      }

      if (starOfHope || celebration.isOpen || stars.length > 0) {
        animationFrameRef.current = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (starOfHope || celebration.isOpen) {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [starOfHope, celebration.isOpen]);

  return (
    <div className="h-full flex flex-col items-center p-6">
      <div className="h-full w-full flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="bg-yellow-500 text-black text-sm font-black px-4 py-2 rounded-full uppercase">
              Câu {selectedVòng4Question.points} Điểm
            </span>
            <span className="ml-2 bg-green-500 text-black text-sm font-black px-4 py-2 rounded-full uppercase">
              Chủ đề: {title[selectedVòng4Question.categoryId]}
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
          <h4 className="text-4xl md:text-5xl font-extrabold max-w-question">
            {selectedVòng4Question.questionData?.question}
          </h4>

          {selectedVòng4Question.questionData?.mediaType !== "text" &&
            selectedVòng4Question.questionData?.mediaUrl && (
              <>
                <button
                  onClick={() => setIsMediaFullscreen(true)}
                  className="mt-6 flex flex-col items-center gap-3 px-8 py-6 bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 rounded-2xl border border-white/20 transition-all hover:scale-110 active:scale-95"
                  title="Nhấn để xem toàn màn hình"
                >
                  {selectedVòng4Question.questionData?.mediaType === "image" ? (
                    <>
                      <svg
                        className="w-12 h-12 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                      <span className="text-sm font-semibold">
                        Xem Hình Ảnh
                      </span>
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
                        mediaType={
                          selectedVòng4Question.questionData?.mediaType
                        }
                        mediaUrl={selectedVòng4Question.questionData?.mediaUrl}
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
          {selectedVòng4Question.questionData?.type === "abcd" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full">
              {["A", "B", "C", "D"].map((letter, idx) => {
                const isCorrect =
                  selectedVòng4Question.questionData?.correct === letter;
                return (
                  <div
                    key={letter}
                    className={`p-6 md:p-8 rounded-3xl text-left flex items-center justify-between gap-4 ${showAnswer && isCorrect ? "bg-green-600" : "bg-gradient-to-r from-indigo-900 to-purple-900 shadow-xl"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex">
                        <span className="text-lg md:text-4xl font-extrabold">
                          {letter}.&nbsp;
                        </span>
                        <span className="text-lg md:text-4xl font-extrabold">
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
              className={`px-5 py-3 rounded-xl font-bold text-4xl ${starOfHope ? "bg-transparent text-white" : "bg-transparent text-slate-950"}`}
            >
              ⭐
            </button>
            <button
              onClick={() => {
                setShowAnswer(true);
                sound.playReveal();
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-sm"
            >
              📢 Hiện Đáp Án
            </button>
            <button
              onClick={() => {
                if (onBackToTopics) onBackToTopics();
                else setSelectedVòng4Question(null);
                finishVòng4Question();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-sm"
            >
              🏁 Chọn Chủ Đề
            </button>
          </div>
        </div>
      </div>
      {portalContainerRef.current &&
        createPortal(
          <canvas
            ref={starCanvasRef}
            className="pointer-events-none w-full h-full block"
          />,
          portalContainerRef.current,
        )}
    </div>
  );
}
