import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import './style.css'; 
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ==========================================
// 1. Firebase (通知機能) の設定エリア
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBwYqnTXHkFC-IwTp6wBNOGi19TBnYjStU",
  authDomain: "lms-pwa-3a9f0.firebaseapp.com",
  projectId: "lms-pwa-3a9f0",
  storageBucket: "lms-pwa-3a9f0.firebasestorage.app",
  messagingSenderId: "336136905814",
  appId: "1:336136905814:web:8c89eed540bfba8de947f7",
  measurementId: "G-TXLPESM5ZF",
};

const app = initializeApp(firebaseConfig);
let messaging: any = null;

try {
  if (typeof window !== "undefined") {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log("通知機能が無効です:", error);
}

const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BCyRh6AUsUP01FUl-UO27y8LDkbEXsnf-tgQUYISQIHo4YCY8RZ5wBfE0KbSiokAitEfauyDwYoNKwvnanythNI",
    });
    return currentToken || null;
  } catch (err) {
    console.log("Token error:", err);
    return null;
  }
};

const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });

// ==========================================
// 2. データ定義 & ユーティリティ
// ==========================================

const GRADE_CURRICULUM: any = {
  中1: {
    数学: [{ unit: "正の数・負の数", progress: 0 }, { unit: "文字と式", progress: 0 }, { unit: "方程式", progress: 0 }, { unit: "比例・反比例", progress: 0 }, { unit: "平面図形", progress: 0 }, { unit: "空間図形", progress: 0 }, { unit: "データの活用", progress: 0 }],
    英語: [{ unit: "be動詞", progress: 0 }, { unit: "一般動詞", progress: 0 }, { unit: "現在進行形", progress: 0 }, { unit: "助動詞can", progress: 0 }, { unit: "疑問詞", progress: 0 }],
    理科: [{ unit: "植物の生活と種類", progress: 0 }, { unit: "身のまわりの物質", progress: 0 }, { unit: "光・音・力", progress: 0 }, { unit: "大地の変化", progress: 0 }],
    社会: [{ unit: "地理：世界の姿", progress: 0 }, { unit: "歴史：古代", progress: 0 }],
    国語: [{ unit: "現代文", progress: 0 }, { unit: "古文", progress: 0 }]
  },
  中2: {
    数学: [{ unit: "式の計算", progress: 0 }, { unit: "連立方程式", progress: 0 }, { unit: "一次関数", progress: 0 }, { unit: "図形の性質", progress: 0 }, { unit: "確率", progress: 0 }],
    英語: [{ unit: "未来表現", progress: 0 }, { unit: "助動詞", progress: 0 }, { unit: "不定詞", progress: 0 }, { unit: "動名詞", progress: 0 }, { unit: "比較", progress: 0 }, { unit: "受け身", progress: 0 }],
    理科: [{ unit: "動物の生活", progress: 0 }, { unit: "化学変化", progress: 0 }, { unit: "電流", progress: 0 }, { unit: "気象", progress: 0 }],
    社会: [{ unit: "地理：日本の地域", progress: 0 }, { unit: "歴史：近世", progress: 0 }],
    国語: [{ unit: "現代文", progress: 0 }, { unit: "漢文", progress: 0 }]
  },
  中3: {
    数学: [{ unit: "展開・因数分解", progress: 0 }, { unit: "平方根", progress: 0 }, { unit: "二次方程式", progress: 0 }, { unit: "関数y=ax^2", progress: 0 }, { unit: "相似", progress: 0 }, { unit: "三平方の定理", progress: 0 }],
    英語: [{ unit: "現在完了", progress: 0 }, { unit: "分詞", progress: 0 }, { unit: "関係代名詞", progress: 0 }, { unit: "仮定法", progress: 0 }],
    理科: [{ unit: "生命の連続性", progress: 0 }, { unit: "イオン", progress: 0 }, { unit: "運動とエネルギー", progress: 0 }, { unit: "地球と宇宙", progress: 0 }],
    社会: [{ unit: "公民：現代社会", progress: 0 }, { unit: "歴史：近現代", progress: 0 }],
    国語: [{ unit: "現代文", progress: 0 }, { unit: "古文・漢文", progress: 0 }]
  },
  高1: {
    数学Ⅰ: [{ unit: "数と式", progress: 0 }, { unit: "二次関数", progress: 0 }, { unit: "図形と計量", progress: 0 }, { unit: "データの分析", progress: 0 }],
    数学A: [{ unit: "場合の数と確率", progress: 0 }, { unit: "図形の性質", progress: 0 }, { unit: "整数の性質", progress: 0 }],
    英語: [{ unit: "文型・時制", progress: 0 }, { unit: "助動詞", progress: 0 }, { unit: "不定詞・動名詞", progress: 0 }, { unit: "分詞・関係詞", progress: 0 }],
    化学基礎: [{ unit: "物質の構成", progress: 0 }, { unit: "物質の変化", progress: 0 }],
    生物基礎: [{ unit: "生物と遺伝子", progress: 0 }, { unit: "生物の体内環境", progress: 0 }],
    物理基礎: [{ unit: "物体の運動", progress: 0 }, { unit: "エネルギー", progress: 0 }],
    地学基礎: [{ unit: "地球の構造", progress: 0 }, { unit: "宇宙", progress: 0 }]
  },
  高2: {
    数学Ⅱ: [{ unit: "式と証明", progress: 0 }, { unit: "複素数", progress: 0 }, { unit: "図形と方程式", progress: 0 }, { unit: "三角関数", progress: 0 }, { unit: "指数・対数", progress: 0 }, { unit: "微積分", progress: 0 }],
    数学B: [{ unit: "数列", progress: 0 }, { unit: "統計", progress: 0 }],
    英語: [{ unit: "比較・仮定法", progress: 0 }, { unit: "否定・倒置", progress: 0 }],
    物理: [{ unit: "力学", progress: 0 }, { unit: "電磁気", progress: 0 }],
    化学: [{ unit: "物質の状態", progress: 0 }, { unit: "無機物質", progress: 0 }, { unit: "有機化合物", progress: 0 }],
    生物: [{ unit: "細胞と分子", progress: 0 }, { unit: "代謝", progress: 0 }, { unit: "遺伝", progress: 0 }],
    地学: [{ unit: "地球内部", progress: 0 }, { unit: "地層", progress: 0 }]
  },
  高3: {
    数学Ⅲ: [{ unit: "極限", progress: 0 }, { unit: "微積分", progress: 0 }],
    数学C: [{ unit: "ベクトル", progress: 0 }, { unit: "複素数平面", progress: 0 }],
    英語: [{ unit: "長文読解", progress: 0 }, { unit: "英作文", progress: 0 }],
    物理: [{ unit: "原子", progress: 0 }],
    化学: [{ unit: "高分子", progress: 0 }],
    生物: [{ unit: "生態系", progress: 0 }, { unit: "進化", progress: 0 }],
    地学: [{ unit: "宇宙の構造", progress: 0 }]
  }
};

const SimpleLineChart = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length < 2) return <div className="text-center text-xs text-slate-300 py-4">データが不足しています</div>;
  const height = 100;
  const width = 300;
  const maxVal = 100;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / maxVal) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full h-32 mb-4">
      <svg viewBox={`0 -10 ${width} ${height + 20}`} className="w-full h-full overflow-visible">
        <line x1="0" y1="0" x2={width} y2="0" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
        <line x1="0" y1={height} x2={width} y2={height} stroke="#e2e8f0" strokeWidth="1" />
        <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - (val / maxVal) * height;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
              <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{val}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ==========================================
// 3. アプリケーション本体
// ==========================================

function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("lms_v20_data");
    return saved ? JSON.parse(saved) : {};
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  
  // ログイン入力用
  const [inputId, setInputId] = useState("");
  const [inputPass, setInputPass] = useState("");
  
  // パスワードリセット用
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetId, setResetId] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  // ログイン中ユーザー情報
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [currentView, setCurrentView] = useState<"calendar" | "progress" | "test" | "mock" | "homework" | "materials">("calendar");

  // 初回ログインセットアップ用
  const [isFirstLoginSetup, setIsFirstLoginSetup] = useState(false);
  const [setupData, setSetupData] = useState({
    newPass: "", lastName: "", firstName: "", email: "", gender: "未回答",
    address: "", schoolPref: "", schoolName: "", schoolGrade: ""
  });

  // その他UI用State
  const [adviceText, setAdviceText] = useState("");
  const [studentComment, setStudentComment] = useState("");
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // 教材・テスト作成用
  const [matTitle, setMatTitle] = useState("");
  const [matUrl, setMatUrl] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [graphSubject, setGraphSubject] = useState("数学");

  // 【講師用】新規生徒作成
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("中1");
  const [newStudentSubjects, setNewStudentSubjects] = useState<string[]>([]);
  
  // 【講師用】科目編集モード & 固定スケジュール入力用
  const [isEditingSubjects, setIsEditingSubjects] = useState(false);
  const [fixedDayInput, setFixedDayInput] = useState(1); // 1:月曜
  const [fixedTimeInput, setFixedTimeInput] = useState("19:00");

  // 通知監視 & データ保存
  useEffect(() => {
    onMessageListener()
      .then((payload: any) => {
        alert(`🔔 ${payload.notification.title}\n${payload.notification.body}`);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("lms_v20_data", JSON.stringify(students));
    setNewStudentId(generateNextId());
  }, [students]);

  // 学年が変わったらデフォルトでその学年の全科目を選択状態にする
  useEffect(() => {
    if (GRADE_CURRICULUM[newStudentGrade]) {
      setNewStudentSubjects(Object.keys(GRADE_CURRICULUM[newStudentGrade]));
    } else {
      setNewStudentSubjects([]);
    }
  }, [newStudentGrade]);

  const generateNextId = () => {
    const yearPrefix = new Date().getFullYear().toString().slice(-2);
    const existingIds = Object.keys(students).filter(id => id.startsWith(yearPrefix));
    if (existingIds.length === 0) return `${yearPrefix}0001`;
    const lastNum = Math.max(...existingIds.map(id => parseInt(id.slice(2))));
    return `${yearPrefix}${(lastNum + 1).toString().padStart(4, "0")}`;
  };

  const handleLogin = () => {
    if (role === "student") {
      const s = students[inputId];
      if (s && s.password === inputPass) {
        setCurrentStudentId(inputId);
        if (s.isFirstLogin) {
          setSetupData({ ...setupData, schoolGrade: s.grade });
          setIsFirstLoginSetup(true);
        } else {
          const firstSub = Object.keys(s.subjects)[0] || "";
          setSubject(firstSub);
          setLoggedIn(true);
        }
      } else alert("IDまたはパスワードが違います");
    } else {
      if (inputId === "1250001" && inputPass === "katagiriT") {
        setLoggedIn(true);
        setCurrentStudentId(null);
      } else alert("講師ログイン失敗");
    }
  };

  const handleFirstLoginSetup = () => {
    const { newPass, lastName, firstName, email, gender, address, schoolPref, schoolName, schoolGrade } = setupData;
    if (!newPass || !lastName || !firstName || !email || !address || !schoolName) {
      return alert("すべての必須項目を入力してください");
    }
    
    const updated = { ...students };
    const s = updated[currentStudentId!];
    
    s.password = newPass;
    s.name = `${lastName} ${firstName}`; 
    s.profile = { lastName, firstName, email, gender, address, schoolPref, schoolName, schoolGrade };
    s.isFirstLogin = false; 
    
    setStudents(updated);
    setIsFirstLoginSetup(false);
    setLoggedIn(true);
    setSubject(Object.keys(s.subjects)[0] || "");
    alert("セットアップが完了しました！");
  };

  const handleResetPassword = () => {
    const s = students[resetId];
    if (s && s.profile && s.profile.email === resetEmail) {
      alert(`【メール送信完了】\n${resetEmail} 宛にパスワードリセットメールを送信しました。\n\n(※開発用表示: パスワードは「${s.password}」です)`);
      setIsForgotPassword(false);
      setResetId("");
      setResetEmail("");
    } else {
      alert("IDとメールアドレスが一致するユーザーが見つかりません。");
    }
  };

  const handleNotificationSetup = async () => {
    const token = await requestForToken();
    if (token) {
      setFcmToken(token);
      alert("通知設定完了: " + token.slice(0, 10) + "...");
    } else {
      alert("通知の許可が得られませんでした。");
    }
  };

  const createStudent = () => {
    const name = (document.getElementById("nName") as HTMLInputElement).value;
    const pass = (document.getElementById("nPass") as HTMLInputElement).value;
    if (!name || !pass || newStudentSubjects.length === 0) return alert("入力不足です");
    
    const selectedSubjectsData: any = {};
    newStudentSubjects.forEach(subj => {
      selectedSubjectsData[subj] = JSON.parse(JSON.stringify(GRADE_CURRICULUM[newStudentGrade][subj]));
    });

    const newStudent = {
      name, 
      password: pass, 
      grade: newStudentGrade, 
      subjects: selectedSubjectsData, 
      isFirstLogin: true, 
      tests: [], mocks: [], records: [], homeworks: [], materials: [], meetingUrl: "",
      profile: {},
      // ★追加: 固定授業・キャンセル・予約管理用
      fixedSchedules: [], // { dayOfWeek: 1, time: "19:00" }
      cancellations: [],  // "2026/2/3" (キャンセルされた日付)
      bookings: []        // { date: "2026/2/5", time: "20:00" } (振替などの単発予約)
    };

    setStudents({ ...students, [newStudentId]: newStudent });
    alert(`ID: ${newStudentId} 登録完了`);
    (document.getElementById("nName") as HTMLInputElement).value = ""; 
    (document.getElementById("nPass") as HTMLInputElement).value = ""; 
  };

  const toggleSubject = (subjName: string) => {
    if (!currentStudentId) return;
    const updated = { ...students };
    const s = updated[currentStudentId];

    if (s.subjects[subjName]) {
      if (window.confirm(`${subjName} を削除しますか？\nこれまでの進捗データも消えます。`)) {
        delete s.subjects[subjName];
      }
    } else {
      const grade = s.grade || "中1"; 
      const curriculum = GRADE_CURRICULUM[grade]?.[subjName];
      if (curriculum) {
        s.subjects[subjName] = JSON.parse(JSON.stringify(curriculum));
      } else {
        s.subjects[subjName] = [{ unit: "自由学習", progress: 0 }];
      }
    }
    setStudents(updated);
  };

  // --- カレンダー関連ロジック（強化版） ---
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i).toLocaleDateString());
    return days;
  };

  // 指定した日付のステータスを取得（固定授業？キャンセル済？予約あり？）
  const getDayStatus = (dateStr: string | null) => {
    if (!dateStr || !currentStudent) return null;
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay(); // 0(日)~6(土)

    // 1. 単発予約があるか？
    const booking = currentStudent.bookings?.find((b: any) => b.date === dateStr);
    if (booking) return { type: "booked", time: booking.time };

    // 2. 固定授業があるか？
    const fixed = currentStudent.fixedSchedules?.find((f: any) => f.dayOfWeek === dayOfWeek);
    if (fixed) {
      // 3. キャンセルされているか？
      const isCancelled = currentStudent.cancellations?.includes(dateStr);
      if (isCancelled) return { type: "cancelled", time: fixed.time };
      return { type: "fixed", time: fixed.time };
    }

    return null;
  };

  // 固定スケジュールの追加
  const addFixedSchedule = () => {
    if (!currentStudentId) return;
    const updated = { ...students };
    if (!updated[currentStudentId].fixedSchedules) updated[currentStudentId].fixedSchedules = [];
    
    // 同じ曜日の設定があれば上書き、なければ追加
    const existingIdx = updated[currentStudentId].fixedSchedules.findIndex((f: any) => f.dayOfWeek === Number(fixedDayInput));
    const newSchedule = { dayOfWeek: Number(fixedDayInput), time: fixedTimeInput };
    
    if (existingIdx >= 0) {
      updated[currentStudentId].fixedSchedules[existingIdx] = newSchedule;
    } else {
      updated[currentStudentId].fixedSchedules.push(newSchedule);
    }
    setStudents(updated);
    alert("固定授業を設定しました");
  };

  // 固定スケジュールの削除
  const removeFixedSchedule = (dayOfWeek: number) => {
    if (!currentStudentId) return;
    const updated = { ...students };
    updated[currentStudentId].fixedSchedules = updated[currentStudentId].fixedSchedules.filter((f: any) => f.dayOfWeek !== dayOfWeek);
    setStudents(updated);
  };

  // 授業のキャンセル（固定授業を特定の日だけ休みにする）
  const cancelLesson = () => {
    if (!currentStudentId || !selectedDate) return;
    if (!window.confirm(`${selectedDate} の授業をキャンセルしますか？`)) return;
    const updated = { ...students };
    if (!updated[currentStudentId].cancellations) updated[currentStudentId].cancellations = [];
    updated[currentStudentId].cancellations.push(selectedDate);
    setStudents(updated);
  };

  // 授業のキャンセルを取り消す（元に戻す）
  const restoreLesson = () => {
    if (!currentStudentId || !selectedDate) return;
    const updated = { ...students };
    updated[currentStudentId].cancellations = updated[currentStudentId].cancellations.filter((d: string) => d !== selectedDate);
    setStudents(updated);
  };

  // 単発予約（振替など）を入れる
  const addBooking = (time: string) => {
    if (!currentStudentId || !selectedDate) return;
    const updated = { ...students };
    if (!updated[currentStudentId].bookings) updated[currentStudentId].bookings = [];
    updated[currentStudentId].bookings.push({ date: selectedDate, time });
    setStudents(updated);
    alert("予約を追加しました");
  };

  // 単発予約を削除
  const removeBooking = () => {
    if (!currentStudentId || !selectedDate) return;
    if (!window.confirm(`${selectedDate} の予約を取り消しますか？`)) return;
    const updated = { ...students };
    updated[currentStudentId].bookings = updated[currentStudentId].bookings.filter((b: any) => b.date !== selectedDate);
    setStudents(updated);
  };

  // ------------------------------------

  const saveRecord = (type: "advice" | "question") => {
    if (!currentStudentId) return;
    const text = type === "advice" ? adviceText : studentComment;
    if (!text) return;
    const updated = { ...students };
    if (!updated[currentStudentId].records) updated[currentStudentId].records = [];
    updated[currentStudentId].records.push({ date: selectedDate, type, text, timestamp: new Date().toLocaleTimeString() });
    setStudents(updated);
    if (type === "advice") setAdviceText(""); else setStudentComment("");
    alert("保存しました");
  };

  const currentStudent = currentStudentId ? students[currentStudentId] : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-rose-100 pb-20">
      
      {/* --- 初回ログインセットアップ画面（モーダル） --- */}
      {isFirstLoginSetup && (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-center mb-2">👋 はじめまして！</h2>
            <p className="text-center text-slate-400 text-xs font-bold mb-8">最初にあなたのプロフィールを教えてください</p>
            
            <div className="space-y-4">
              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 mb-6">
                <label className="text-[10px] font-black text-rose-400 block mb-1">新しいパスワード (必須)</label>
                <input className="w-full bg-white p-3 rounded-xl font-bold outline-none border-2 border-rose-100 focus:border-rose-400" type="password" placeholder="忘れないパスワードを設定" value={setupData.newPass} onChange={e => setSetupData({...setupData, newPass: e.target.value})} />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                <label className="text-[10px] font-black text-slate-400 block mb-1">メールアドレス (パスワード復旧用)</label>
                <input className="w-full bg-white p-3 rounded-xl font-bold outline-none border-2 border-slate-100 focus:border-slate-400" type="email" placeholder="example@email.com" value={setupData.email} onChange={e => setSetupData({...setupData, email: e.target.value})} />
              </div>

              {/* 名前、性別、住所などは省略せずそのまま配置 */}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-black text-slate-400 ml-2">姓</label><input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="山田" value={setupData.lastName} onChange={e => setSetupData({...setupData, lastName: e.target.value})} /></div>
                <div><label className="text-[10px] font-black text-slate-400 ml-2">名</label><input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="太郎" value={setupData.firstName} onChange={e => setSetupData({...setupData, firstName: e.target.value})} /></div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 ml-2">性別</label>
                <select className="w-full bg-slate-100 p-3 rounded-xl font-bold outline-none" value={setupData.gender} onChange={e => setSetupData({...setupData, gender: e.target.value})}>
                  <option value="未回答">選択しない</option><option value="男性">男性</option><option value="女性">女性</option><option value="その他">その他</option>
                </select>
              </div>
              <div><label className="text-[10px] font-black text-slate-400 ml-2">住所</label><input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="例: 東京都渋谷区..." value={setupData.address} onChange={e => setSetupData({...setupData, address: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-black text-slate-400 ml-2">学校の都道府県</label><input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="東京都" value={setupData.schoolPref} onChange={e => setSetupData({...setupData, schoolPref: e.target.value})} /></div>
                <div><label className="text-[10px] font-black text-slate-400 ml-2">学年</label><input className="w-full bg-slate-100 p-3 rounded-xl font-bold" value={setupData.schoolGrade} onChange={e => setSetupData({...setupData, schoolGrade: e.target.value})} /></div>
              </div>
              <div><label className="text-[10px] font-black text-slate-400 ml-2">学校名</label><input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="〇〇中学校" value={setupData.schoolName} onChange={e => setSetupData({...setupData, schoolName: e.target.value})} /></div>

              <button onClick={handleFirstLoginSetup} className="w-full py-4 mt-6 bg-slate-800 text-white rounded-2xl font-black shadow-lg hover:bg-slate-700 transition-all">登録してスタート！ 🚀</button>
            </div>
          </div>
        </div>
      )}

      {/* --- パスワード忘れモーダル --- */}
      {isForgotPassword && (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4">
           <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-300">
             <button onClick={() => setIsForgotPassword(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold">✕ 閉じる</button>
             <h3 className="text-xl font-black text-slate-800 mb-4 text-center">パスワード再発行</h3>
             <p className="text-xs text-slate-500 mb-6 text-center">登録時のIDとメールアドレスを入力してください。</p>
             <div className="space-y-4">
               <input className="w-full bg-slate-100 p-4 rounded-xl font-bold" placeholder="ID" value={resetId} onChange={e => setResetId(e.target.value)} />
               <input className="w-full bg-slate-100 p-4 rounded-xl font-bold" type="email" placeholder="メールアドレス" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
               <button onClick={handleResetPassword} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg">メールを送信</button>
             </div>
           </div>
        </div>
      )}

      {/* --- ログイン画面 --- */}
      {!loggedIn ? (
        <div className={`fixed inset-0 flex items-center justify-center ${role === "student" ? "bg-blue-50" : "bg-rose-50"}`}>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-white">
            <h1 className="text-3xl font-black text-center mb-8 italic tracking-tighter text-slate-800">LMS <span className="text-rose-500">V20</span></h1>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
              <button onClick={() => setRole("student")} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${role === "student" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>STUDENT</button>
              <button onClick={() => setRole("teacher")} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${role === "teacher" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}>TEACHER</button>
            </div>
            <input className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="ID" value={inputId} onChange={(e) => setInputId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <input className="w-full p-4 mb-6 bg-slate-50 rounded-2xl outline-none font-bold" type="password" placeholder="PASS" value={inputPass} onChange={(e) => setInputPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={handleLogin} className={`w-full py-4 rounded-2xl font-black text-white shadow-lg mb-4 ${role === "student" ? "bg-blue-600" : "bg-rose-600"}`}>LOGIN</button>
            {role === "student" && (
              <button onClick={() => setIsForgotPassword(true)} className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 underline">パスワードを忘れた方はこちら</button>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 md:p-10">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic text-slate-300 tracking-tighter">{role === "teacher" ? "TEACHER'S CONSOLE" : "MY DASHBOARD"}</h2>
            <button onClick={() => setLoggedIn(false)} className="px-6 py-2 text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">LOGOUT</button>
          </header>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* --- 左カラム：生徒リスト or プロフィール --- */}
            <div className="lg:col-span-4 space-y-6">
              {role === "teacher" ? (
                <>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2"><span className="w-2 h-2 bg-rose-500 rounded-full"></span> 新規生徒登録</h3>
                    <div className="space-y-3">
                      <div><label className="text-[10px] font-black text-slate-400 ml-2">AUTO-ID</label><input value={newStudentId} readOnly className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-black text-slate-500 cursor-not-allowed" /></div>
                      <input id="nName" placeholder="生徒氏名 (仮)" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" />
                      <input id="nPass" placeholder="初期パスワード" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" />
                      <select value={newStudentGrade} onChange={(e) => setNewStudentGrade(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-black outline-none cursor-pointer">
                        {Object.keys(GRADE_CURRICULUM).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 mb-2">受講科目を選択</p>
                          <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
                            {GRADE_CURRICULUM[newStudentGrade] && Object.keys(GRADE_CURRICULUM[newStudentGrade]).map(subj => (
                              <label key={subj} className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                                <input type="checkbox" checked={newStudentSubjects.includes(subj)} 
                                  onChange={e => {
                                    if (e.target.checked) setNewStudentSubjects([...newStudentSubjects, subj]);
                                    else setNewStudentSubjects(newStudentSubjects.filter(s => s !== subj));
                                  }}
                                />
                                {subj}
                              </label>
                            ))}
                          </div>
                      </div>
                      <button className="w-full mt-2 py-4 bg-slate-800 text-white rounded-2xl font-black shadow-lg hover:bg-slate-700" onClick={createStudent}>生徒を作成</button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scroll">
                    {Object.entries(students).map(([id, s]: any) => (
                      <button key={id} onClick={() => { setCurrentStudentId(id); setSubject(Object.keys(s.subjects)[0] || ""); setIsEditingSubjects(false); }} className={`w-full text-left p-5 rounded-[1.8rem] border transition-all group ${currentStudentId === id ? "bg-white border-rose-400 shadow-xl ring-4 ring-rose-50" : "bg-white border-transparent shadow-sm opacity-70 hover:opacity-100"}`}>
                        <div className="flex justify-between items-center"><div><p className="text-[10px] font-black text-slate-300 group-hover:text-rose-400">#{id}</p><p className="font-black text-slate-800 text-lg">{s.name}</p></div><span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{s.grade}</span></div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black bg-white/20 px-4 py-1.5 rounded-full inline-block uppercase tracking-widest">{currentStudent!.grade}</p>
                    <h2 className="text-3xl font-black mt-4 mb-2">{currentStudent!.name}</h2>
                    {currentStudent.profile && (
                      <div className="text-xs text-white/70 mb-6 font-bold leading-relaxed">
                        {currentStudent.profile.schoolName} {currentStudent.profile.schoolGrade}<br/>
                        {currentStudent.profile.address}
                      </div>
                    )}
                    {currentStudent.meetingUrl ? (
                      <a href={currentStudent.meetingUrl} target="_blank" rel="noreferrer" className="block w-full py-5 bg-rose-500 hover:bg-rose-400 text-white rounded-2xl font-black text-center shadow-lg transform hover:-translate-y-1 transition-all animate-pulse mb-6 border-2 border-rose-400/50">🎥 今すぐ授業に参加</a>
                    ) : <div className="bg-white/10 p-4 rounded-xl text-center text-xs font-bold text-white/50 mb-6 border border-white/10">授業URL未設定</div>}
                    <div className="pt-8 border-t border-white/20">
                      <p className="text-[10px] font-bold opacity-60 mb-2">QUICK ACTION</p>
                      <button onClick={handleNotificationSetup} className="flex items-center justify-center gap-2 w-full py-4 mb-3 bg-purple-600 text-white rounded-2xl font-black text-xs cursor-pointer hover:bg-purple-50 shadow-lg transition-all">🔔 通知を受け取る設定</button>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                </div>
              )}
            </div>

            {/* --- 右カラム：詳細エリア --- */}
            <div className="lg:col-span-8">
              {currentStudent ? (
                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm min-h-[600px] border border-slate-100">
                  
                  {/* 講師用：生徒管理パネル */}
                  {role === "teacher" && (
                    <div className="mb-8">
                      <div className="p-6 bg-slate-800 rounded-[2rem] text-white shadow-lg mb-4">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                           <div className="flex-1 w-full">
                              <label className="text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-wider">オンライン授業 URL</label>
                              <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-xl border border-slate-600">
                                <span className="text-xl pl-2">🔗</span>
                                <input type="text" value={currentStudent.meetingUrl || ""} onChange={(e) => {const u = {...students}; u[currentStudentId!].meetingUrl = e.target.value; setStudents(u)}} placeholder="https://zoom.us/..." className="w-full bg-transparent border-none outline-none text-sm font-bold text-white" />
                              </div>
                           </div>
                           {currentStudent.meetingUrl && <a href={currentStudent.meetingUrl} target="_blank" rel="noreferrer" className="px-6 py-4 bg-rose-500 text-white rounded-xl font-black text-xs">入室</a>}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-start bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-600 space-y-1">
                          <p><span className="text-slate-400">氏名:</span> {currentStudent.profile?.lastName} {currentStudent.profile?.firstName}</p>
                          <p><span className="text-slate-400">Email:</span> {currentStudent.profile?.email || "未登録"}</p>
                        </div>
                        <button onClick={() => setIsEditingSubjects(!isEditingSubjects)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-100">
                          {isEditingSubjects ? "編集を終了" : "科目・日程を編集"}
                        </button>
                      </div>

                      {/* 科目・日程編集エリア */}
                      {isEditingSubjects && (
                        <div className="mt-4 p-6 bg-yellow-50 rounded-2xl border border-yellow-200 animate-in fade-in">
                          <h4 className="font-black text-yellow-600 mb-4">履修科目の変更</h4>
                          <div className="flex flex-wrap gap-3 mb-6">
                            {GRADE_CURRICULUM[currentStudent.grade] && Object.keys(GRADE_CURRICULUM[currentStudent.grade]).map(subj => (
                              <button key={subj} onClick={() => toggleSubject(subj)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentStudent.subjects[subj] ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-400 border border-slate-200"}`}>
                                {currentStudent.subjects[subj] ? "✅ " : "+ "} {subj}
                              </button>
                            ))}
                          </div>

                          {/* ★追加機能：固定スケジュール設定 */}
                          <div className="pt-6 border-t border-yellow-200/50">
                            <h4 className="font-black text-yellow-600 mb-4">📅 固定授業の設定 (毎週)</h4>
                            <div className="flex gap-2 mb-4">
                              <select className="p-3 rounded-xl text-xs font-bold border-none outline-none" value={fixedDayInput} onChange={e => setFixedDayInput(Number(e.target.value))}>
                                {["日","月","火","水","木","金","土"].map((d,i) => <option key={i} value={i}>{d}曜</option>)}
                              </select>
                              <input type="time" className="p-3 rounded-xl text-xs font-bold border-none outline-none" value={fixedTimeInput} onChange={e => setFixedTimeInput(e.target.value)} />
                              <button onClick={addFixedSchedule} className="bg-yellow-600 text-white px-5 rounded-xl text-xs font-black hover:bg-yellow-700">追加 / 更新</button>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {currentStudent.fixedSchedules?.map((f: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                                  <span>{["日","月","火","水","木","金","土"][f.dayOfWeek]}曜 {f.time}</span>
                                  <button onClick={() => removeFixedSchedule(f.dayOfWeek)} className="text-red-400 hover:text-red-600">×</button>
                                </div>
                              ))}
                              {!currentStudent.fixedSchedules?.length && <span className="text-xs text-slate-400 font-bold">固定授業なし</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
                    {[{ k: "calendar", l: "📅 CALENDAR" }, { k: "progress", l: "📊 PROGRESS" }, { k: "test", l: "📝 TESTS" }, { k: "materials", l: "📚 MATERIALS" }].map((tab) => (
                      <button key={tab.k} onClick={() => setCurrentView(tab.k as any)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all ${currentView === tab.k ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>{tab.l}</button>
                    ))}
                  </div>

                  {/* --- カレンダービュー (機能強化) --- */}
                  {currentView === "calendar" && (
                    <div className="grid md:grid-cols-2 gap-10 animate-in fade-in">
                      <div>
                        <div className="flex justify-between items-center mb-6 px-2">
                          <h3 className="font-black text-xl text-slate-800">{viewDate.getFullYear()}.{viewDate.getMonth() + 1}</h3>
                          <div className="flex gap-2"><button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs">◀</button><button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs">▶</button></div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d => <div key={d} className="text-center text-[8px] font-black text-slate-300 mb-1">{d}</div>)}
                          {getCalendarDays().map((date, i) => {
                             const status = getDayStatus(date);
                             const hasRecord = date && currentStudent.records?.some((r: any) => r.date === date);
                             return (
                               <button key={i} disabled={!date} onClick={() => date && setSelectedDate(date)} className={`aspect-square rounded-2xl text-xs font-bold relative transition-all flex items-center justify-center ${selectedDate === date ? "bg-slate-800 text-white shadow-lg" : "bg-slate-50 text-slate-600 hover:bg-slate-100"} ${!date && "invisible"}`}>
                                 {date ? date.split("/")[2] : ""}
                                 {/* 固定授業 or 予約アイコン */}
                                 {status?.type === "fixed" && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>}
                                 {status?.type === "booked" && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
                                 {status?.type === "cancelled" && <span className="absolute top-1 right-1 text-[8px]">❌</span>}
                                 {/* レポートありマーク */}
                                 {hasRecord && <span className={`absolute bottom-2 w-1 h-1 rounded-full ${selectedDate === date ? "bg-white/50" : "bg-green-400"}`}></span>}
                               </button>
                             );
                          })}
                        </div>
                        
                        {/* 凡例 */}
                        <div className="flex gap-3 mt-4 justify-center">
                           <div className="flex items-center gap-1"><span className="w-2 h-2 bg-rose-500 rounded-full"></span><span className="text-[9px] font-bold text-slate-400">固定授業</span></div>
                           <div className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span><span className="text-[9px] font-bold text-slate-400">単発/振替</span></div>
                           <div className="flex items-center gap-1"><span className="text-[9px]">❌</span><span className="text-[9px] font-bold text-slate-400">キャンセル</span></div>
                        </div>
                      </div>

                      <div className="flex flex-col h-full">
                        <div className="pb-4 border-b border-slate-100 mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DATE</p><h4 className="text-2xl font-black text-slate-800">{selectedDate}</h4></div>
                        
                        {/* --- ★追加機能: 授業予約・キャンセルパネル --- */}
                        <div className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           {(() => {
                              const s = getDayStatus(selectedDate);
                              if (s?.type === "fixed") {
                                return (
                                  <div className="flex justify-between items-center">
                                     <div><span className="badge bg-rose-500 text-white text-[10px] px-2 py-1 rounded-md font-bold">固定授業</span> <span className="text-sm font-bold ml-1">{s.time}〜</span></div>
                                     <button onClick={cancelLesson} className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-white border border-red-100 px-3 py-1.5 rounded-lg shadow-sm">キャンセルする</button>
                                  </div>
                                );
                              } else if (s?.type === "cancelled") {
                                return (
                                  <div className="flex justify-between items-center">
                                     <div><span className="badge bg-slate-400 text-white text-[10px] px-2 py-1 rounded-md font-bold">お休み</span> <span className="text-xs text-slate-400 ml-1 font-bold line-through">{s.time}〜</span></div>
                                     <button onClick={restoreLesson} className="text-[10px] font-bold text-blue-500 hover:text-blue-700 bg-white border border-blue-100 px-3 py-1.5 rounded-lg shadow-sm">元に戻す</button>
                                  </div>
                                );
                              } else if (s?.type === "booked") {
                                return (
                                  <div className="flex justify-between items-center">
                                     <div><span className="badge bg-blue-500 text-white text-[10px] px-2 py-1 rounded-md font-bold">予約あり</span> <span className="text-sm font-bold ml-1">{s.time}〜</span></div>
                                     <button onClick={removeBooking} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">取り消し</button>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="flex items-center gap-2">
                                     <span className="text-xs font-bold text-slate-400">予定なし</span>
                                     <div className="flex-1 flex gap-2 justify-end">
                                       <select id="bookingTime" className="p-1 text-xs rounded border-none font-bold bg-white text-slate-600"><option>10:00</option><option>13:00</option><option>15:00</option><option>17:00</option><option>19:00</option><option>20:00</option><option>21:00</option></select>
                                       <button onClick={() => addBooking((document.getElementById("bookingTime") as HTMLSelectElement).value)} className="text-[10px] font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-700">＋ 予約を入れる</button>
                                     </div>
                                  </div>
                                );
                              }
                           })()}
                        </div>

                        <div className="mb-6">
                           <textarea className={`w-full h-20 p-4 rounded-2xl border-none outline-none text-sm font-medium focus:ring-2 transition-all resize-none ${role === "teacher" ? "bg-rose-50 focus:ring-rose-200" : "bg-blue-50 focus:ring-blue-200"}`} placeholder={role === "teacher" ? "授業記録..." : "質問・振り返り..."} value={role === "teacher" ? adviceText : studentComment} onChange={(e) => role === "teacher" ? setAdviceText(e.target.value) : setStudentComment(e.target.value)} />
                           <button onClick={() => saveRecord(role === "teacher" ? "advice" : "question")} className={`w-full mt-2 py-3 text-white rounded-xl font-black text-xs transition-all ${role === "teacher" ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"}`}>送信</button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px] custom-scroll">
                          {currentStudent.records?.filter((r: any) => r.date === selectedDate).length > 0 ? currentStudent.records.filter((r: any) => r.date === selectedDate).map((r: any, i: number) => (
                              <div key={i} className={`p-4 rounded-2xl border ${r.type === "advice" ? "bg-rose-50/50 border-rose-100" : "bg-blue-50/50 border-blue-100"}`}>
                                <p className={`text-[9px] font-black mb-1 ${r.type === "advice" ? "text-rose-400" : "text-blue-400"}`}>{r.timestamp} {r.type === "advice" ? "TEACHER" : "STUDENT"}</p>
                                <p className="text-sm font-bold text-slate-700 whitespace-pre-wrap">{r.text}</p>
                              </div>
                            )) : <div className="text-center text-slate-300 text-sm font-bold italic py-10">記録なし</div>}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentView === "progress" && (
                    <div className="animate-in fade-in">
                      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
                        {Object.keys(currentStudent.subjects).map(s => (
                          <button key={s} onClick={() => setSubject(s)} className={`px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${subject === s ? "bg-slate-800 text-white shadow-lg" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>{s}</button>
                        ))}
                      </div>
                      {subject && currentStudent.subjects[subject] ? (
                        <div className="grid md:grid-cols-2 gap-6">
                          {currentStudent.subjects[subject].map((r: any, i: number) => (
                            <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-end mb-3"><span className="text-xs font-bold text-slate-500">{r.unit}</span><span className="text-xl font-black text-blue-600">{r.progress}%</span></div>
                              <input type="range" min="0" max="100" step="10" value={r.progress} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" onChange={(e) => { if (role === "student") return; const updated = { ...students }; updated[currentStudentId!].subjects[subject][i].progress = Number(e.target.value); setStudents(updated); }} disabled={role === "student"} />
                            </div>
                          ))}
                        </div>
                      ) : <div className="text-center py-20 text-slate-300 font-bold">科目を選択してください</div>}
                    </div>
                  )}

                  {currentView === "test" && (
                     <div className="animate-in fade-in">
                       <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8">
                         <div className="flex justify-between items-center mb-4"><h4 className="text-xs font-black text-slate-400 uppercase">Score Trend</h4><select className="p-2 rounded-lg text-xs font-bold bg-white border-none" value={graphSubject} onChange={(e) => setGraphSubject(e.target.value)}>{Object.keys(currentStudent.subjects).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                         {currentStudent.tests?.some((t:any) => t.status === "approved") ? <SimpleLineChart data={currentStudent.tests.filter((t:any) => t.status === "approved").map((t:any) => Number(t.scores[graphSubject]?.result || 0))} color="#e11d48" /> : <div className="text-center text-xs text-slate-300 py-10 font-bold">データ不足</div>}
                       </div>
                       <div className="space-y-4">{currentStudent.tests?.map((t: any, i: number) => ( <div key={i} className="p-6 rounded-2xl border bg-white"><p className="font-bold">{t.title}</p></div> ))}</div>
                     </div>
                  )}
                  
                  {currentView === "materials" && (
                    <div className="space-y-6 animate-in fade-in">
                      <div className={`p-6 rounded-2xl flex gap-2 ${role === "teacher" ? "bg-indigo-50" : "bg-blue-50"}`}>
                        <input placeholder="教材タイトル" className="flex-1 p-3 rounded-xl border-none text-sm outline-none" value={matTitle} onChange={(e) => setMatTitle(e.target.value)} />
                        <input placeholder="URL" className="flex-1 p-3 rounded-xl border-none text-sm outline-none" value={matUrl} onChange={(e) => setMatUrl(e.target.value)} />
                        <button onClick={() => { if(!matTitle || !matUrl) return; const u = {...students}; if(!u[currentStudentId!].materials) u[currentStudentId!].materials = []; u[currentStudentId!].materials.push({title: matTitle, url: matUrl, date: new Date().toLocaleDateString(), by: role}); setStudents(u); setMatTitle(""); setMatUrl(""); }} className={`px-6 text-white rounded-xl font-black text-xs ${role === "teacher" ? "bg-indigo-600" : "bg-blue-600"}`}>追加</button>
                      </div>
                      <div className="grid gap-3">{currentStudent.materials?.map((m: any, i: number) => (<a key={i} href={m.url} target="_blank" rel="noreferrer" className="block p-5 border rounded-2xl shadow-sm hover:shadow-md transition-all">🔗 {m.title}</a>))}</div>
                    </div>
                  )}

                </div>
              ) : <div className="h-full flex flex-col items-center justify-center text-slate-300 border-4 border-dashed border-slate-200 rounded-[3rem] min-h-[600px]">SELECT STUDENT</div>}
            </div>
          </div>
        </div>
      )}

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
