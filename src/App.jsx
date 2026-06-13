import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import sound from "./lib/sound";
import * as XLSX from "xlsx";
import { generatePuzzlePieces } from "./utils/puzzle";
import Round1 from "./components/Round1.jsx";
import Round2 from "./components/Round2.jsx";
import Round3 from "./components/Round3.jsx";
import Round3Question from "./components/Round3Question.jsx";
import Round4 from "./components/Round4.jsx";

// --- DỮ LIỆU CÂU HỎI MẪU MẶC ĐỊNH ---
const defaultDatabase = {
  round1: [
    {
      id: 1,
      question: "Hành tinh nào gần Mặt Trời nhất trong Hệ Mặt Trời?",
      options: ["Sao Kim", "Sao Thủy", "Sao Hỏa", "Trái Đất"],
      correct: "B",
      mediaType: "text",
      mediaUrl: "",
    },
    {
      id: 2,
      question: "Bức tranh bí ẩn sau đây miêu tả danh lam thắng cảnh nào?",
      options: [
        "Động Phong Nha",
        "Vịnh Hạ Long",
        "Tràng An",
        "Phong Nha Kẻ Bàng",
      ],
      correct: "B",
      mediaType: "image",
      mediaUrl: "60x90.jpg",
    },
    {
      id: 3,
      question: "Nhạc phẩm nổi tiếng thế giới trong video này tên là gì?",
      options: [
        "Symphony No. 5",
        "Canon in D",
        "Für Elise",
        "Moonlight Sonata",
      ],
      correct: "C",
      mediaType: "video",
      mediaUrl: "Video_Sẵn_Sàng_Mùa_Hè_Này.mp4",
    },
  ],
  round2: [
    {
      id: 1,
      question: "Ai là tác giả của tác phẩm văn học kinh điển 'Truyện Kiều'?",
      type: "open",
      options: [],
      correct: "Nguyễn Du",
      mediaType: "image",
      mediaUrl: "60x90.jpg",
    },
    {
      id: 2,
      question:
        "Kim loại nào có nhiệt độ nóng chảy cao nhất được dùng làm dây tóc bóng đèn?",
      type: "abcd",
      options: ["Sắt", "Đồng", "Volfram", "Nhôm"],
      correct: "C",
      mediaType: "text",
      mediaUrl: "",
    },
  ],
  round3: {
    themeImage: "2025-07-05_131435.png",
    themeAnswer: "VŨ TRỤ & KHÔNG GIAN SỐ",
    themeQuestion: "Đây là một phần của bức tranh chủ đề nào?",
    cols: 4,
    rows: 3,
    questions: [
      {
        id: 1,
        question:
          "Hệ điều hành phổ biến nhất thế giới cho thiết bị di động là gì?",
        type: "abcd",
        options: ["iOS", "Android", "Windows Phone", "Symbian"],
        correct: "B",
        mediaType: "image",
        mediaUrl: "60x90.jpg",
      },
      {
        id: 2,
        question: "Vệ tinh nhân tạo đầu tiên của Trái Đất có tên là gì?",
        type: "open",
        options: [],
        correct: "Sputnik 1",
        mediaType: "image",
        mediaUrl: "mat_troi.jpg",
      },
      {
        id: 3,
        question: "Internet chính thức xuất hiện tại Việt Nam vào năm nào?",
        type: "abcd",
        options: ["1995", "1997", "2000", "2003"],
        correct: "B",
        mediaType: "video",
        mediaUrl: "giai_dieu.mp4",
      },
      {
        id: 4,
        question: "Bộ phận nào được coi là 'Bộ não' xử lý chính của máy tính?",
        type: "abcd",
        options: ["RAM", "GPU", "CPU", "SSD"],
        correct: "C",
        mediaType: "text",
        mediaUrl: "",
      },
    ],
  },
  round4: {
    categories: [
      {
        id: "thanh_kinh",
        title: "THÁNH KINH",
        questions: {
          10: [
            {
              question: "Sách Tin Mừng nào đứng đầu Tân Ước?",
              type: "open",
              correct: "Phúc Âm Matthew",
            },
            {
              question: "Sách Tin Mừng nào đứng đầu Tân Ước?",
              type: "open",
              correct: "Phúc Âm Matthew",
            },
          ],
          20: [
            {
              question: "Ai là người viết Sách Sáng Thế?",
              type: "open",
              correct: "Truyền thống cho là Môi-se",
            },
          ],
          30: [
            {
              question: "Số lượng sách trong Cựu Ước là bao nhiêu?",
              type: "open",
              correct: "39",
            },
          ],
        },
      },
      {
        id: "phung_vu",
        title: "PHỤNG VỤ",
        questions: {
          10: [
            {
              question: "Lễ Phục Sinh truyền cảm hứng cho sự kiện nào?",
              type: "open",
              correct: "Phục sinh của Chúa Giê-su",
            },
          ],
          20: [
            {
              question: "Nghi thức Rửa Tội thuộc loại nào trong các Bí Tích?",
              type: "open",
              correct: "Bí tích khai tâm",
            },
          ],
          30: [
            {
              question: "Thời gian Mùa Chay kéo dài bao nhiêu ngày?",
              type: "abcd",
              options: ["40 ngày", "30 ngày", "50 ngày", "7 ngày"],
              correct: "A",
            },
          ],
        },
      },
      {
        id: "giao_ly",
        title: "GIÁO LÝ",
        questions: {
          10: [
            {
              question: "Tín điều nào là nền tảng của đức tin Kitô giáo?",
              type: "open",
              correct: "Đức tin vào Ba Ngôi",
            },
          ],
          20: [
            {
              question: "Giáo lý Công giáo hướng dẫn người tín hữu làm gì?",
              type: "open",
              correct: "Sống theo lời Chúa",
            },
          ],
          30: [
            {
              question: "Giáo lý bao gồm bao nhiêu phần chính?",
              type: "abcd",
              options: ["3", "4", "5", "6"],
              correct: "A",
            },
          ],
        },
      },
      {
        id: "tntt",
        title: "PHONG TRÀO TNTT",
        questions: {
          10: [
            {
              question: "TNTT là viết tắt của gì?",
              type: "open",
              correct: "Thiếu Nhi Thánh Thể",
            },
          ],
          20: [
            {
              question: "Hoạt động sinh hoạt chính của TNTT thường là gì?",
              type: "open",
              correct: "Cầu nguyện và sinh hoạt cộng đồng",
            },
          ],
          30: [
            {
              question: "Chữ ký hiệu truyền thống của TNTT là biểu tượng nào?",
              type: "open",
              correct: "Ngôi sao hoặc hình trái tim",
            },
          ],
        },
      },
      {
        id: "giao_hoi",
        title: "GIÁO HỘI",
        questions: {
          10: [
            {
              question: "Giáo hội được thành lập bởi ai?",
              type: "open",
              correct: "Chúa Giê-su Kitô",
            },
          ],
          20: [
            {
              question: "Thánh lễ thường diễn ra vào ngày nào trong tuần?",
              type: "abcd",
              options: ["Chủ Nhật", "Thứ Hai", "Thứ Sáu", "Thứ Bảy"],
              correct: "A",
            },
          ],
          30: [
            {
              question: "Thánh Phêrô được coi là người giữ vai trò gì?",
              type: "open",
              correct: "Tông đồ, vị thủ lĩnh sớm của Giáo hội",
            },
          ],
        },
      },
    ],
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem("kahoot_olympia_db");
    return saved ? JSON.parse(saved) : defaultDatabase;
  });

  useEffect(() => {
    localStorage.setItem("kahoot_olympia_db", JSON.stringify(db));
  }, [db]);

  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const contentWrapperRef = useRef(null);
  const [contentScale, setContentScale] = useState(1);

  // Vòng 3 - Trạng thái nâng cấp lưới tổ ong động
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [revealedPieces, setRevealedPieces] = useState({});
  const [themeImageRevealed, setThemeImageRevealed] = useState(false);
  const [selectedPuzzleQ, setSelectedPuzzleQ] = useState(null);
  const [puzzleAnswersStatus, setPuzzleAnswersStatus] = useState({});
  const [round3ThemeAnswerVisible, setRound3ThemeAnswerVisible] =
    useState(false);
  const [round3QuestionAnswerVisible, setRound3QuestionAnswerVisible] =
    useState(false);

  // Vòng 4
  const [starOfHope, setStarOfHope] = useState(false);
  const [selectedVòng4Question, setSelectedVòng4Question] = useState(null);
  const [answeredVòng4Questions, setAnsweredVòng4Questions] = useState({});

  const [toastMsg, setToastMsg] = useState("");
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const startCountdown = (onTimeUpCallback) => {
    sound.init();
    setIsTimerRunning(true);
    setTimer(10);

    if (timerRef.current) clearInterval(timerRef.current);

    let currentSeconds = 10;
    timerRef.current = setInterval(() => {
      currentSeconds--;
      setTimer(currentSeconds);
      if (currentSeconds <= 5 && currentSeconds > 0) {
        sound.playTick();
      }

      if (currentSeconds <= 0) {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
        sound.playTimeUp();
        if (onTimeUpCallback) onTimeUpCallback();
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsTimerRunning(false);
  };

  useEffect(() => {
    const updateScale = () => {
      const wrapper = contentWrapperRef.current;
      if (!wrapper) return;

      const headerHeight =
        document.querySelector("header")?.getBoundingClientRect().height || 0;
      const viewportHeight = window.innerHeight;
      const availableHeight = Math.max(viewportHeight - headerHeight - 24, 0);
      const contentHeight = wrapper.scrollHeight;

      setContentScale(
        contentHeight > 0 ? Math.min(1, availableHeight / contentHeight) : 1,
      );
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [
    activeTab,
    currentQIndex,
    selectedPuzzleQ,
    selectedVòng4Question,
    showAnswer,
    timer,
    db,
  ]);

  // Vòng 1
  const handleStartVòng1 = () => {
    setCurrentQIndex(0);
    setShowAnswer(false);
    stopCountdown();
    setTimer(10);
    setActiveTab("round1");
  };

  const triggerVòng1Countdown = () => {
    startCountdown(() => {
      setCurrentQIndex((prev) => {
        if (prev < db.round1.length - 1) {
          setShowAnswer(false);
          setTimer(10);
          return prev + 1;
        } else {
          triggerToast("Đã hoàn thành toàn bộ câu hỏi Vòng 1!");
          return prev;
        }
      });
    });
  };

  // Vòng 2
  const handleStartVòng2 = () => {
    setCurrentQIndex(0);
    setShowAnswer(false);
    stopCountdown();
    setTimer(10);
    setActiveTab("round2");
  };

  const triggerVòng2Countdown = () => {
    startCountdown(() => {
      triggerToast("Hết giờ suy nghĩ!");
    });
  };

  // Lắng nghe thay đổi đề để thiết lập lại kết cấu tổ ong
  useEffect(() => {
    if (db.round3?.cols && db.round3?.rows) {
      const pieces = generatePuzzlePieces(db.round3.cols, db.round3.rows);
      setPuzzlePieces(pieces);
    }
  }, [db.round3?.cols, db.round3?.rows]);

  const handleStartVòng3 = () => {
    setRevealedPieces({});
    setThemeImageRevealed(false);
    setSelectedPuzzleQ(null);
    setPuzzleAnswersStatus({});
    setRound3ThemeAnswerVisible(false);
    setRound3QuestionAnswerVisible(false);

    if (db.round3?.cols && db.round3?.rows) {
      const pieces = generatePuzzlePieces(db.round3.cols, db.round3.rows);
      setPuzzlePieces(pieces);
    }

    stopCountdown();
    setTimer(10);
    setActiveTab("round3");
  };

  const triggerVòng3Countdown = () => {
    startCountdown(() => {
      triggerToast("Hết giờ suy nghĩ!");
    });
  };

  const revealSinglePiece = (index) => {
    setRevealedPieces((prev) => ({ ...prev, [index]: true }));
    sound.playReveal();

    setPuzzleAnswersStatus((prev) => ({ ...prev, [index]: true }));
    setSelectedPuzzleQ(null);
    stopCountdown();
  };

  // Vòng 4
  const handleStartVòng4 = () => {
    setSelectedVòng4Question(null);
    setStarOfHope(false);
    setAnsweredVòng4Questions({});
    stopCountdown();
    setTimer(10);
    setActiveTab("round4");
  };

  const selectVòng4Question = (categoryId, points, index, questionData) => {
    const key = `${categoryId}-${points}-${index}`;
    if (answeredVòng4Questions[key]) {
      triggerToast("Câu hỏi này đã được chọn trước đó!");
      return;
    }
    setSelectedVòng4Question({ categoryId, points, index, questionData });
    setShowAnswer(false);
    setStarOfHope(false);
    setTimer(10);
    stopCountdown();
  };

  const toggleStarOfHope = () => {
    const newState = !starOfHope;
    setStarOfHope(newState);
    if (newState) {
      sound.playStar();
      triggerToast("Đã kích hoạt NGÔI SAO HY VỌNG! Nhân đôi điểm số!");
    }
  };

  const triggerVòng4Countdown = () => {
    startCountdown(() => {
      triggerToast("Hết giờ trả lời!");
    });
  };

  const finishVòng4Question = () => {
    if (selectedVòng4Question) {
      const key = `${selectedVòng4Question.categoryId}-${selectedVòng4Question.points}-${selectedVòng4Question.index}`;
      setAnsweredVòng4Questions((prev) => ({ ...prev, [key]: true }));
      setSelectedVòng4Question(null);
      setStarOfHope(false);
      stopCountdown();
    }
  };

  // Admin
  const exportDatabase = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "Olympia_Kahoot_Offline_DB.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("Đã xuất cấu trúc dữ liệu thành công!");
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.round1 && parsed.round2 && parsed.round3 && parsed.round4) {
          setDb(parsed);
          triggerToast("Nạp dữ liệu thành công!");
        } else {
          alert("Lỗi cấu trúc tệp! Tệp JSON cần có đầy đủ dữ liệu 4 vòng thi.");
        }
      } catch (err) {
        alert("Lỗi định dạng tệp JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const newDb = { ...db };

      // Helper to parse option columns
      const parseOptions = (row) => {
        const opts = [];
        Object.keys(row).forEach((k) => {
          if (/^option/i.test(k) || /^[abcd]$/i.test(k) || /^opt/i.test(k)) {
            if (
              row[k] !== undefined &&
              row[k] !== null &&
              String(row[k]).trim() !== ""
            ) {
              opts.push(String(row[k]));
            }
          }
        });
        // also try A,B,C,D columns
        ["A", "B", "C", "D"].forEach((k) => {
          if (row[k] !== undefined && String(row[k]).trim() !== "")
            opts.push(String(row[k]));
        });
        return opts;
      };

      // Round1, Round2, Round3 simple lists
      const readSheet = (name) => {
        const sheet =
          workbook.Sheets[name] ||
          workbook.Sheets[name.toLowerCase()] ||
          workbook.Sheets[name.toUpperCase()];
        if (!sheet) return null;
        return XLSX.utils.sheet_to_json(sheet, { defval: "" });
      };

      const s1 = readSheet("round1");
      if (s1) {
        newDb.round1 = s1.map((r, idx) => ({
          id: r.id || idx + 1,
          question: r.question || r.Question || r.QuestionText || "",
          options: parseOptions(r),
          correct: r.correct || r.Correct || r.answer || "",
          mediaType: r.mediaType || r.mediaType || "text",
          mediaUrl: r.mediaUrl || r.media || "",
        }));
      }

      const s2 = readSheet("round2");
      if (s2) {
        newDb.round2 = s2.map((r, idx) => ({
          id: r.id || idx + 1,
          question: r.question || r.Question || "",
          type: (r.type || r.Type || "abcd").toLowerCase(),
          options: parseOptions(r),
          correct: r.correct || r.Correct || r.answer || "",
          mediaType: r.mediaType || r.media || "text",
          mediaUrl: r.mediaUrl || r.mediaUrl || "",
        }));
      }

      const s3 = readSheet("round3");
      if (s3) {
        newDb.round3 = newDb.round3 || {};
        newDb.round3.questions = s3.map((r, idx) => ({
          id: r.id || idx + 1,
          question: r.question || r.Question || "",
          type: (r.type || r.Type || "abcd").toLowerCase(),
          options: parseOptions(r),
          correct: r.correct || r.Correct || r.answer || "",
          mediaType: r.mediaType || r.media || "text",
          mediaUrl: r.mediaUrl || r.mediaUrl || "",
        }));
      }

      // round3_common sheet with themeImage/themeAnswer/themeQuestion/cols/rows
      const s3c = readSheet("round3_common") || readSheet("round3-common");
      if (s3c && s3c.length > 0) {
        const r = s3c[0];
        newDb.round3 = newDb.round3 || {};
        newDb.round3.themeImage =
          r.themeImage || r.theme_image || newDb.round3.themeImage || "";
        newDb.round3.themeAnswer =
          r.themeAnswer || r.theme_answer || newDb.round3.themeAnswer || "";
        newDb.round3.themeQuestion =
          r.themeQuestion ||
          r.theme_question ||
          newDb.round3.themeQuestion ||
          newDb.round3.themeQuestion ||
          "";
        newDb.round3.cols = Number(r.cols || r.Cols || newDb.round3.cols || 4);
        newDb.round3.rows = Number(r.rows || r.Rows || newDb.round3.rows || 3);
      }

      // Round4 sheet — expects categoryId, categoryTitle, points, question, type, option*, correct, mediaType, mediaUrl
      const s4 = readSheet("round4");
      if (s4) {
        const categories = {};
        s4.forEach((r) => {
          const catId =
            r.categoryId ||
            r.category ||
            r.Category ||
            (r.categoryTitle
              ? String(r.categoryTitle).toLowerCase().replace(/\s+/g, "_")
              : "uncategorized");
          const catTitle =
            r.categoryTitle ||
            r.CategoryTitle ||
            r.category ||
            r.Category ||
            catId;
          const points = Number(r.points || r.Points || 10);
          const qobj = {
            question: r.question || r.Question || "",
            type: (r.type || r.Type || "open").toLowerCase(),
            options: parseOptions(r),
            correct: r.correct || r.Correct || r.answer || "",
            mediaType: r.mediaType || r.media || "",
            mediaUrl: r.mediaUrl || r.mediaUrl || "",
          };
          categories[catId] = categories[catId] || {
            id: catId,
            title: catTitle,
            questions: { 10: [], 20: [], 30: [] },
          };
          const level = String(points);
          categories[catId].questions[level] =
            categories[catId].questions[level] || [];
          categories[catId].questions[level].push(qobj);
        });
        newDb.round4 = { categories: Object.values(categories) };
      }

      setDb(newDb);
      triggerToast("Nạp file Excel thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đọc tệp Excel.");
    }
  };

  const handleResetDefault = () => {
    if (confirm("Bạn có chắc muốn khôi phục về bộ câu hỏi mặc định?")) {
      setDb(defaultDatabase);
      triggerToast("Đã khôi phục dữ liệu gốc!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-yellow-500 text-black px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 animate-bounce">
          <span>🌟</span> {toastMsg}
        </div>
      )}

      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveTab("welcome")}
        >
          <div className="bg-yellow-500 text-slate-950 font-black text-2xl px-3 py-1 rounded-xl shadow-lg shadow-yellow-500/30">
            O!
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
              ĐƯỜNG LÊN NÚI SINAI
            </h1>
            <p className="text-[10px] uppercase text-purple-300 font-bold tracking-widest">
              Hệ Thống Đố Vui Kinh Thánh
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("welcome")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "welcome" ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "bg-white/5 hover:bg-white/10"}`}
          >
            🏠 Trang Chủ
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "admin" ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "bg-white/5 hover:bg-white/10"}`}
          >
            ⚙️ Quản Lý Câu Hỏi
          </button>
        </div>
      </header>

      <main
        className="flex-1 overflow-hidden min-h-0"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div
          ref={contentWrapperRef}
          className="h-full w-full transition-transform duration-200 origin-top"
          style={{ transform: `scale(${contentScale})` }}
        >
          {activeTab === "welcome" && (
            <div className="py-12 text-center max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-400 to-amber-300 tracking-tight leading-tight">
                ĐƯỜNG LÊN NÚI SINAI
              </h2>
              <p className="mt-4 text-purple-300 text-lg max-w-2xl mx-auto font-medium">
                Chào mừng bạn đến với hệ thống trình chiếu thi đấu ngoại tuyến
                thông minh. Trải nghiệm kịch tính qua 4 vòng thi đầy thử thách!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                <div className="bg-gradient-to-b from-indigo-900/60 to-purple-900/40 p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between items-center text-center hover:scale-105 transition-all duration-300 group">
                  <div>
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      ⚡
                    </div>
                    <h3 className="text-lg font-black text-yellow-400">
                      VÒNG 1: SƠ LOẠI
                    </h3>
                    <p className="text-xs text-purple-200 mt-2 leading-relaxed">
                      Đếm ngược 10 giây tự động đổi câu. Không hiển thị kết quả
                      đúng để học sinh làm bài trên giấy kiểm tra.
                    </p>
                  </div>
                  <button
                    onClick={handleStartVòng1}
                    className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-3 rounded-2xl text-sm transition-all shadow-md"
                  >
                    BẮT ĐẦU VÒNG 1
                  </button>
                </div>

                <div className="bg-gradient-to-b from-indigo-900/60 to-purple-900/40 p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between items-center text-center hover:scale-105 transition-all duration-300 group">
                  <div>
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      🚀
                    </div>
                    <h3 className="text-lg font-black text-yellow-400">
                      VÒNG 2: TĂNG TỐC
                    </h3>
                    <p className="text-xs text-purple-200 mt-2 leading-relaxed">
                      Hỗ trợ trắc nghiệm hoặc đáp án tự luận. Có nút kích hoạt
                      10 giây và nút hiện đáp án đúng để quản trò phân phối
                      điểm.
                    </p>
                  </div>
                  <button
                    onClick={handleStartVòng2}
                    className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-3 rounded-2xl text-sm transition-all shadow-md"
                  >
                    BẮT ĐẦU VÒNG 2
                  </button>
                </div>

                <div className="bg-gradient-to-b from-indigo-900/60 to-purple-900/40 p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between items-center text-center hover:scale-105 transition-all duration-300 group">
                  <div>
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      🧩
                    </div>
                    <h3 className="text-lg font-black text-yellow-400">
                      VÒNG 3: MẢNH GHÉP
                    </h3>
                    <p className="text-xs text-purple-200 mt-2 leading-relaxed">
                      Tranh chủ đề bị che mờ bởi các mảnh ghép đa giác ngẫu
                      nhiên. Trả lời đúng để lật mở từng mảnh ghép độc đáo.
                    </p>
                  </div>
                  <button
                    onClick={handleStartVòng3}
                    className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-3 rounded-2xl text-sm transition-all shadow-md"
                  >
                    BẮT ĐẦU VÒNG 3
                  </button>
                </div>

                <div className="bg-gradient-to-b from-indigo-900/60 to-purple-900/40 p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between items-center text-center hover:scale-105 transition-all duration-300 group">
                  <div>
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      👑
                    </div>
                    <h3 className="text-lg font-black text-yellow-400">
                      VÒNG 4: VỀ ĐÍCH
                    </h3>
                    <p className="text-xs text-purple-200 mt-2 leading-relaxed">
                      Bản đồ câu hỏi phân loại theo chủ đề và mức điểm (10, 20,
                      30 điểm). Có tính năng kích hoạt "Ngôi Sao Hy Vọng" thần
                      thánh!
                    </p>
                  </div>
                  <button
                    onClick={handleStartVòng4}
                    className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-3 rounded-2xl text-sm transition-all shadow-md"
                  >
                    BẮT ĐẦU VÒNG 4
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "round1" && (
            <Round1
              db={db}
              currentQIndex={currentQIndex}
              setCurrentQIndex={setCurrentQIndex}
              timer={timer}
              isTimerRunning={isTimerRunning}
              triggerCountdown={triggerVòng1Countdown}
              stopCountdown={stopCountdown}
              setActiveTab={setActiveTab}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === "round2" && (
            <Round2
              db={db}
              currentQIndex={currentQIndex}
              setCurrentQIndex={setCurrentQIndex}
              timer={timer}
              isTimerRunning={isTimerRunning}
              triggerCountdown={triggerVòng2Countdown}
              stopCountdown={stopCountdown}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              sound={sound}
              triggerToast={triggerToast}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "round3" && (
            <Round3
              db={db}
              puzzlePieces={puzzlePieces}
              revealedPieces={revealedPieces}
              puzzleAnswersStatus={puzzleAnswersStatus}
              themeImageRevealed={themeImageRevealed}
              selectedPuzzleQ={selectedPuzzleQ}
              setSelectedPuzzleQ={setSelectedPuzzleQ}
              revealSinglePiece={revealSinglePiece}
              triggerCountdown={triggerVòng3Countdown}
              stopCountdown={stopCountdown}
              timer={timer}
              isTimerRunning={isTimerRunning}
              round3ThemeAnswerVisible={round3ThemeAnswerVisible}
              setRound3ThemeAnswerVisible={setRound3ThemeAnswerVisible}
              setRound3QuestionAnswerVisible={setRound3QuestionAnswerVisible}
              setThemeImageRevealed={setThemeImageRevealed}
              triggerToast={triggerToast}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "round3-question" && selectedPuzzleQ !== null && (
            <Round3Question
              db={db}
              selectedPuzzleQ={selectedPuzzleQ}
              showQuestionAnswer={round3QuestionAnswerVisible}
              setShowQuestionAnswer={setRound3QuestionAnswerVisible}
              timer={timer}
              isTimerRunning={isTimerRunning}
              triggerCountdown={triggerVòng3Countdown}
              revealSinglePiece={revealSinglePiece}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "round4" && (
            <Round4
              db={db}
              selectedVòng4Question={selectedVòng4Question}
              setSelectedVòng4Question={setSelectedVòng4Question}
              selectVòng4Question={selectVòng4Question}
              answeredVòng4Questions={answeredVòng4Questions}
              starOfHope={starOfHope}
              toggleStarOfHope={toggleStarOfHope}
              triggerCountdown={triggerVòng4Countdown}
              isTimerRunning={isTimerRunning}
              timer={timer}
              finishVòng4Question={finishVòng4Question}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              setActiveTab={setActiveTab}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === "admin" && (
            <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="bg-yellow-500 text-black font-black text-xs px-3 py-1 rounded-full uppercase">
                    Quản Trị
                  </span>
                  <h3 className="text-2xl font-black mt-1">QUẢN LÝ CÂU HỎI</h3>
                </div>
                <button
                  onClick={() => setActiveTab("welcome")}
                  className="text-xs text-red-400 hover:text-red-300 font-bold"
                >
                  Thoát
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div>
                  <h5 className="font-bold text-yellow-400 text-sm mb-2">
                    💾 Lưu Trữ Offline
                  </h5>
                  <button
                    onClick={handleResetDefault}
                    className="w-full bg-red-100 text-red-700 font-bold text-xs py-2 px-3 rounded-xl"
                  >
                    🔄 Khôi phục mẫu
                  </button>
                </div>
                <div>
                  <h5 className="font-bold text-yellow-400 text-sm mb-2">
                    📤 Xuất
                  </h5>
                  <button
                    onClick={exportDatabase}
                    className="w-full bg-blue-600 text-white font-bold text-xs py-2 px-3 rounded-xl"
                  >
                    📥 Xuất FILE JSON
                  </button>
                </div>
                <div>
                  <h5 className="font-bold text-yellow-400 text-sm mb-2">
                    📥 Nhập
                  </h5>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleImportExcel}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <textarea
                className="w-full h-72 bg-black/80 font-mono text-xs text-emerald-400 p-4 rounded-xl border border-white/10"
                value={JSON.stringify(db, null, 2)}
                onChange={(e) => {
                  try {
                    setDb(JSON.parse(e.target.value));
                  } catch (err) {}
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
