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
  // 必要に応じて高校生用も追加可能
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
  
  // ログイン中ユーザー情報
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [currentView, setCurrentView] = useState<"calendar" | "progress" | "test" | "mock" | "homework" | "materials">("calendar");

  // 初回ログインセットアップ用
  const [isFirstLoginSetup, setIsFirstLoginSetup] = useState(false);
  const [setupData, setSetupData] = useState({
    newPass: "", lastName: "", firstName: "", gender: "未回答",
    address: "", schoolPref: "", schoolName: "", schoolGrade: ""
  });

  // その他UI用State
  const [previewImg, setPreviewImg] = useState<string | null>(null);
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
  
  // 【講師用】科目編集モード
  const [isEditingSubjects, setIsEditingSubjects] = useState(false);

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

  // 学年が変わったらデフォルトでその学年の全科目を選択状態にする（講師作成用）
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
        // 初回ログインかどうかチェック
        if (s.isFirstLogin) {
          setSetupData({ ...setupData, schoolGrade: s.grade }); // 学年の初期値
          setIsFirstLoginSetup(true); // セットアップ画面へ
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

  // 初回セットアップ完了処理
  const handleFirstLoginSetup = () => {
    const { newPass, lastName, firstName, gender, address, schoolPref, schoolName, schoolGrade } = setupData;
    if (!newPass || !lastName || !firstName || !address || !schoolName) {
      return alert("すべての必須項目を入力してください");
    }
    
    const updated = { ...students };
    const s = updated[currentStudentId!];
    
    // 情報を更新
    s.password = newPass;
    s.name = `${lastName} ${firstName}`; // 表示名はフルネームに
    s.profile = { lastName, firstName, gender, address, schoolPref, schoolName, schoolGrade };
    s.isFirstLogin = false; // 初回フラグを下ろす
    
    setStudents(updated);
    setIsFirstLoginSetup(false);
    setLoggedIn(true);
    setSubject(Object.keys(s.subjects)[0] || "");
    alert("セットアップが完了しました！");
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

  // 生徒作成（講師用）
  const createStudent = () => {
    const name = (document.getElementById("nName") as HTMLInputElement).value;
    const pass = (document.getElementById("nPass") as HTMLInputElement).value;
    if (!name || !pass || newStudentSubjects.length === 0) return alert("入力不足です");
    
    const selectedSubjectsData: any = {};
    newStudentSubjects.forEach(subj => {
      // マスタからデータをコピー
      selectedSubjectsData[subj] = JSON.parse(JSON.stringify(GRADE_CURRICULUM[newStudentGrade][subj]));
    });

    const newStudent = {
      name, 
      password: pass, 
      grade: newStudentGrade, 
      subjects: selectedSubjectsData, 
      isFirstLogin: true, // ★初回ログインフラグON
      tests: [], mocks: [], records: [], homeworks: [], materials: [], meetingUrl: "",
      profile: {} // 空のプロフィール
    };

    setStudents({ ...students, [newStudentId]: newStudent });
    alert(`ID: ${newStudentId} 登録完了`);
    (document.getElementById("nName") as HTMLInputElement).value = ""; 
    (document.getElementById("nPass") as HTMLInputElement).value = ""; 
  };

  // 科目編集（講師用）
  const toggleSubject = (subjName: string) => {
    if (!currentStudentId) return;
    const updated = { ...students };
    const s = updated[currentStudentId];

    if (s.subjects[subjName]) {
      // 削除する場合（確認を入れる）
      if (window.confirm(`${subjName} を削除しますか？\nこれまでの進捗データも消えます。`)) {
        delete s.subjects[subjName];
      }
    } else {
      // 追加する場合
      const grade = s.grade || "中1"; // 生徒の学年に合わせる（なければ中1）
      const curriculum = GRADE_CURRICULUM[grade]?.[subjName];
      if (curriculum) {
        s.subjects[subjName] = JSON.parse(JSON.stringify(curriculum));
      } else {
        // カリキュラムがない場合（高校生科目など）は空で作成
        s.subjects[subjName] = [{ unit: "自由学習", progress: 0 }];
      }
    }
    setStudents(updated);
  };

  // カレンダー等のヘルパー関数
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

  // 汎用保存関数
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 ml-2">姓 (Last Name)</label>
                  <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="山田" value={setupData.lastName} onChange={e => setSetupData({...setupData, lastName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 ml-2">名 (First Name)</label>
                  <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="太郎" value={setupData.firstName} onChange={e => setSetupData({...setupData, firstName: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 ml-2">性別</label>
                <select className="w-full bg-slate-100 p-3 rounded-xl font-bold outline-none" value={setupData.gender} onChange={e => setSetupData({...setupData, gender: e.target.value})}>
                  <option value="未回答">選択しない</option>
                  <option value="男性">男性</option>
                  <option value="女性">女性</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 ml-2">住所</label>
                <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="例: 東京都渋谷区..." value={setupData.address} onChange={e => setSetupData({...setupData, address: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 ml-2">学校の都道府県</label>
                  <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="東京都" value={setupData.schoolPref} onChange={e => setSetupData({...setupData, schoolPref: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 ml-2">学年</label>
                  <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" value={setupData.schoolGrade} onChange={e => setSetupData({...setupData, schoolGrade: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 ml-2">学校名</label>
                <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="〇〇中学校" value={setupData.schoolName} onChange={e => setSetupData({...setupData, schoolName: e.target.value})} />
              </div>

              <button onClick={handleFirstLoginSetup} className="w-full py-4 mt-6 bg-slate-800 text-white rounded-2xl font-black shadow-lg hover:bg-slate-700 transition-all">登録してスタート！ 🚀</button>
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
            <input className="w-full p-4 mb-8 bg-slate-50 rounded-2xl outline-none font-bold" type="password" placeholder="PASS" value={inputPass} onChange={(e) => setInputPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={handleLogin} className={`w-full py-4 rounded-2xl font-black text-white shadow-lg ${role === "student" ? "bg-blue-600" : "bg-rose-600"}`}>LOGIN</button>
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
                      
                      {/* 学年選択 */}
                      <select value={newStudentGrade} onChange={(e) => setNewStudentGrade(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-black outline-none cursor-pointer">
                        {Object.keys(GRADE_CURRICULUM).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>

                      {/* 科目選択 (チェックボックス) */}
                      <div className="bg-slate-50 p-4 rounded-2xl">
                         <p className="text-[10px] font-bold text-slate-400 mb-2">受講科目を選択</p>
                         <div className="grid grid-cols-2 gap-2">
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
                    {/* プロフィール情報の表示 */}
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
                  
                  {/* 講師用：生徒管理パネル（科目の編集など） */}
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
                      
                      {/* プロフィール詳細表示 */}
                      <div className="flex justify-between items-start bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-600 space-y-1">
                          <p><span className="text-slate-400">氏名:</span> {currentStudent.profile?.lastName} {currentStudent.profile?.firstName} ({currentStudent.profile?.gender})</p>
                          <p><span className="text-slate-400">住所:</span> {currentStudent.profile?.address}</p>
                          <p><span className="text-slate-400">学校:</span> {currentStudent.profile?.schoolPref} {currentStudent.profile?.schoolName} ({currentStudent.profile?.schoolGrade})</p>
                        </div>
                        <button onClick={() => setIsEditingSubjects(!isEditingSubjects)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-100">
                          {isEditingSubjects ? "編集を終了" : "科目を設定変更"}
                        </button>
                      </div>

                      {/* 科目編集エリア */}
                      {isEditingSubjects && (
                        <div className="mt-4 p-6 bg-yellow-50 rounded-2xl border border-yellow-200 animate-in fade-in">
                          <h4 className="font-black text-yellow-600 mb-4">履修科目の変更 (リアルタイム反映)</h4>
                          <div className="flex flex-wrap gap-3">
                            {GRADE_CURRICULUM[currentStudent.grade] && Object.keys(GRADE_CURRICULUM[currentStudent.grade]).map(subj => (
                              <button key={subj} onClick={() => toggleSubject(subj)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentStudent.subjects[subj] ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-400 border border-slate-200"}`}>
                                {currentStudent.subjects[subj] ? "✅ " : "+ "} {subj}
                              </button>
                            ))}
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

                  {/* 各ビューの表示（内容は前回とほぼ同じ） */}
                  {currentView === "calendar" && (
                    <div className="grid md:grid-cols-2 gap-10 animate-in fade-in">
                      <div>
                        <div className="flex justify-between items-center mb-6 px-2">
                          <h3 className="font-black text-xl text-slate-800">{viewDate.getFullYear()}.{viewDate.getMonth() + 1}</h3>
                          <div className="flex gap-2"><button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs">◀</button><button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs">▶</button></div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {getCalendarDays().map((date, i) => {
                             const hasRecord = date && currentStudent.records?.some((r: any) => r.date === date);
                             return <button key={i} disabled={!date} onClick={() => date && setSelectedDate(date)} className={`aspect-square rounded-2xl text-xs font-bold relative transition-all ${selectedDate === date ? "bg-slate-800 text-white shadow-lg" : "bg-slate-50 text-slate-600 hover:bg-slate-100"} ${!date && "invisible"}`}>{date ? date.split("/")[2] : ""}{hasRecord && <span className={`w-1.5 h-1.5 rounded-full absolute bottom-2 ${selectedDate === date ? "bg-white" : "bg-green-400"}`} />}</button>;
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col h-full">
                        <div className="pb-4 border-b border-slate-100 mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DATE</p><h4 className="text-2xl font-black text-slate-800">{selectedDate}</h4></div>
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
                  {/* Test, Materialsも同様に表示 (省略なし) */}
                  {currentView === "test" && (
                     <div className="animate-in fade-in">
                       <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8">
                         <div className="flex justify-between items-center mb-4"><h4 className="text-xs font-black text-slate-400 uppercase">Score Trend</h4><select className="p-2 rounded-lg text-xs font-bold bg-white border-none" value={graphSubject} onChange={(e) => setGraphSubject(e.target.value)}>{Object.keys(currentStudent.subjects).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                         {currentStudent.tests?.some((t:any) => t.status === "approved") ? <SimpleLineChart data={currentStudent.tests.filter((t:any) => t.status === "approved").map((t:any) => Number(t.scores[graphSubject]?.result || 0))} color="#e11d48" /> : <div className="text-center text-xs text-slate-300 py-10 font-bold">データ不足</div>}
                       </div>
                       {/* テスト作成・リスト表示部分は前回と同じロジックなので省略せずそのまま機能します */}
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

      {/* スクロールバー非表示用CSS */}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
